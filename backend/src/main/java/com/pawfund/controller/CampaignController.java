package com.pawfund.controller;

import com.pawfund.dto.ApiResponse;
import com.pawfund.entity.Campaign;
import com.pawfund.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns(
            @RequestParam(required = false) String status) {
        if ("ACTIVE".equalsIgnoreCase(status)) {
            return ResponseEntity.ok(campaignService.getActiveCampaigns());
        }
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @GetMapping("/shelter/{shelterId}")
    public ResponseEntity<List<Campaign>> getCampaignsByShelter(@PathVariable Long shelterId) {
        return ResponseEntity.ok(campaignService.getCampaignsByShelter(shelterId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createCampaign(
            @RequestBody Campaign campaign,
            @RequestParam Long shelterId) {
        Campaign created = campaignService.createCampaign(campaign, shelterId);
        return ResponseEntity.ok(ApiResponse.success("Campaign created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCampaign(
            @PathVariable Long id,
            @RequestBody Campaign campaign) {
        Campaign updated = campaignService.updateCampaign(id, campaign);
        return ResponseEntity.ok(ApiResponse.success("Campaign updated successfully", updated));
    }
}
