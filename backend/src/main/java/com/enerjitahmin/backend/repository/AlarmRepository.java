package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
}