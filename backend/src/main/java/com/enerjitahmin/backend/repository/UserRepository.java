package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}