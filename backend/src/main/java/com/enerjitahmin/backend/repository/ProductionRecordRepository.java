package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.ProductionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductionRecordRepository extends JpaRepository<ProductionRecord, Long> {

    List<ProductionRecord> findByFacilityIdAndRecordDateBetweenOrderByRecordDateAsc(
            Long facilityId,
            LocalDate startDate,
            LocalDate endDate
    );

    @Query("SELECT pr FROM ProductionRecord pr " +
            "WHERE pr.facility.region.id = :regionId " +
            "AND pr.recordDate BETWEEN :startDate AND :endDate " +
            "ORDER BY pr.recordDate ASC")
    List<ProductionRecord> findByRegionIdAndDateRange(
            @Param("regionId") Long regionId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}