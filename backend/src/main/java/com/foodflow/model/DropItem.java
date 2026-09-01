package com.foodflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Entity
@Table(name = "drop_items",
    uniqueConstraints = @UniqueConstraint(columnNames = {"drop_id", "item_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DropItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dropItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drop_id", nullable = false)
    private FoodDrop drop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantityAvailable;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityOrdered = 0;

    @Version
    private Long version;

    @Column(name = "drop_price", precision = 10, scale = 2)
    private BigDecimal dropPrice;

    public boolean isSoldOut() {
        return quantityOrdered >= quantityAvailable;
    }

    public BigDecimal getEffectivePrice() {
        return dropPrice != null ? dropPrice : menuItem.getPrice();
    }
}
