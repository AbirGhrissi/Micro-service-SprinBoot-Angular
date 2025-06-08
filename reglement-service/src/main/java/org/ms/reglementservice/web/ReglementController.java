package org.ms.reglementservice.web;

import org.ms.reglementservice.entities.Reglement;
import org.ms.reglementservice.repositories.ReglementRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reglements")
public class ReglementController {

    private final ReglementRepository reglementRepository;

    public ReglementController(ReglementRepository reglementRepository) {
        this.reglementRepository = reglementRepository;
    }

    @GetMapping
    public List<Reglement> getAllReglements() {
        return reglementRepository.findAll();
    }

    @GetMapping("/byFacture/{factureId}")
    public List<Reglement> getByFactureId(@PathVariable Long factureId) {
        return reglementRepository.findByFactureId(factureId);
    }

    @PostMapping
    public Reglement createReglement(@RequestBody Reglement reglement) {
        return reglementRepository.save(reglement);
    }
}