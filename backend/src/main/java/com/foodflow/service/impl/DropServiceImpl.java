package com.foodflow.service;

import com.foodflow.exception.InvalidRequestException;
import com.foodflow.exception.ResourceNotFoundException;
import com.foodflow.model.*;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.repository.DropItemRepository;
import com.foodflow.repository.RestaurantRepository;
import com.foodflow.repository.MenuItemRepository;
import com.foodflow.dto.request.CreateDropRequest;
import com.foodflow.dto.request.UpdateDropRequest;
import com.foodflow.dto.request.AddDropItemRequest;
import com.foodflow.dto.response.FoodDropResponse;
import com.foodflow.dto.response.DropItemResponse;
import com.foodflow.dto.response.CreatorSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DropServiceImpl implements DropService {

    private final FoodDropRepository dropRepository;
    private final DropItemRepository dropItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final NotificationService notificationService;
    private final MenuItemRepository menuItemRepository;
    private final com.foodflow.repository.OrderRepository orderRepository;
    private final com.foodflow.service.security.CreatorAuthorizationService authorizationService;

    @Override
    @Transactional
    public FoodDropResponse createDrop(Long creatorId, CreateDropRequest request) {
        Restaurant creator = restaurantRepository.findByOwnerUserId(creatorId)
            .orElseThrow(() -> new ResourceNotFoundException("Creator not found: " + creatorId));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidRequestException("A drop must have at least one item.");
        }

        // Validate creator owns the items (or create them if new)
        for (com.foodflow.dto.request.DropItemRequest itemRequest : request.getItems()) {
            if (itemRequest.getItemId() != null) {
                MenuItem item = menuItemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
                if (item.getRestaurant() == null || item.getRestaurant().getRestaurantId() == null || !item.getRestaurant().getRestaurantId().equals(creator.getRestaurantId())) {
                    throw new InvalidRequestException("Item does not belong to your menu");
                }
            } else {
                if (itemRequest.getName() == null || itemRequest.getPrice() == null) {
                    throw new InvalidRequestException("New items must have a name and price.");
                }
                if (itemRequest.getPrice().compareTo(java.math.BigDecimal.ZERO) < 0) {
                    throw new InvalidRequestException("Price cannot be negative.");
                }
            }
        }
        
        if (request.getOrderCutoffTime() != null && request.getDropDate() != null) {
            if (request.getOrderCutoffTime().toLocalDate().isAfter(request.getDropDate())) {
                throw new InvalidRequestException("Order cutoff time cannot be after the drop date.");
            }
        }

        FoodDrop drop = FoodDrop.builder()
            .creator(creator)
            .title(request.getTitle())
            .description(request.getDescription())
            .dropDate(request.getDropDate())
            .orderCutoffTime(request.getOrderCutoffTime())
            .pickupLocation(request.getPickupLocation())
            .pickupTime(request.getPickupTime())
            .maxOrders(request.getMaxOrders())
            .dropPhotoUrl(request.getDropPhotoUrl())
            .specialNotes(request.getSpecialNotes())
            .status(FoodDrop.DropStatus.ANNOUNCED)
            .currentOrders(0)
            .build();

        FoodDrop saved = dropRepository.save(drop);
        
        java.util.List<DropItem> savedItems = new java.util.ArrayList<>();
        for (com.foodflow.dto.request.DropItemRequest itemRequest : request.getItems()) {
            MenuItem menuItem;
            if (itemRequest.getItemId() != null) {
                menuItem = menuItemRepository.getReferenceById(itemRequest.getItemId());
            } else {
                menuItem = new MenuItem();
                menuItem.setRestaurant(creator);
                menuItem.setName(itemRequest.getName());
                menuItem.setDescription(itemRequest.getDescription());
                menuItem.setPrice(itemRequest.getPrice() != null ? itemRequest.getPrice() : itemRequest.getDropPrice());
                menuItem.setIsVeg(itemRequest.getIsVegetarian() != null ? itemRequest.getIsVegetarian() : false);
                menuItem.setCategory("DROP_SPECIAL");
                menuItem.setAvailableQty(request.getMaxOrders() * (itemRequest.getMaxQuantityPerOrder() != null ? itemRequest.getMaxQuantityPerOrder() : 1));
                menuItem.setIsDeleted(false);
                menuItem = menuItemRepository.save(menuItem);
            }

            DropItem dropItem = DropItem.builder()
                .drop(saved)
                .menuItem(menuItem)
                .quantityAvailable(itemRequest.getQuantityAvailable() != null ? itemRequest.getQuantityAvailable() : (request.getMaxOrders() * (itemRequest.getMaxQuantityPerOrder() != null ? itemRequest.getMaxQuantityPerOrder() : 1)))
                .quantityOrdered(0)
                .dropPrice(itemRequest.getDropPrice() != null ? itemRequest.getDropPrice() : itemRequest.getPrice())
                .build();
            savedItems.add(dropItemRepository.save(dropItem));
        }
        
        saved.setDropItems(savedItems);

        // If status immediately OPEN (or ANNOUNCED), notify followers
        // Note: keeping it simple based on the spec
        if (saved.getStatus() == FoodDrop.DropStatus.OPEN) {
            notificationService.notifyFollowers(
                creatorId,
                Notification.NotificationType.DROP_OPEN,
                "New Drop from " + creator.getName() + "!",
                saved.getTitle() + " is open. " + saved.getMaxOrders() + " slots available.",
                Notification.ReferenceType.DROP,
                saved.getDropId()
            );
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public FoodDropResponse updateDrop(Long dropId, UpdateDropRequest request) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        FoodDrop drop = dropRepository.findById(dropId)
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found: " + dropId));

        if (drop.getStatus() != FoodDrop.DropStatus.DRAFT && drop.getStatus() != FoodDrop.DropStatus.ANNOUNCED) {
            throw new InvalidRequestException("Cannot edit a drop that is already " + drop.getStatus());
        }

        if (request.getTitle() != null) drop.setTitle(request.getTitle());
        if (request.getDescription() != null) drop.setDescription(request.getDescription());
        if (request.getDropDate() != null) drop.setDropDate(request.getDropDate());
        if (request.getOrderCutoffTime() != null) drop.setOrderCutoffTime(request.getOrderCutoffTime());
        if (request.getPickupLocation() != null) drop.setPickupLocation(request.getPickupLocation());
        if (request.getPickupTime() != null) drop.setPickupTime(request.getPickupTime());
        if (request.getMaxOrders() != null) drop.setMaxOrders(request.getMaxOrders());
        if (request.getDropPhotoUrl() != null) drop.setDropPhotoUrl(request.getDropPhotoUrl());
        if (request.getSpecialNotes() != null) drop.setSpecialNotes(request.getSpecialNotes());

        LocalDate date = drop.getDropDate();
        LocalDateTime cutoff = drop.getOrderCutoffTime();
        if (cutoff != null && date != null && cutoff.toLocalDate().isAfter(date)) {
            throw new InvalidRequestException("Order cutoff time cannot be after the drop date.");
        }

        FoodDrop saved = dropRepository.save(drop);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public FoodDropResponse updateDropStatus(Long dropId, FoodDrop.DropStatus newStatus) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        FoodDrop drop = dropRepository.findById(dropId)
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found: " + dropId));
        
        validateStatusTransition(drop.getStatus(), newStatus);
        
        if (newStatus == FoodDrop.DropStatus.OPEN) {
            if (drop.getPickupLocation() == null || drop.getPickupLocation().trim().isEmpty() ||
                drop.getPickupTime() == null || drop.getPickupTime().trim().isEmpty()) {
                throw new InvalidRequestException("Cannot open drop: pickup location and time must be provided.");
            }
        }
        
        drop.setStatus(newStatus);
        FoodDrop saved = dropRepository.save(drop);
        
        if (newStatus == FoodDrop.DropStatus.OPEN) {
            notificationService.notifyFollowers(
                drop.getCreator().getRestaurantId(),
                Notification.NotificationType.DROP_OPEN,
                "Drop is Open!",
                drop.getTitle() + " is now accepting orders. Closes at " + 
                drop.getOrderCutoffTime().toString(),
                Notification.ReferenceType.DROP,
                drop.getDropId()
            );
        }
        
        if (newStatus == FoodDrop.DropStatus.READY) {
            java.util.List<com.foodflow.model.Order> orders = orderRepository.findByDropDropIdAndStatusNot(dropId, com.foodflow.model.OrderStatus.CANCELLED);
            for (com.foodflow.model.Order o : orders) {
                o.setStatus(com.foodflow.model.OrderStatus.READY);
                orderRepository.save(o);
                
                notificationService.sendNotification(
                    o.getUser().getUserId(),
                    Notification.NotificationType.ORDER_READY,
                    "Your food is ready! 🎉",
                    drop.getTitle() + " is ready for collection.",
                    Notification.ReferenceType.ORDER,
                    o.getOrderId()
                );
            }
        }
        
        if (newStatus == FoodDrop.DropStatus.CUTOFF) {
            java.util.List<com.foodflow.model.Order> orders = orderRepository.findByDropDropIdAndStatusNot(dropId, com.foodflow.model.OrderStatus.CANCELLED);
            for (com.foodflow.model.Order o : orders) {
                o.setStatus(com.foodflow.model.OrderStatus.PREPARING);
                orderRepository.save(o);
            }
        }
        
        if (newStatus == FoodDrop.DropStatus.COMPLETED) {
            java.util.List<com.foodflow.model.Order> orders = orderRepository.findByDropDropIdAndStatusNot(dropId, com.foodflow.model.OrderStatus.CANCELLED);
            for (com.foodflow.model.Order o : orders) {
                o.setStatus(com.foodflow.model.OrderStatus.COMPLETED);
                orderRepository.save(o);
            }
        }
        
        return mapToResponse(saved);
    }

    @Override
    public FoodDropResponse getDropById(Long dropId) {
        FoodDrop drop = dropRepository.findById(dropId)
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found: " + dropId));
        return mapToResponse(drop);
    }

    @Override
    public org.springframework.data.domain.Page<FoodDropResponse> getCreatorDrops(Long creatorId, List<FoodDrop.DropStatus> statuses, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<FoodDrop> drops;
        if (statuses != null && !statuses.isEmpty()) {
            drops = dropRepository.findByCreatorOwnerUserIdAndStatusIn(creatorId, statuses, pageable);
        } else {
            drops = dropRepository.findByCreatorOwnerUserIdAndStatusIn(creatorId, 
                List.of(FoodDrop.DropStatus.values()), pageable);
        }
        return drops.map(this::mapToResponse);
    }

    @Override
    public org.springframework.data.domain.Page<FoodDropResponse> getActiveDropsFeed(String creatorType, String date, String sortBy, String query, org.springframework.data.domain.Pageable pageable) {
        
        org.springframework.data.domain.Pageable sortedPageable = pageable;
        if ("closingSoonest".equals(sortBy)) {
            sortedPageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), 
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.ASC, "order_cutoff_time")
            );
        } else if ("newest".equals(sortBy)) {
             sortedPageable = org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), 
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "drop_id")
            );
        }

        // Use native query to fetch active drops
        org.springframework.data.domain.Page<FoodDrop> drops = dropRepository.findActiveDrops(
            creatorType, date, query, sortedPageable
        );
        return drops.map(this::mapToResponse);
    }

    @Override
    public org.springframework.data.domain.Page<FoodDropResponse> getFollowedCreatorDrops(Long userId, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<FoodDrop> drops = dropRepository.findDropsFromFollowedCreators(userId, pageable);
        return drops.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void addItemToDrop(Long dropId, AddDropItemRequest request) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        FoodDrop drop = dropRepository.findById(dropId)
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found: " + dropId));

        if (drop.getStatus() != FoodDrop.DropStatus.DRAFT && drop.getStatus() != FoodDrop.DropStatus.ANNOUNCED) {
            throw new InvalidRequestException("Cannot add items to a drop that is " + drop.getStatus());
        }

        DropItem item = DropItem.builder()
            .drop(drop)
            .quantityAvailable(request.getQuantityAvailable())
            .dropPrice(request.getDropPrice())
            .quantityOrdered(0)
            .build();

        dropItemRepository.save(item);
    }

    @Override
    @Transactional
    public void removeItemFromDrop(Long dropId, Long itemId) {
        authorizationService.assertCreatorOwnsDrop(dropId);
        FoodDrop drop = dropRepository.findById(dropId)
            .orElseThrow(() -> new ResourceNotFoundException("Drop not found: " + dropId));

        if (drop.getStatus() != FoodDrop.DropStatus.DRAFT && drop.getStatus() != FoodDrop.DropStatus.ANNOUNCED) {
            throw new InvalidRequestException("Cannot remove items from a drop that is " + drop.getStatus());
        }

        dropItemRepository.deleteById(itemId);
    }

    // ── Mapping ─────────────────────────────────────────────

    private FoodDropResponse mapToResponse(FoodDrop drop) {
        FoodDropResponse response = new FoodDropResponse();
        response.setDropId(drop.getDropId());
        response.setTitle(drop.getTitle());
        response.setDescription(drop.getDescription());
        response.setDropDate(drop.getDropDate());
        response.setOrderCutoffTime(drop.getOrderCutoffTime());
        response.setPickupTime(drop.getPickupTime());
        response.setPickupLocation(drop.getPickupLocation());
        response.setMaxOrders(drop.getMaxOrders());
        response.setCurrentOrders(drop.getCurrentOrders());
        response.setAvailableSlots(drop.availableSlots());
        response.setIsSoldOut(drop.isSoldOut());
        response.setStatus(drop.getStatus().name());
        response.setDropPhotoUrl(drop.getDropPhotoUrl());
        response.setSpecialNotes(drop.getSpecialNotes());

        // Minutes until cutoff
        if (drop.getOrderCutoffTime() != null && drop.getOrderCutoffTime().isAfter(LocalDateTime.now())) {
            response.setMinutesUntilCutoff(ChronoUnit.MINUTES.between(LocalDateTime.now(), drop.getOrderCutoffTime()));
        } else {
            response.setMinutesUntilCutoff(0L);
        }

        // Creator summary
        if (drop.getCreator() != null) {
            Restaurant r = drop.getCreator();
            CreatorSummary cs = new CreatorSummary();
            cs.setRestaurantId(r.getRestaurantId());
            cs.setName(r.getName());
            cs.setVerificationLevel(r.getVerificationLevel());
            cs.setCreatorType(r.getCreatorType());
            cs.setAvgRating(r.getAvgRating());
            cs.setFollowerCount(r.getFollowerCount());
            cs.setTotalOrdersCompleted(r.getTotalOrdersCompleted());
            cs.setIsAcceptingOrders(r.getIsAcceptingOrders());
            response.setCreator(cs);
        }

        // Drop items
        if (drop.getDropItems() != null) {
            response.setItems(drop.getDropItems().stream().map(this::mapItemToResponse).collect(Collectors.toList()));
        }

        return response;
    }

    private DropItemResponse mapItemToResponse(DropItem item) {
        DropItemResponse response = new DropItemResponse();
        response.setItemId(item.getDropItemId());
        if (item.getMenuItem() != null) {
            response.setName(item.getMenuItem().getName());
            response.setDescription(item.getMenuItem().getDescription());
            response.setIsVeg(item.getMenuItem().getIsVeg());
            response.setPrice(item.getMenuItem().getPrice());
        }
        response.setDropPrice(item.getDropPrice());
        response.setQuantityAvailable(item.getQuantityAvailable());
        response.setQuantityOrdered(item.getQuantityOrdered());
        response.setIsSoldOut(item.isSoldOut());
        return response;
    }

    private void validateStatusTransition(FoodDrop.DropStatus current, FoodDrop.DropStatus next) {
        Map<FoodDrop.DropStatus, List<FoodDrop.DropStatus>> validTransitions = Map.of(
            FoodDrop.DropStatus.DRAFT, List.of(FoodDrop.DropStatus.ANNOUNCED, FoodDrop.DropStatus.CANCELLED),
            FoodDrop.DropStatus.ANNOUNCED, List.of(FoodDrop.DropStatus.OPEN, FoodDrop.DropStatus.CANCELLED),
            FoodDrop.DropStatus.OPEN, List.of(FoodDrop.DropStatus.CUTOFF, FoodDrop.DropStatus.CANCELLED),
            FoodDrop.DropStatus.CUTOFF, List.of(FoodDrop.DropStatus.READY, FoodDrop.DropStatus.CANCELLED),
            FoodDrop.DropStatus.READY, List.of(FoodDrop.DropStatus.COMPLETED, FoodDrop.DropStatus.CANCELLED),
            FoodDrop.DropStatus.COMPLETED, List.of(),
            FoodDrop.DropStatus.CANCELLED, List.of()
        );
        
        if (!validTransitions.get(current).contains(next)) {
            throw new InvalidRequestException(
                "Cannot transition drop from " + current + " to " + next
            );
        }
    }
}
