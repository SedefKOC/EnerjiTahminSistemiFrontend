package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.entity.Alarm;
import com.enerjitahmin.backend.repository.AlarmRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class AlarmController {

    private final AlarmRepository alarmRepository;

    public AlarmController(AlarmRepository alarmRepository) {
        this.alarmRepository = alarmRepository;
    }

    @GetMapping("/api/alarms")
    public List<Alarm> getAllAlarms() {
        return alarmRepository.findAll();
    }
}