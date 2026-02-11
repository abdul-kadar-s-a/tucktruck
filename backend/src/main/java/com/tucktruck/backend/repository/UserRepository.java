package com.tucktruck.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tucktruck.backend.entity.User;
import com.tucktruck.backend.entity.Role;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    List<User> findByRole(Role role);
}
