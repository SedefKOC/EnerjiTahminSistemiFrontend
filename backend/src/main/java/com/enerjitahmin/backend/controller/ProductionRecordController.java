package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductionRecordController {

    private final ProductionRecordRepository productionRecordRepository;

    public ProductionRecordController(ProductionRecordRepository productionRecordRepository) {
        this.productionRecordRepository = productionRecordRepository;
    }

    @GetMapping("/api/production-records")
    public List<ProductionRecord> getAllProductionRecords() {
        return productionRecordRepository.findAll();
    }
}