package com.tucktruck.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.tucktruck.backend.entity.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String address;
    private Role role;

    // Optional Driver specific
    private String vehicleType;
    private String vehicleNumber;
    private String licenseNumber;
}
