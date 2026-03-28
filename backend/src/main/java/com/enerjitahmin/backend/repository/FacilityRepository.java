package com.enerjitahmin.backend.repository;

import com.enerjitahmin.backend.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}