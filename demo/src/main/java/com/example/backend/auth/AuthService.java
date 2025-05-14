package com.example.backend.auth;

import com.example.backend.users.UserLoginRequest;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final JWTUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, TokenService tokenService, JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.jwtUtil = jwtUtil;
    }
    public void login(UserLoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Users user = userRepository.findByKasutajanimi(userDetails.getUsername());
        tokenService.generateAndSetTokens(user, response);
    }
    public void logout(HttpServletResponse response) {
        tokenService.clearTokens(response);
    }
    public void checkSession(HttpServletRequest request) {
        String accessToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }
        if (accessToken == null || !jwtUtil.validateToken(accessToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or missing access token");
        }
    }
}