package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPasswordAndRoleAndPlantType(
            String username,
            String password,
            String role,
            String plantType
    );
}