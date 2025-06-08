package org.ms.produit_service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
    private long quantity;
    private String imageUrl;
    private String description;
    

    // Constructeur sans imageUrl pour la rétrocompatibilité
    public Produit(Long id, String name, double price, long quantity) {
        this(id, name, price, quantity, "assets/images/default-product.png");
    }
}