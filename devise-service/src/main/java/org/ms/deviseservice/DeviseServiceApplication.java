package org.ms.deviseservice;

import org.ms.deviseservice.entities.Devise;
import org.ms.deviseservice.repositories.DeviseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;

@SpringBootApplication
@EnableDiscoveryClient
public class DeviseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeviseServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(DeviseRepository deviseRepository, 
                          RepositoryRestConfiguration config) {
        return args -> {
            config.exposeIdsFor(Devise.class);
            
            // Données initiales
            deviseRepository.save(new Devise(null, "USD", "Dollar américain", 1.0));
            deviseRepository.save(new Devise(null, "EUR", "Euro", 0.92));
            deviseRepository.save(new Devise(null, "MAD", "Dirham marocain", 9.81));
        };
    }
}