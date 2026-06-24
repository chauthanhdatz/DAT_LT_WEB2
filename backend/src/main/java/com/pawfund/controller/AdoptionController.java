package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.entity.AdoptionRequest;
import com.pawfund.service.AdoptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;

    @PostMapping
    public ResponseEntity<ApiResponse> createRequest(
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        Long petId = Long.valueOf(body.get("petId").toString());
        String message = body.get("message") != null ? body.get("message").toString() : "";
        AdoptionRequest request = adoptionService.createRequest(petId, message, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Adoption request submitted", request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString() : null;
        AdoptionRequest request = adoptionService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Request updated", request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AdoptionRequest>> getMyRequests(Authentication authentication) {
        return ResponseEntity.ok(adoptionService.getRequestsByUser(authentication.getName()));
    }

    @GetMapping("/shelter/{shelterId}")
    public ResponseEntity<List<AdoptionRequest>> getShelterRequests(@PathVariable Long shelterId) {
        return ResponseEntity.ok(adoptionService.getRequestsByShelter(shelterId));
    }
}
