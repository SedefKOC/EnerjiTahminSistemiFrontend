package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.dto.ProductionChartPointDto;
import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import com.enerjitahmin.backend.service.ProductionChartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProductionRecordController {

    private final ProductionRecordRepository productionRecordRepository;
    private final ProductionChartService productionChartService;

    public ProductionRecordController(ProductionRecordRepository productionRecordRepository,
                                      ProductionChartService productionChartService) {
        this.productionRecordRepository = productionRecordRepository;
        this.productionChartService = productionChartService;
    }

    @GetMapping("/api/production-records")
    public List<ProductionRecord> getAllProductionRecords() {
        return productionRecordRepository.findAll();
    }

    @GetMapping("/api/production-records/facility/{facilityId}/weekly")
    public List<ProductionChartPointDto> getFacilityWeeklyChart(@PathVariable Long facilityId) {
        return productionChartService.getFacilityWeeklyChart(facilityId);
    }

    @GetMapping("/api/production-records/region/{regionId}/weekly")
    public List<ProductionChartPointDto> getRegionWeeklyChart(@PathVariable Long regionId) {
        return productionChartService.getRegionWeeklyChart(regionId);
    }

    @GetMapping("/api/production-records/executive/weekly")
    public List<ProductionChartPointDto> getExecutiveWeeklyChart(@RequestParam String plantType) {
        return productionChartService.getExecutiveWeeklyChart(plantType);
    }
}