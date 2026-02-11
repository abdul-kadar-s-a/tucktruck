package com.tucktruck.backend.service;

import com.tucktruck.backend.entity.*;
import com.tucktruck.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    // Create new booking (Customer action)
    @Transactional
    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.CREATED);
        booking.setCreatedAt(LocalDateTime.now());

        // Calculate estimated price based on distance
        if (booking.getDistance() != null) {
            booking.setEstimatedPrice(calculatePrice(booking.getDistance(), booking.getVehicleType()));
        }

        Booking savedBooking = bookingRepository.save(booking);

        // Immediately move to searching driver
        savedBooking.setStatus(BookingStatus.SEARCHING_DRIVER);
        return bookingRepository.save(savedBooking);
    }

    // Get customer's bookings
    public List<Booking> getCustomerBookings(Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return bookingRepository.findByCustomer(customer);
    }

    // Get driver's bookings
    public List<Booking> getDriverBookings(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return bookingRepository.findByDriver(driver);
    }

    // Get driver's active booking (only one active trip at a time)
    public Booking getDriverActiveBooking(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<BookingStatus> activeStatuses = Arrays.asList(
                BookingStatus.DRIVER_ASSIGNED,
                BookingStatus.DRIVER_REACHED_PICKUP,
                BookingStatus.TRIP_STARTED,
                BookingStatus.IN_TRANSIT);

        List<Booking> activeBookings = bookingRepository.findByDriverAndStatusIn(driver, activeStatuses);
        return activeBookings.isEmpty() ? null : activeBookings.get(0);
    }

    // Get all bookings waiting for driver (Admin/Auto-assignment)
    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatusOrderByCreatedAtAsc(BookingStatus.SEARCHING_DRIVER);
    }

    // Assign driver to booking (Admin action)
    @Transactional
    public Booking assignDriver(Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (driver.getRole() != Role.DRIVER) {
            throw new RuntimeException("User is not a driver");
        }

        booking.setDriver(driver);
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        booking.setDriverAssignedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Update booking status (Driver actions)
    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(newStatus);

        // Update timestamps based on status
        switch (newStatus) {
            case TRIP_STARTED:
                booking.setTripStartedAt(LocalDateTime.now());
                break;
            case COMPLETED:
                booking.setCompletedAt(LocalDateTime.now());
                break;
        }

        return bookingRepository.save(booking);
    }

    // Update driver location (Real-time tracking)
    @Transactional
    public Location updateDriverLocation(Long bookingId, Long driverId, Double latitude, Double longitude) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        Location location = new Location();
        location.setBooking(booking);
        location.setDriver(driver);
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        location.setTimestamp(LocalDateTime.now());

        return locationRepository.save(location);
    }

    // Get all bookings (Admin dashboard)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get booking by ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Calculate price based on distance and vehicle type
    private Double calculatePrice(Double distance, String vehicleType) {
        double baseRate = switch (vehicleType.toLowerCase()) {
            case "mini truck" -> 15.0;
            case "pickup" -> 12.0;
            case "tempo" -> 20.0;
            default -> 10.0;
        };

        return baseRate * distance + 50.0; // Base fare + per km rate
    }

    // Cancel booking
    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Can only cancel if not started
        if (booking.getStatus() == BookingStatus.TRIP_STARTED ||
                booking.getStatus() == BookingStatus.IN_TRANSIT) {
            throw new RuntimeException("Cannot cancel trip in progress");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
}
