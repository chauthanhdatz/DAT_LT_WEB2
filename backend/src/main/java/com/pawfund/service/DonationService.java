package com.pawfund.service;

import com.pawfund.dto.DonationDto;
import com.pawfund.entity.Campaign;
import com.pawfund.entity.Donation;
import com.pawfund.entity.Shelter;
import com.pawfund.entity.User;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.DonationRepository;
import com.pawfund.repository.ShelterRepository;
import com.pawfund.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final CampaignService campaignService;

    public DonationDto createDonation(DonationDto dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Shelter shelter = null;
        if (dto.getShelterId() != null) {
            shelter = shelterRepository.findById(dto.getShelterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shelter not found"));
        }
        
        Campaign campaign = null;
        if (dto.getCampaignId() != null) {
            campaign = campaignService.getCampaignById(dto.getCampaignId());
            if (shelter == null) shelter = campaign.getShelter();
        }

        Donation donation = Donation.builder()
                .user(user)
                .shelter(shelter)
                .campaign(campaign)
                .amount(dto.getAmount())
                .message(dto.getMessage())
                .build();

        donation = donationRepository.save(donation);
        
        if (campaign != null) {
            campaignService.addDonation(campaign.getId(), dto.getAmount());
        }
        
        return toDto(donation);
    }

    public List<DonationDto> getDonationsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return donationRepository.findByUserId(user.getId()).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<DonationDto> getAllDonations() {
        return donationRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalDonations() {
        return donationRepository.getTotalDonations();
    }

    private DonationDto toDto(Donation donation) {
        return DonationDto.builder()
                .id(donation.getId())
                .userId(donation.getUser().getId())
                .username(donation.getUser().getUsername())
                .shelterId(donation.getShelter() != null ? donation.getShelter().getId() : null)
                .shelterName(donation.getShelter() != null ? donation.getShelter().getName() : null)
                .campaignId(donation.getCampaign() != null ? donation.getCampaign().getId() : null)
                .campaignTitle(donation.getCampaign() != null ? donation.getCampaign().getTitle() : null)
                .amount(donation.getAmount())
                .message(donation.getMessage())
                .createdAt(donation.getCreatedAt() != null ? donation.getCreatedAt().toString() : null)
                .build();
    }
}
