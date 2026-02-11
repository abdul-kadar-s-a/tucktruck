package com.tucktruck.backend.controller;

import com.tucktruck.backend.entity.*;
import com.tucktruck.backend.repository.*;
import com.tucktruck.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    // GET ALL USERS
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET ALL DRIVERS
    @GetMapping("/drivers")
    public ResponseEntity<List<User>> getAllDrivers() {
        List<User> drivers = userRepository.findByRole(Role.DRIVER);
        return ResponseEntity.ok(drivers);
    }

    // GET AVAILABLE DRIVERS (online drivers)
    @GetMapping("/drivers/available")
    public ResponseEntity<List<User>> getAvailableDrivers() {
        List<User> drivers = userRepository.findByRole(Role.DRIVER);
        // Filter online drivers
        List<User> onlineDrivers = drivers.stream()
                .filter(driver -> driver.getIsOnline() != null && driver.getIsOnline())
                .toList();
        return ResponseEntity.ok(onlineDrivers);
    }

    // GET ALL BOOKINGS
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // GET DASHBOARD STATISTICS
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total users
        long totalUsers = userRepository.count();
        long totalDrivers = userRepository.findByRole(Role.DRIVER).size();
        long totalCustomers = userRepository.findByRole(Role.CUSTOMER).size();

        // Total bookings
        long totalBookings = bookingRepository.count();
        long activeBookings = bookingRepository.findByStatus(BookingStatus.TRIP_STARTED).size() +
                bookingRepository.findByStatus(BookingStatus.IN_TRANSIT).size();
        long completedBookings = bookingRepository.findByStatus(BookingStatus.COMPLETED).size();
        long pendingBookings = bookingRepository.findByStatus(BookingStatus.SEARCHING_DRIVER).size();

        // Online drivers
        long onlineDrivers = userRepository.findByRole(Role.DRIVER).stream()
                .filter(driver -> driver.getIsOnline() != null && driver.getIsOnline())
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalDrivers", totalDrivers);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalBookings", totalBookings);
        stats.put("activeBookings", activeBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("onlineDrivers", onlineDrivers);

        return ResponseEntity.ok(stats);
    }

    // ASSIGN DRIVER TO BOOKING
    @PostMapping("/bookings/{bookingId}/assign/{driverId}")
    public ResponseEntity<Booking> assignDriver(
            @PathVariable Long bookingId,
            @PathVariable Long driverId) {
        try {
            Booking booking = bookingService.assignDriver(bookingId, driverId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE USER
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userRepository.deleteById(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
