package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.dto.DonationDto;
import com.pawfund.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<ApiResponse> createDonation(@RequestBody DonationDto dto, Authentication authentication) {
        DonationDto donation = donationService.createDonation(dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Donation successful! Thank you!", donation));
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationDto>> getMyDonations(Authentication authentication) {
        return ResponseEntity.ok(donationService.getDonationsByUser(authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<DonationDto>> getAllDonations() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }
}
