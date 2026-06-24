package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.entity.Shelter;
import com.pawfund.service.ShelterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shelters")
@RequiredArgsConstructor
public class ShelterController {

    private final ShelterService shelterService;

    @GetMapping
    public ResponseEntity<List<Shelter>> getAllShelters(
            @RequestParam(required = false) String status) {
        // Public endpoint: chỉ trả về approved nếu không có param
        if (status == null || status.equalsIgnoreCase("APPROVED")) {
            return ResponseEntity.ok(shelterService.getAllApprovedShelters());
        }
        // Admin có thể xem all
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Shelter>> getAllSheltersAdmin() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Long id) {
        return ResponseEntity.ok(shelterService.getShelterById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createShelter(@RequestBody Shelter shelter, Authentication authentication) {
        Shelter created = shelterService.createShelter(shelter, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Shelter registration submitted. Awaiting admin approval.", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateShelter(@PathVariable Long id, @RequestBody Shelter shelter) {
        Shelter updated = shelterService.updateShelter(id, shelter);
        return ResponseEntity.ok(ApiResponse.success("Shelter updated successfully", updated));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveShelter(@PathVariable Long id) {
        Shelter approved = shelterService.approveShelter(id);
        return ResponseEntity.ok(ApiResponse.success("Shelter approved successfully", approved));
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<ApiResponse> banShelter(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Vi phạm điều khoản sử dụng");
        Shelter banned = shelterService.banShelter(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Shelter banned", banned));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Shelter>> getMyShelters(Authentication authentication) {
        return ResponseEntity.ok(shelterService.getSheltersByUser(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
        return ResponseEntity.ok(ApiResponse.success("Shelter deleted successfully"));
    }
}

