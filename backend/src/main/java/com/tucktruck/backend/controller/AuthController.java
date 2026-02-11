package com.tucktruck.backend.controller;

import com.tucktruck.backend.dto.AuthResponse;
import com.tucktruck.backend.dto.LoginRequest;
import com.tucktruck.backend.dto.SignupRequest;
import com.tucktruck.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tucktruck.backend.entity.Role;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        // Default role is CUSTOMER if not provided or valid
        if (request.getRole() == null) {
            request.setRole(Role.CUSTOMER);
        }
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // In a better design, return UNAUTHORIZED status
            return ResponseEntity.status(401)
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage()));
        }
    }

    // Driver specific signup endpoint if frontend needs distinct endpoint
    @PostMapping("/signup/driver")
    public ResponseEntity<AuthResponse> signupDriver(@RequestBody SignupRequest request) {
        request.setRole(Role.DRIVER);
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/signup/customer")
    public ResponseEntity<AuthResponse> signupCustomer(@RequestBody SignupRequest request) {
        request.setRole(Role.CUSTOMER);
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, null, null, e.getMessage()));
        }
    }
}
