package com.pawfund.repository;

import com.pawfund.entity.LostPet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostPetRepository extends JpaRepository<LostPet, Long> {
    List<LostPet> findByStatusOrderByCreatedAtDesc(LostPet.Status status);
    List<LostPet> findByPostTypeOrderByCreatedAtDesc(LostPet.PostType postType);
    List<LostPet> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LostPet> findAllByOrderByCreatedAtDesc();
}

