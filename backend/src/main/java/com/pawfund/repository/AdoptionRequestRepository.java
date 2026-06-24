package com.pawfund.repository;

import com.pawfund.entity.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {
    List<AdoptionRequest> findByUserId(Long userId);
    List<AdoptionRequest> findByPetId(Long petId);
    List<AdoptionRequest> findByPetShelterId(Long shelterId);
    boolean existsByPetIdAndUserId(Long petId, Long userId);
}
