package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.entity.Facility;
import com.enerjitahmin.backend.repository.FacilityRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class FacilityController {

    private final FacilityRepository facilityRepository;

    public FacilityController(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @GetMapping("/api/facilities")
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }
}