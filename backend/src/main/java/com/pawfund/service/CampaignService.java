package com.pawfund.service;

import com.pawfund.entity.Campaign;
import com.pawfund.entity.Shelter;
import com.pawfund.exception.ResourceNotFoundException;
import com.pawfund.repository.CampaignRepository;
import com.pawfund.repository.ShelterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final ShelterRepository shelterRepository;

    public List<Campaign> getAllCampaigns() {
        return campaignRepository.findAll();
    }

    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.ACTIVE);
    }

    public List<Campaign> getCampaignsByShelter(Long shelterId) {
        return campaignRepository.findByShelterId(shelterId);
    }

    public Campaign getCampaignById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
    }

    public Campaign createCampaign(Campaign campaign, Long shelterId) {
        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new ResourceNotFoundException("Shelter not found with id: " + shelterId));
        campaign.setShelter(shelter);
        campaign.setCurrentAmount(BigDecimal.ZERO);
        campaign.setStatus(Campaign.Status.ACTIVE);
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaign(Long id, Campaign details) {
        Campaign campaign = getCampaignById(id);
        if (details.getTitle() != null) campaign.setTitle(details.getTitle());
        if (details.getDescription() != null) campaign.setDescription(details.getDescription());
        if (details.getGoalAmount() != null) campaign.setGoalAmount(details.getGoalAmount());
        if (details.getDeadline() != null) campaign.setDeadline(details.getDeadline());
        if (details.getStatus() != null) campaign.setStatus(details.getStatus());
        if (details.getSpendingReport() != null) campaign.setSpendingReport(details.getSpendingReport());
        return campaignRepository.save(campaign);
    }

    public void addDonation(Long campaignId, BigDecimal amount) {
        Campaign campaign = getCampaignById(campaignId);
        BigDecimal newAmount = campaign.getCurrentAmount().add(amount);
        campaign.setCurrentAmount(newAmount);
        // Tự động đóng campaign khi đạt mục tiêu
        if (newAmount.compareTo(campaign.getGoalAmount()) >= 0) {
            campaign.setStatus(Campaign.Status.COMPLETED);
        }
        campaignRepository.save(campaign);
    }
}
