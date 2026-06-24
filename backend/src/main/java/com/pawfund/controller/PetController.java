package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.dto.PetDto;
import com.pawfund.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping
    public ResponseEntity<Page<PetDto>> getAllPets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String petSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(petService.getAllPets(page, size, species, gender, petSize, search, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDto> getPetById(@PathVariable Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> createPet(
            @RequestParam String name,
            @RequestParam String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer ageMonths,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean vaccinated,
            @RequestParam(required = false) Boolean neutered,
            @RequestParam Long shelterId,
            @RequestParam(required = false) MultipartFile image,
            Authentication authentication) {

        PetDto dto = PetDto.builder()
                .name(name)
                .species(species)
                .breed(breed)
                .ageMonths(ageMonths)
                .gender(gender)
                .size(size)
                .description(description)
                .vaccinated(vaccinated)
                .neutered(neutered)
                .shelterId(shelterId)
                .build();

        PetDto created = petService.createPet(dto, image, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Pet created successfully", created));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> updatePet(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) Integer ageMonths,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Boolean vaccinated,
            @RequestParam(required = false) Boolean neutered,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) MultipartFile image) {

        PetDto dto = PetDto.builder()
                .name(name)
                .species(species)
                .breed(breed)
                .ageMonths(ageMonths)
                .gender(gender)
                .size(size)
                .description(description)
                .vaccinated(vaccinated)
                .neutered(neutered)
                .status(status)
                .build();

        PetDto updated = petService.updatePet(id, dto, image);
        return ResponseEntity.ok(ApiResponse.success("Pet updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok(ApiResponse.success("Pet deleted successfully"));
    }
}
