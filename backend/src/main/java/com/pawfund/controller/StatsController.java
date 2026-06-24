package com.pawfund.controller;

import com.pawfund.repository.DonationRepository;
import com.pawfund.repository.PetRepository;
import com.pawfund.repository.ShelterRepository;
import com.pawfund.repository.UserRepository;
import com.pawfund.entity.Pet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final PetRepository petRepository;
    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPets", petRepository.count());
        stats.put("availablePets", petRepository.countByStatus(Pet.Status.AVAILABLE));
        stats.put("adoptedPets", petRepository.countByStatus(Pet.Status.ADOPTED));
        stats.put("totalShelters", shelterRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalDonations", donationRepository.getTotalDonations());
        return ResponseEntity.ok(stats);
    }
}
