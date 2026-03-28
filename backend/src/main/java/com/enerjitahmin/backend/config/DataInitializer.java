package com.enerjitahmin.backend.config;

import com.enerjitahmin.backend.entity.Alarm;
import com.enerjitahmin.backend.entity.Facility;
import com.enerjitahmin.backend.entity.ProductionRecord;
import com.enerjitahmin.backend.entity.Region;
import com.enerjitahmin.backend.entity.User;
import com.enerjitahmin.backend.repository.AlarmRepository;
import com.enerjitahmin.backend.repository.FacilityRepository;
import com.enerjitahmin.backend.repository.ProductionRecordRepository;
import com.enerjitahmin.backend.repository.RegionRepository;
import com.enerjitahmin.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
            RegionRepository regionRepository,
            FacilityRepository facilityRepository,
            ProductionRecordRepository productionRecordRepository,
            AlarmRepository alarmRepository) {
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

            if (productionRecordRepository.count() == 0) {
                Facility gesKonya1 = facilityRepository.findAll().stream()
                        .filter(facility -> facility.getName().equals("GES Konya 1"))
                        .findFirst()
                        .orElse(null);

                if (gesKonya1 != null) {
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 23), 120.0, 118.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 24), 125.0, 121.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 25), 130.0, 126.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 26), 128.0, 110.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 27), 135.0, 132.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 28), 140.0, 95.0));
                    productionRecordRepository
                            .save(new ProductionRecord(gesKonya1, LocalDate.of(2026, 3, 29), 138.0, 136.0));
                }
            }

            if (alarmRepository.count() == 0) {
                Facility gesKonya1 = facilityRepository.findAll().stream()
                        .filter(facility -> facility.getName().equals("GES Konya 1"))
                        .findFirst()
                        .orElse(null);

                User manager1 = userRepository.findAll().stream()
                        .filter(user -> user.getUsername().equals("manager1"))
                        .findFirst()
                        .orElse(null);

                ProductionRecord record26 = productionRecordRepository.findAll().stream()
                        .filter(record -> record.getRecordDate().equals(LocalDate.of(2026, 3, 26)))
                        .findFirst()
                        .orElse(null);

                ProductionRecord record28 = productionRecordRepository.findAll().stream()
                        .filter(record -> record.getRecordDate().equals(LocalDate.of(2026, 3, 28)))
                        .findFirst()
                        .orElse(null);

                if (gesKonya1 != null && record26 != null) {
                    alarmRepository.save(new Alarm(
                            gesKonya1,
                            record26,
                            "PRODUCTION_DEVIATION",
                            "UYARI",
                            "Üretim-Tahmin Sapması",
                            "26 Mart tarihli üretim verisinde tahmin edilen ve gerçekleşen değer arasında dikkat gerektiren bir fark tespit edildi.",
                            "AKTIF",
                            LocalDateTime.of(2026, 3, 26, 18, 0),
                            null,
                            null));
                }

                if (gesKonya1 != null && record28 != null) {
                    alarmRepository.save(new Alarm(
                            gesKonya1,
                            record28,
                            "PRODUCTION_DEVIATION",
                            "KRITIK",
                            "Kritik Üretim Sapması",
                            "28 Mart tarihli üretim verisinde tahmin edilen ve gerçekleşen değer arasında kritik seviyede fark tespit edildi.",
                            "COZULDU",
                            LocalDateTime.of(2026, 3, 28, 18, 0),
                            LocalDateTime.of(2026, 3, 28, 20, 30),
                            manager1));
                }
            }
        };
    }
}