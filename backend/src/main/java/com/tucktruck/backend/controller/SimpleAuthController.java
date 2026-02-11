package com.tucktruck.backend.controller;

import com.tucktruck.backend.entity.User;
import com.tucktruck.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class SimpleAuthController {

    @Autowired
    private UserRepository userRepository;

    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists";
        }

        userRepository.save(user);
        return "User Registered Successfully";
    }

    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {

        User user = userRepository.findByEmail(loginUser.getEmail()).orElse(null);

        if (user == null) {
            return "User not found";
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return "Invalid password";
        }

        return "Login Success";
    }
}
