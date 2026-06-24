package com.pawfund.service;

import com.pawfund.entity.LostPet;
import com.pawfund.entity.User;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.LostPetRepository;
import com.pawfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LostPetService {

    private final LostPetRepository lostPetRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public List<LostPet> getAllLostPets() {
        return lostPetRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<LostPet> getLostPetsByPostType(String postType) {
        LostPet.PostType type = LostPet.PostType.valueOf(postType.toUpperCase());
        return lostPetRepository.findByPostTypeOrderByCreatedAtDesc(type);
    }

    public List<LostPet> getActiveLostPets() {
        return lostPetRepository.findByStatusOrderByCreatedAtDesc(LostPet.Status.ACTIVE);
    }

    public LostPet createLostPet(LostPet lostPet, MultipartFile image, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        lostPet.setUser(user);
        lostPet.setStatus(LostPet.Status.ACTIVE);

        if (image != null && !image.isEmpty()) {
            lostPet.setImageUrl(saveImage(image));
        }

        return lostPetRepository.save(lostPet);
    }

    // Đánh dấu đã giải quyết (tìm được / trao trả)
    public LostPet resolve(Long id) {
        LostPet lostPet = lostPetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost pet post not found"));
        lostPet.setStatus(LostPet.Status.RESOLVED);
        return lostPetRepository.save(lostPet);
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
}

