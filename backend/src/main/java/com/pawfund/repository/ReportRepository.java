package com.pawfund.repository;

import com.pawfund.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(Report.Status status);
    List<Report> findByReporterId(Long reporterId);
}
