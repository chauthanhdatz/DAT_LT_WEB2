package com.pawfund.repository;

import com.pawfund.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByUserId(Long userId);
    List<Donation> findByShelterId(Long shelterId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d")
    BigDecimal getTotalDonations();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.shelter.id = :shelterId")
    BigDecimal getTotalDonationsByShelter(Long shelterId);
}
