package com.pawfund.repository;

import com.pawfund.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    List<Shelter> findByUserId(Long userId);
    Optional<Shelter> findByUserIdAndId(Long userId, Long shelterId);
    List<Shelter> findByStatus(Shelter.Status status);
}

