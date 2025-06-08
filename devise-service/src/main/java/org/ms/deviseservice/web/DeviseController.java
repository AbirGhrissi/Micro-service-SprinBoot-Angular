package org.ms.deviseservice.web;

import org.ms.deviseservice.entities.Devise;
import org.ms.deviseservice.repositories.DeviseRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RefreshScope
@RequestMapping("/api/devises")
public class DeviseController {

    private final DeviseRepository deviseRepository;

    @Value("${app.default.baseCurrency:USD}")
    private String baseCurrency;

    public DeviseController(DeviseRepository deviseRepository) {
        this.deviseRepository = deviseRepository;
    }

    @GetMapping
    public List<Devise> getAllDevises() {
        return deviseRepository.findAll();
    }

    @GetMapping("/{code}")
    public Devise getByCode(@PathVariable String code) {
        return deviseRepository.findByCode(code);
    }

    @GetMapping("/convert")
    public Map<String, Double> convert(
            @RequestParam String from, 
            @RequestParam String to,
            @RequestParam double amount) {
        
        Devise source = deviseRepository.findByCode(from);
        Devise target = deviseRepository.findByCode(to);
        
        double convertedAmount = amount * (target.getTauxChange() / source.getTauxChange());
        
        return Map.of(
            "originalAmount", amount,
            "convertedAmount", convertedAmount,
            "rate", target.getTauxChange() / source.getTauxChange()
        );
    }

    @GetMapping("/config")
    public Map<String, String> showConfig() {
        return Map.of(
            "baseCurrency", baseCurrency,
            "serviceName", "devise-service"
        );
    }
}