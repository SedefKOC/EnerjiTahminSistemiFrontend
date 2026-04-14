package com.enerjitahmin.backend.config;

import com.enerjitahmin.backend.entity.Facility;
import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.entity.Region;
import com.enerjitahmin.backend.entity.User;
import com.enerjitahmin.backend.repository.FacilityRepository;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import com.enerjitahmin.backend.repository.RegionRepository;
import com.enerjitahmin.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;


@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
            RegionRepository regionRepository,
            FacilityRepository facilityRepository,
            ProductionRecordRepository productionRecordRepository) {
        return args -> {

            if (regionRepository.count() == 0) {
                regionRepository.save(new Region("İç Anadolu", "GES"));
                regionRepository.save(new Region("Ege", "GES"));
                regionRepository.save(new Region("Karadeniz", "HES"));
                regionRepository.save(new Region("Akdeniz", "HES"));
            }

            if (facilityRepository.count() == 0) {
                Region icAnadoluGes = regionRepository.findAll().stream()
                        .filter(region -> region.getName().equals("İç Anadolu") && region.getPlantType().equals("GES"))
                        .findFirst()
                        .orElse(null);

                Region egeGes = regionRepository.findAll().stream()
                        .filter(region -> region.getName().equals("Ege") && region.getPlantType().equals("GES"))
                        .findFirst()
                        .orElse(null);

                Region karadenizHes = regionRepository.findAll().stream()
                        .filter(region -> region.getName().equals("Karadeniz") && region.getPlantType().equals("HES"))
                        .findFirst()
                        .orElse(null);

                Region akdenizHes = regionRepository.findAll().stream()
                        .filter(region -> region.getName().equals("Akdeniz") && region.getPlantType().equals("HES"))
                        .findFirst()
                        .orElse(null);

                if (icAnadoluGes != null) {
                    facilityRepository.save(new Facility("GES Konya 1", "GES", icAnadoluGes, true));
                    facilityRepository.save(new Facility("GES Aksaray 1", "GES", icAnadoluGes, true));
                }

                if (egeGes != null) {
                    facilityRepository.save(new Facility("GES İzmir 1", "GES", egeGes, true));
                }

                if (karadenizHes != null) {
                    facilityRepository.save(new Facility("Baraj A", "HES", karadenizHes, true));
                }

                if (akdenizHes != null) {
                    facilityRepository.save(new Facility("Baraj B", "HES", akdenizHes, true));
                }
            }

            if (userRepository.count() == 0) {
                Region icAnadoluGes = regionRepository.findAll().stream()
                        .filter(region -> region.getName().equals("İç Anadolu") && region.getPlantType().equals("GES"))
                        .findFirst()
                        .orElse(null);

                Facility gesKonya1 = facilityRepository.findAll().stream()
                        .filter(facility -> facility.getName().equals("GES Konya 1"))
                        .findFirst()
                        .orElse(null);

                userRepository.save(new User(
                        "Ahmet",
                        "Yılmaz",
                        "operator1",
                        "1234",
                        "ahmet.yilmaz@example.com",
                        "05550000001",
                        "TESIS_GOREVLISI",
                        "GES",
                        icAnadoluGes,
                        gesKonya1,
                        true));

                userRepository.save(new User(
                        "Ayşe",
                        "Demir",
                        "manager1",
                        "1234",
                        "ayse.demir@example.com",
                        "05550000002",
                        "TESIS_YONETICISI",
                        "GES",
                        icAnadoluGes,
                        gesKonya1,
                        true));

                userRepository.save(new User(
                        "Mehmet",
                        "Kaya",
                        "region1",
                        "1234",
                        "mehmet.kaya@example.com",
                        "05550000003",
                        "BOLGE_YONETICISI",
                        "GES",
                        icAnadoluGes,
                        null,
                        true));

                userRepository.save(new User(
                        "Zeynep",
                        "Acar",
                        "executive1",
                        "1234",
                        "zeynep.acar@example.com",
                        "05550000004",
                        "UST_YONETICI",
                        "GES",
                        null,
                        null,
                        true));
            }

            // Son 7 günde kayıt yoksa (sabit tarihli eski veri veya ilk çalışma) yeniden ekle
            Facility gesKonya1 = facilityRepository.findAll().stream()
                    .filter(facility -> facility.getName().equals("GES Konya 1"))
                    .findFirst()
                    .orElse(null);

            if (gesKonya1 != null) {
                LocalDate today = LocalDate.now();
                java.util.List<ProductionRecord> recentRecords = productionRecordRepository
                        .findByFacilityIdAndRecordDateBetweenOrderByRecordDateAsc(
                                gesKonya1.getId(), today.minusDays(6), today);

                if (recentRecords.isEmpty()) {
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(6), 120.0, 118.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(5), 125.0, 121.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(4), 130.0, 126.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(3), 128.0, 110.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(2), 135.0, 132.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today.minusDays(1), 140.0, 95.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, today, 138.0, 136.0));
                }
            }


        };
    }
}