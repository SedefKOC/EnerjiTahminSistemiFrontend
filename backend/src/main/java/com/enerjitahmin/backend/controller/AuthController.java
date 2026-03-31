package com.enerjitahmin.backend.controller;

import com.enerjitahmin.backend.entity.User;
import com.enerjitahmin.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        String role = loginData.get("role");
        String plantType = loginData.get("plantType");

        Optional<User> userOptional = userRepository.findByUsernameAndPasswordAndRoleAndPlantType(
                username, password, role, plantType);

        Map<String, Object> response = new HashMap<>();

       if (userOptional.isPresent()) {
    User user = userOptional.get();
    response.put("success", true);
    response.put("message", "Giriş başarılı");
    response.put("userId", user.getId());
    response.put("username", user.getUsername());
    response.put("firstName", user.getFirstName());
    response.put("lastName", user.getLastName());
    response.put("role", user.getRole());
    response.put("plantType", user.getPlantType());
    response.put("region", user.getRegion());
    response.put("facility", user.getFacility());
    response.put("email", user.getEmail());
    response.put("phone", user.getPhone());
} else {
    response.put("success", false);
    response.put("message", "Kullanıcı bilgileri hatalı");
}
        return response;
    }
}