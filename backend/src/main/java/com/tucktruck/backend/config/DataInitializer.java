package com.tucktruck.backend.config;

import com.tucktruck.backend.entity.Role;
import com.tucktruck.backend.entity.User;
import com.tucktruck.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.findByEmail("admin@tucktruck.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@tucktruck.com");
                admin.setPassword(passwordEncoder.encode("password123"));
                admin.setName("Super Admin");
                admin.setPhone("1234567890");
                admin.setAddress("Admin HQ");
                admin.setRole(Role.ADMIN);
                admin.setIsOnline(true);
                userRepository.save(admin);
                System.out.println("Admin user created: admin@tucktruck.com / password123");
            }
        };
    }
}
