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
                userRepository.save(new User("operator1", "1234", "Ahmet Yılmaz", "TESIS_GOREVLISI"));
                userRepository.save(new User("manager1", "1234", "Ayşe Demir", "TESIS_YONETICISI"));
                userRepository.save(new User("executive1", "1234", "Mehmet Kaya", "UST_YONETICI"));
            }
        };
    }
}