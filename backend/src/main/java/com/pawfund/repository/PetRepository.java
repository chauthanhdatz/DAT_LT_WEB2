package com.pawfund.repository;

import com.pawfund.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    Page<Pet> findByStatus(Pet.Status status, Pageable pageable);

    @Query("SELECT p FROM Pet p WHERE p.status = :status " +
           "AND (:species IS NULL OR p.species = :species) " +
           "AND (:gender IS NULL OR p.gender = :gender) " +
           "AND (:size IS NULL OR p.size = :size) " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "     OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Pet> findByFilters(
        @Param("status") Pet.Status status,
        @Param("species") Pet.Species species,
        @Param("gender") Pet.Gender gender,
        @Param("size") Pet.Size size,
        @Param("search") String search,
        Pageable pageable
    );

    List<Pet> findByShelterId(Long shelterId);

    long countByStatus(Pet.Status status);
}
