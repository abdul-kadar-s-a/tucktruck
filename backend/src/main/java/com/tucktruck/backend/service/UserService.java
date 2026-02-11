package com.tucktruck.backend.service;

import com.tucktruck.backend.dto.AuthResponse;
import com.tucktruck.backend.dto.LoginRequest;
import com.tucktruck.backend.dto.SignupRequest;
import com.tucktruck.backend.entity.Role;
import com.tucktruck.backend.entity.User;
import com.tucktruck.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(SignupRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());

        // Driver specific
        if (request.getRole() == Role.DRIVER) {
            user.setVehicleType(request.getVehicleType());
            user.setVehicleNumber(request.getVehicleNumber());
            user.setLicenseNumber(request.getLicenseNumber());
            user.setIsOnline(false); // Default offline
        }

        userRepository.save(user);

        return new AuthResponse("dummy-token", user.getEmail(), user.getRole(), user.getId(),
                "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new AuthResponse("dummy-token", user.getEmail(), user.getRole(), user.getId(),
                        "Login successful");
            } else {
                throw new RuntimeException("Invalid password");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
