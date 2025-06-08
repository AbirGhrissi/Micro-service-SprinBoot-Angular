package org.ms.reglementservice.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity 
@Data @NoArgsConstructor @AllArgsConstructor
public class Reglement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateReglement;
    private Double montant;
    private Long factureId; 
    private String modePaiement;
}