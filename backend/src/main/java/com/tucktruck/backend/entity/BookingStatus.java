package com.tucktruck.backend.entity;

public enum BookingStatus {
    CREATED,
    SEARCHING_DRIVER,
    DRIVER_ASSIGNED,
    DRIVER_REACHED_PICKUP,
    TRIP_STARTED,
    IN_TRANSIT,
    COMPLETED,
    CANCELLED,
    PAID
}
