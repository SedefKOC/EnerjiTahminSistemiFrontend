package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.entity.Alarm;
import com.enerjitahmin.backend.entity.User;
import com.enerjitahmin.backend.repository.AlarmRepository;
import com.enerjitahmin.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alarms")
@CrossOrigin(origins = "http://localhost:5173")
public class AlarmController {

    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;

    public AlarmController(AlarmRepository alarmRepository, UserRepository userRepository) {
        this.alarmRepository = alarmRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Alarm> getAllAlarms() {
        return alarmRepository.findAll();
    }

    @PostMapping("/{id}/resolve")
    public Alarm resolveAlarm(@PathVariable Long id, @RequestParam Long userId) {
        Alarm alarm = alarmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alarm bulunamadı"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User bulunamadı"));

        alarm.setStatus("COZULDU");
        alarm.setResolvedAt(LocalDateTime.now());
        alarm.setResolvedBy(user);

        return alarmRepository.save(alarm);
    }
}