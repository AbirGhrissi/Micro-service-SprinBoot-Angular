package org.ms.produit_service;

import org.ms.produit_service.entities.Produit;
import org.ms.produit_service.repository.ProduitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

@SpringBootApplication
public class ProduitServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProduitServiceApplication.class, args);
    }

@Bean
CommandLineRunner start(ProduitRepository produitRepository, RepositoryRestConfiguration repositoryRestConfiguration) {
    repositoryRestConfiguration.exposeIdsFor(Produit.class);
    return args -> {
        // Ajout de produits au démarrage avec imageUrl
        produitRepository.save(new Produit(null, "PC", 1350, 100, "assets/images/lait.jpg","Un ordinateur portable performant"));
        produitRepository.save(new Produit(null, "Clavier", 230, 20, "assets/images/pain.jpg","Un clavier mécanique de haute qualité"));
        produitRepository.save(new Produit(null, "Souris", 460, 555, "assets/images/yaourt.jpg","Une souris ergonomique sans fil"));
        
        // Affichage des produits dans la console
        produitRepository.findAll().forEach(p -> {
            System.out.println(p.getName() + ":" + p.getPrice() + ":" + p.getQuantity());
        });
    };
}
   
}
