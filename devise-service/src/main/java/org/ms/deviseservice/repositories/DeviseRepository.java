package org.ms.deviseservice.repositories;

import org.ms.deviseservice.entities.Devise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface DeviseRepository extends JpaRepository<Devise, Long> {
    Devise findByCode(String code);
}