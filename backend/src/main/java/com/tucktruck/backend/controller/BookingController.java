package com.tucktruck.backend.controller;

import com.tucktruck.backend.entity.*;
import com.tucktruck.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // CREATE BOOKING (Customer)
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        try {
            Booking created = bookingService.createBooking(booking);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET CUSTOMER BOOKINGS
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable Long customerId) {
        List<Booking> bookings = bookingService.getCustomerBookings(customerId);
        return ResponseEntity.ok(bookings);
    }

    // GET DRIVER BOOKINGS
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Booking>> getDriverBookings(@PathVariable Long driverId) {
        List<Booking> bookings = bookingService.getDriverBookings(driverId);
        return ResponseEntity.ok(bookings);
    }

    // GET DRIVER ACTIVE BOOKING (Current trip)
    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<Booking> getDriverActiveBooking(@PathVariable Long driverId) {
        Booking booking = bookingService.getDriverActiveBooking(driverId);
        if (booking == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(booking);
    }

    // GET PENDING BOOKINGS (Waiting for driver assignment)
    @GetMapping("/pending")
    public ResponseEntity<List<Booking>> getPendingBookings() {
        List<Booking> bookings = bookingService.getPendingBookings();
        return ResponseEntity.ok(bookings);
    }

    // ASSIGN DRIVER (Admin action)
    @PostMapping("/{bookingId}/assign/{driverId}")
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

    // UPDATE BOOKING STATUS (Driver actions)
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            BookingStatus newStatus = BookingStatus.valueOf(statusUpdate.get("status"));
            Booking booking = bookingService.updateBookingStatus(bookingId, newStatus);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE DRIVER LOCATION (Real-time tracking)
    @PostMapping("/{bookingId}/location")
    public ResponseEntity<Location> updateLocation(
            @PathVariable Long bookingId,
            @RequestBody Map<String, Object> locationData) {
        try {
            Long driverId = Long.valueOf(locationData.get("driverId").toString());
            Double latitude = Double.valueOf(locationData.get("latitude").toString());
            Double longitude = Double.valueOf(locationData.get("longitude").toString());

            Location location = bookingService.updateDriverLocation(bookingId, driverId, latitude, longitude);
            return ResponseEntity.ok(location);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET ALL BOOKINGS (Admin dashboard)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // GET BOOKING BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // CANCEL BOOKING
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long bookingId) {
        try {
            Booking booking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
