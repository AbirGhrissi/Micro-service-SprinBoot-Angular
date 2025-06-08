package org.ms.reglementservice;

import org.ms.reglementservice.entities.Reglement;
import org.ms.reglementservice.repositories.ReglementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ReglementServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReglementServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(ReglementRepository reglementRepository) {
        return args -> {
            // Données de test
            reglementRepository.save(new Reglement(null, LocalDateTime.now(), 1500.0, 1L, "Carte"));
            reglementRepository.save(new Reglement(null, LocalDateTime.now(), 2300.0, 2L, "Virement"));
        };
    }
}