package com.enerjitahmin.backend.service;

import com.enerjitahmin.backend.entity.Alarm;
import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.repository.AlarmRepository;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlarmGenerationService {

    private final ProductionRecordRepository productionRecordRepository;
    private final AlarmRepository alarmRepository;

    public AlarmGenerationService(ProductionRecordRepository productionRecordRepository,
                                  AlarmRepository alarmRepository) {
        this.productionRecordRepository = productionRecordRepository;
        this.alarmRepository = alarmRepository;
    }

    public void generateAlarms() {
        List<ProductionRecord> records = productionRecordRepository.findAll();

        for (ProductionRecord record : records) {
            double predicted = record.getPredictedEnergy();
            double actual = record.getActualEnergy();

            if (predicted == 0) {
                continue;
            }

            if (alarmRepository.existsByProductionRecordId(record.getId())) {
                continue;
            }

            double deviation = Math.abs(actual - predicted) / predicted * 100;

            String severity = null;

            if (deviation >= 10 && deviation < 20) {
                severity = "UYARI";
            } else if (deviation >= 20) {
                severity = "KRITIK";
            } else {
                continue;
            }

            Alarm alarm = new Alarm();
            alarm.setFacility(record.getFacility());
            alarm.setProductionRecord(record);
            alarm.setAlarmType("PRODUCTION_DEVIATION");
            alarm.setSeverity(severity);
            alarm.setTitle(
                    severity.equals("KRITIK")
                            ? "Kritik Üretim Sapması"
                            : "Üretim-Tahmin Sapması"
            );
            alarm.setDescription(
                    record.getRecordDate() + " tarihli üretimde tahmin ve gerçekleşen değerler arasında %"
                            + String.format("%.1f", deviation)
                            + " sapma tespit edildi."
            );
            alarm.setStatus("AKTIF");
            alarm.setCreatedAt(LocalDateTime.now());
            alarm.setResolvedAt(null);
            alarm.setResolvedBy(null);

            alarmRepository.save(alarm);
        }
    }
}