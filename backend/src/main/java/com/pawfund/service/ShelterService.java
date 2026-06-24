package com.pawfund.service;

import com.pawfund.entity.Shelter;
import com.pawfund.entity.User;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.ShelterRepository;
import com.pawfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShelterService {

    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;

    // Lấy tất cả trạm đã được duyệt (public)
    public List<Shelter> getAllApprovedShelters() {
        return shelterRepository.findByStatus(Shelter.Status.APPROVED);
    }

    // Lấy tất cả trạm (admin only)
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    public Shelter getShelterById(Long id) {
        return shelterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with id: " + id));
    }

    public Shelter createShelter(Shelter shelter, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        shelter.setUser(user);
        shelter.setStatus(Shelter.Status.PENDING); // Chờ admin duyệt
        return shelterRepository.save(shelter);
    }

    public Shelter updateShelter(Long id, Shelter shelterDetails) {
        Shelter shelter = getShelterById(id);
        if (shelterDetails.getName() != null) shelter.setName(shelterDetails.getName());
        if (shelterDetails.getDescription() != null) shelter.setDescription(shelterDetails.getDescription());
        if (shelterDetails.getAddress() != null) shelter.setAddress(shelterDetails.getAddress());
        if (shelterDetails.getPhone() != null) shelter.setPhone(shelterDetails.getPhone());
        if (shelterDetails.getEmail() != null) shelter.setEmail(shelterDetails.getEmail());
        if (shelterDetails.getImageUrl() != null) shelter.setImageUrl(shelterDetails.getImageUrl());
        if (shelterDetails.getLicenseDoc() != null) shelter.setLicenseDoc(shelterDetails.getLicenseDoc());
        return shelterRepository.save(shelter);
    }

    // Admin: duyệt trạm cứu hộ
    public Shelter approveShelter(Long id) {
        Shelter shelter = getShelterById(id);
        shelter.setStatus(Shelter.Status.APPROVED);
        shelter.setRejectReason(null);
        // Cập nhật role user thành SHELTER sau khi được duyệt
        User owner = shelter.getUser();
        owner.setRole(User.Role.SHELTER);
        userRepository.save(owner);
        return shelterRepository.save(shelter);
    }

    // Admin: từ chối hoặc khóa trạm
    public Shelter banShelter(Long id, String reason) {
        Shelter shelter = getShelterById(id);
        shelter.setStatus(Shelter.Status.BANNED);
        shelter.setRejectReason(reason);
        return shelterRepository.save(shelter);
    }

    public List<Shelter> getSheltersByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return shelterRepository.findByUserId(user.getId());
    }

    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }
}

