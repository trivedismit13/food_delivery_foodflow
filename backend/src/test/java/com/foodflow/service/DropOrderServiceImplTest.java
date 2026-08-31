package com.foodflow.service;

import com.foodflow.dto.request.PlaceDropOrderRequest;
import com.foodflow.exception.InvalidOrderException;
import com.foodflow.model.FoodDrop;
import com.foodflow.repository.FoodDropRepository;
import com.foodflow.service.impl.DropOrderServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class DropOrderServiceImplTest {

    @Mock
    private FoodDropRepository dropRepository;

    @InjectMocks
    private DropOrderServiceImpl dropOrderService;

    @Test
    void testBookingFailsAfterCutoff() {
        FoodDrop drop = new FoodDrop();
        drop.setDropId(1L);
        drop.setStatus(FoodDrop.DropStatus.OPEN);
        drop.setOrderCutoffTime(LocalDateTime.now().minusMinutes(1)); // In the past!

        PlaceDropOrderRequest req = new PlaceDropOrderRequest();
        req.setDropId(1L);
        // User ID is passed separately in this method signature

        when(dropRepository.findByIdWithLock(1L)).thenReturn(Optional.of(drop));

        assertThrows(InvalidOrderException.class, () -> {
            dropOrderService.placeDropOrder(2L, req);
        });
    }
}
