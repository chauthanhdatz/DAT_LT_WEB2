package com.pawfund.service;

import com.pawfund.dto.PetDto;
import com.pawfund.entity.Pet;
import com.pawfund.entity.Shelter;
import com.pawfund.entity.User;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.PetRepository;
import com.pawfund.repository.ShelterRepository;
import com.pawfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Page<PetDto> getAllPets(int page, int size, String species, String gender,
                                   String petSize, String search, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Pet.Status petStatus = status != null ? Pet.Status.valueOf(status) : Pet.Status.AVAILABLE;
        Pet.Species petSpecies = species != null ? Pet.Species.valueOf(species) : null;
        Pet.Gender petGender = gender != null ? Pet.Gender.valueOf(gender) : null;
        Pet.Size petSizeEnum = petSize != null ? Pet.Size.valueOf(petSize) : null;

        Page<Pet> pets = petRepository.findByFilters(petStatus, petSpecies, petGender, petSizeEnum, search, pageable);
        return pets.map(this::toDto);
    }

    public PetDto getPetById(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        return toDto(pet);
    }

    public PetDto createPet(PetDto dto, MultipartFile image, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Shelter shelter = shelterRepository.findById(dto.getShelterId())
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found"));

        Pet pet = Pet.builder()
                .shelter(shelter)
                .name(dto.getName())
                .species(Pet.Species.valueOf(dto.getSpecies()))
                .breed(dto.getBreed())
                .ageMonths(dto.getAgeMonths())
                .gender(dto.getGender() != null ? Pet.Gender.valueOf(dto.getGender()) : null)
                .size(dto.getSize() != null ? Pet.Size.valueOf(dto.getSize()) : null)
                .description(dto.getDescription())
                .vaccinated(dto.getVaccinated() != null ? dto.getVaccinated() : false)
                .neutered(dto.getNeutered() != null ? dto.getNeutered() : false)
                .status(Pet.Status.AVAILABLE)
                .build();

        if (image != null && !image.isEmpty()) {
            pet.setImageUrl(saveImage(image));
        }

        pet = petRepository.save(pet);
        return toDto(pet);
    }

    public PetDto updatePet(Long id, PetDto dto, MultipartFile image) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));

        if (dto.getName() != null) pet.setName(dto.getName());
        if (dto.getSpecies() != null) pet.setSpecies(Pet.Species.valueOf(dto.getSpecies()));
        if (dto.getBreed() != null) pet.setBreed(dto.getBreed());
        if (dto.getAgeMonths() != null) pet.setAgeMonths(dto.getAgeMonths());
        if (dto.getGender() != null) pet.setGender(Pet.Gender.valueOf(dto.getGender()));
        if (dto.getSize() != null) pet.setSize(Pet.Size.valueOf(dto.getSize()));
        if (dto.getDescription() != null) pet.setDescription(dto.getDescription());
        if (dto.getVaccinated() != null) pet.setVaccinated(dto.getVaccinated());
        if (dto.getNeutered() != null) pet.setNeutered(dto.getNeutered());
        if (dto.getStatus() != null) pet.setStatus(Pet.Status.valueOf(dto.getStatus()));

        if (image != null && !image.isEmpty()) {
            pet.setImageUrl(saveImage(image));
        }

        pet = petRepository.save(pet);
        return toDto(pet);
    }

    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with id: " + id);
        }
        petRepository.deleteById(id);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage());
        }
    }

    private PetDto toDto(Pet pet) {
        return PetDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies().name())
                .breed(pet.getBreed())
                .ageMonths(pet.getAgeMonths())
                .gender(pet.getGender() != null ? pet.getGender().name() : null)
                .size(pet.getSize() != null ? pet.getSize().name() : null)
                .description(pet.getDescription())
                .imageUrl(pet.getImageUrl())
                .status(pet.getStatus().name())
                .vaccinated(pet.getVaccinated())
                .neutered(pet.getNeutered())
                .createdAt(pet.getCreatedAt() != null ? pet.getCreatedAt().toString() : null)
                .shelterId(pet.getShelter().getId())
                .shelterName(pet.getShelter().getName())
                .shelterAddress(pet.getShelter().getAddress())
                .shelterPhone(pet.getShelter().getPhone())
                .build();
    }
}
