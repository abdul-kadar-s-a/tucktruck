package com.tucktruck.backend.controller;

import com.tucktruck.backend.entity.User;
import com.tucktruck.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DriverController {

    private final UserRepository userRepository;

    // UPDATE DRIVER STATUS (Online/Offline)
    @PatchMapping("/{driverId}/status")
    public ResponseEntity<User> updateDriverStatus(
            @PathVariable Long driverId,
            @RequestBody Map<String, Boolean> statusUpdate) {
        try {
            User driver = userRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));

            Boolean isOnline = statusUpdate.get("isOnline");
            driver.setIsOnline(isOnline);

            User updated = userRepository.save(driver);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET DRIVER PROFILE
    @GetMapping("/{driverId}")
    public ResponseEntity<User> getDriverProfile(@PathVariable Long driverId) {
        try {
            User driver = userRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE DRIVER PROFILE
    @PutMapping("/{driverId}")
    public ResponseEntity<User> updateDriverProfile(
            @PathVariable Long driverId,
            @RequestBody User updatedDriver) {
        try {
            User driver = userRepository.findById(driverId)
                    .orElseThrow(() -> new RuntimeException("Driver not found"));

            // Update fields
            if (updatedDriver.getName() != null)
                driver.setName(updatedDriver.getName());
            if (updatedDriver.getPhone() != null)
                driver.setPhone(updatedDriver.getPhone());
            if (updatedDriver.getVehicleType() != null)
                driver.setVehicleType(updatedDriver.getVehicleType());
            if (updatedDriver.getVehicleNumber() != null)
                driver.setVehicleNumber(updatedDriver.getVehicleNumber());
            if (updatedDriver.getLicenseNumber() != null)
                driver.setLicenseNumber(updatedDriver.getLicenseNumber());

            User saved = userRepository.save(driver);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
