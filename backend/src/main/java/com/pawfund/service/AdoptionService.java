package com.pawfund.service;

import com.pawfund.entity.AdoptionRequest;
import com.pawfund.entity.Pet;
import com.pawfund.entity.User;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.AdoptionRequestRepository;
import com.pawfund.repository.PetRepository;
import com.pawfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public AdoptionRequest createRequest(Long petId, String message, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));

        if (pet.getStatus() != Pet.Status.AVAILABLE) {
            throw new IllegalArgumentException("Pet is not available for adoption");
        }

        if (adoptionRequestRepository.existsByPetIdAndUserId(petId, user.getId())) {
            throw new IllegalArgumentException("You already submitted a request for this pet");
        }

        AdoptionRequest request = AdoptionRequest.builder()
                .pet(pet)
                .user(user)
                .message(message)
                .status(AdoptionRequest.Status.PENDING)
                .build();

        pet.setStatus(Pet.Status.PENDING);
        petRepository.save(pet);

        return adoptionRequestRepository.save(request);
    }

    public AdoptionRequest updateStatus(Long requestId, String status) {
        AdoptionRequest request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Adoption request not found"));

        AdoptionRequest.Status newStatus = AdoptionRequest.Status.valueOf(status);
        request.setStatus(newStatus);

        Pet pet = request.getPet();
        if (newStatus == AdoptionRequest.Status.APPROVED) {
            pet.setStatus(Pet.Status.ADOPTED);
        } else if (newStatus == AdoptionRequest.Status.REJECTED) {
            pet.setStatus(Pet.Status.AVAILABLE);
        }
        petRepository.save(pet);

        return adoptionRequestRepository.save(request);
    }

    public List<AdoptionRequest> getRequestsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return adoptionRequestRepository.findByUserId(user.getId());
    }

    public List<AdoptionRequest> getRequestsByShelter(Long shelterId) {
        return adoptionRequestRepository.findByPetShelterId(shelterId);
    }
}
