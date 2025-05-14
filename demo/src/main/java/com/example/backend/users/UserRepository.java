package com.example.backend.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByKasutajanimi(String username);
    Users findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByKasutajanimi(String kasutajanimi);


}