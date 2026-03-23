package com.enerjitahmin.backend.config;

import com.enerjitahmin.backend.entity.User;
import com.enerjitahmin.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                        "Ahmet",
                        "Yılmaz",
                        "operator1",
                        "1234",
                        "ahmet.yilmaz@example.com",
                        "05550000001",
                        "TESIS_GOREVLISI",
                        "GES",
                        "İç Anadolu",
                        "GES Konya 1",
                        true
                ));

                userRepository.save(new User(
                        "Ayşe",
                        "Demir",
                        "manager1",
                        "1234",
                        "ayse.demir@example.com",
                        "05550000002",
                        "TESIS_YONETICISI",
                        "GES",
                        "İç Anadolu",
                        "GES Konya 1",
                        true
                ));

                userRepository.save(new User(
                        "Mehmet",
                        "Kaya",
                        "region1",
                        "1234",
                        "mehmet.kaya@example.com",
                        "05550000003",
                        "BOLGE_YONETICISI",
                        "GES",
                        "İç Anadolu",
                        null,
                        true
                ));

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
                        true
                ));
            }
        };
    }
}