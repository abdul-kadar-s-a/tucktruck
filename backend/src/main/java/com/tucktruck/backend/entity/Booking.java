package com.tucktruck.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer who booked
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Driver assigned (nullable until assigned)
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    // Pickup location
    @Column(nullable = false)
    private String pickupLocation;

    private Double pickupLatitude;
    private Double pickupLongitude;

    // Drop location
    @Column(nullable = false)
    private String dropLocation;

    private Double dropLatitude;
    private Double dropLongitude;

    // Vehicle details
    @Column(nullable = false)
    private String vehicleType; // mini truck, pickup, tempo

    // Pricing
    private Double estimatedPrice;
    private Double finalPrice;
    private Double distance; // in km

    // Booking lifecycle
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CREATED;

    // Timestamps
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime driverAssignedAt;
    private LocalDateTime tripStartedAt;
    private LocalDateTime completedAt;

    // Additional info
    private String customerNotes;
    private String driverNotes;

    // Payment
    private Boolean isPaid = false;
    private String paymentMethod;

    // Contact
    private String customerPhone;
}
