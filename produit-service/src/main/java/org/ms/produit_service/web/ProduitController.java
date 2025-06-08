package org.ms.produit_service.web;

import org.ms.produit_service.entities.Produit;
import org.ms.produit_service.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/produits")
@RefreshScope
public class ProduitController {

    private final ProduitRepository produitRepository;

    @Value("${globalParam:1000}")
    private int globalParam;

    @Value("${monParam:2000}")
    private int monParam;

    @Value("${email:contact@default.com}")
    private String email;

    public ProduitController(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    @GetMapping("/config")
    public Map<String, Object> getConfig() {
        Map<String, Object> config = new Hashtable<>();
        config.put("globalParam", globalParam);
        config.put("monParam", monParam);
        config.put("email", email);
        config.put("threadName", Thread.currentThread().toString());
        return config;
    }

    // GET all
    @GetMapping
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    // POST (ajout d'un produit avec un URL d'image)
    @PostMapping
    public Produit addProduit(@RequestBody Produit produit) {
        if (produit.getImageUrl() == null || produit.getImageUrl().isEmpty()) {
            produit.setImageUrl("assets/images/default-product.png");
        }
        return produitRepository.save(produit);
    }

    @PutMapping("/{id}")
    public Produit updateProduit(@PathVariable Long id, @RequestBody Produit produit) {
        produit.setId(id);
        return produitRepository.save(produit);
    }

    @DeleteMapping("/{id}")
    public void deleteProduit(@PathVariable Long id) {
        produitRepository.deleteById(id);
    }
}
