package com.tucktruck.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tucktruck.backend.entity.Location;
import com.tucktruck.backend.entity.Booking;
import com.tucktruck.backend.entity.User;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    // Get all locations for a booking (trip path)
    List<Location> findByBookingOrderByTimestampAsc(Booking booking);

    // Get latest location for a driver
    Location findFirstByDriverOrderByTimestampDesc(User driver);

    // Get locations for a booking within time range
    List<Location> findByBookingAndTimestampBetween(Booking booking, java.time.LocalDateTime start,
            java.time.LocalDateTime end);
}
