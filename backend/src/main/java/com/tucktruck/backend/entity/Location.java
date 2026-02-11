package com.tucktruck.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    private Double latitude;
    private Double longitude;

    private LocalDateTime timestamp = LocalDateTime.now();

    // For tracking driver movement during trip
    private String address; // Optional reverse geocoded address
}
