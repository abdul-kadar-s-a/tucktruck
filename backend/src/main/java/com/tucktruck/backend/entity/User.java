package com.tucktruck.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // In a real app, encrypt this!

    private String name;

    private String phone;

    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // For driver specific fields, we can add them here or in a separate table,
    // but user requested "one table: users".
    // We can add fields like vehicleType, vehicleNumber, licenseNumber if needed
    // later.
    private String vehicleType;
    private String vehicleNumber;
    private String licenseNumber;
    private Boolean isOnline; // For drivers
}
