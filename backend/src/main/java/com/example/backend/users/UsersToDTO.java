package com.example.backend.users;

import org.springframework.stereotype.Component;

@Component
public class UsersToDTO {
    public UsersDTO map(Users users) {
        return new UsersDTO(
                users.getKasutajanimi(),
                users.getEesnimi(),
                users.getPerekonnanimi(),
                users.getEmail()
        );
    }
}
