package com.tucktruck.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.tucktruck.backend.entity.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token; // For future JWT usage, currently maybe just userID or dummy
    private String email;
    private Role role;
    private String name;
    private String phone;
    private Long id;
    private String message;
}
