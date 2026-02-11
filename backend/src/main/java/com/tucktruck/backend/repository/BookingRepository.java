package com.tucktruck.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tucktruck.backend.entity.Booking;
import com.tucktruck.backend.entity.BookingStatus;
import com.tucktruck.backend.entity.User;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by customer
    List<Booking> findByCustomer(User customer);

    // Find bookings by driver
    List<Booking> findByDriver(User driver);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find active booking for driver (not completed/cancelled)
    List<Booking> findByDriverAndStatusIn(User driver, List<BookingStatus> statuses);

    // Find bookings waiting for driver assignment
    List<Booking> findByStatusOrderByCreatedAtAsc(BookingStatus status);

    // Find all bookings for admin dashboard
    List<Booking> findAllByOrderByCreatedAtDesc();
}
