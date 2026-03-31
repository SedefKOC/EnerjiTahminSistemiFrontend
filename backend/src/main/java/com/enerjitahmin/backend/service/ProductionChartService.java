package com.enerjitahmin.backend.service;

import com.enerjitahmin.backend.dto.ProductionChartPointDto;
import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductionChartService {

    private final ProductionRecordRepository productionRecordRepository;

    public ProductionChartService(ProductionRecordRepository productionRecordRepository) {
        this.productionRecordRepository = productionRecordRepository;
    }

    public List<ProductionChartPointDto> getFacilityWeeklyChart(Long facilityId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<ProductionRecord> records = productionRecordRepository
                .findByFacilityIdAndRecordDateBetweenOrderByRecordDateAsc(facilityId, startDate, endDate);

        List<ProductionChartPointDto> result = new ArrayList<>();
        for (ProductionRecord record : records) {
            result.add(new ProductionChartPointDto(
                    record.getRecordDate().toString(),
                    record.getPredictedEnergy(),
                    record.getActualEnergy()
            ));
        }
        return result;
    }

    public List<ProductionChartPointDto> getExecutiveWeeklyChart(String plantType) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<ProductionRecord> records = productionRecordRepository
                .findByPlantTypeAndDateRange(plantType, startDate, endDate);

        Map<LocalDate, double[]> grouped = new LinkedHashMap<>();
        for (ProductionRecord record : records) {
            LocalDate date = record.getRecordDate();
            grouped.computeIfAbsent(date, k -> new double[]{0.0, 0.0});
            grouped.get(date)[0] += record.getPredictedEnergy();
            grouped.get(date)[1] += record.getActualEnergy();
        }

        List<ProductionChartPointDto> result = new ArrayList<>();
        for (Map.Entry<LocalDate, double[]> entry : grouped.entrySet()) {
            result.add(new ProductionChartPointDto(
                    entry.getKey().toString(),
                    entry.getValue()[0],
                    entry.getValue()[1]
            ));
        }
        return result;
    }

    public List<ProductionChartPointDto> getRegionWeeklyChart(Long regionId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<ProductionRecord> records = productionRecordRepository
                .findByRegionIdAndDateRange(regionId, startDate, endDate);

        Map<LocalDate, double[]> grouped = new LinkedHashMap<>();
        for (ProductionRecord record : records) {
            LocalDate date = record.getRecordDate();
            grouped.computeIfAbsent(date, k -> new double[]{0.0, 0.0});
            grouped.get(date)[0] += record.getPredictedEnergy();
            grouped.get(date)[1] += record.getActualEnergy();
        }

        List<ProductionChartPointDto> result = new ArrayList<>();
        for (Map.Entry<LocalDate, double[]> entry : grouped.entrySet()) {
            result.add(new ProductionChartPointDto(
                    entry.getKey().toString(),
                    entry.getValue()[0],
                    entry.getValue()[1]
            ));
        }
        return result;
    }
}
