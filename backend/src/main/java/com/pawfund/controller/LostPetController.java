package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.entity.LostPet;
import com.pawfund.service.LostPetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lost-pets")
@RequiredArgsConstructor
public class LostPetController {

    private final LostPetService lostPetService;

    @GetMapping
    public ResponseEntity<List<LostPet>> getAllLostPets(
            @RequestParam(required = false) String postType,
            @RequestParam(required = false) String status) {
        if (postType != null) {
            return ResponseEntity.ok(lostPetService.getLostPetsByPostType(postType));
        }
        if ("ACTIVE".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(lostPetService.getActiveLostPets());
        }
        return ResponseEntity.ok(lostPetService.getAllLostPets());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> createLostPet(
            @RequestParam String petName,
            @RequestParam String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String contactPhone,
            @RequestParam(required = false, defaultValue = "LOST") String postType,
            @RequestParam(required = false) MultipartFile image,
            Authentication authentication) {

        LostPet lostPet = LostPet.builder()
                .petName(petName)
                .species(species)
                .breed(breed)
                .description(description)
                .location(location)
                .contactPhone(contactPhone)
                .postType(LostPet.PostType.valueOf(postType.toUpperCase()))
                .status(LostPet.Status.ACTIVE)
                .build();

        LostPet created = lostPetService.createLostPet(lostPet, image, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Lost pet report created", created));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse> resolveLostPet(
            @PathVariable Long id,
            Authentication authentication) {
        LostPet resolved = lostPetService.resolve(id);
        return ResponseEntity.ok(ApiResponse.success("Post marked as resolved", resolved));
    }
}

