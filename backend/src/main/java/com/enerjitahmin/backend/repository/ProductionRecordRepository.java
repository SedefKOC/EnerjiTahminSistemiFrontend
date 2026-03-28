package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.ProductionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionRecordRepository extends JpaRepository<ProductionRecord, Long> {
}