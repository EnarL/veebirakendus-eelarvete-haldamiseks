package com.example.backend.auth;

import com.example.backend.jwt.RefreshToken;
import com.example.backend.jwt.RefreshTokenRepository;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class TokenService {
    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public TokenService(JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public void generateAndSetTokens(Users user, HttpServletResponse response) {
        String accessToken = jwtUtil.generateToken(user.getKasutajanimi());
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(user.getId());

        if (refreshToken == null || refreshToken.getKehtivus().isBefore(LocalDateTime.now())) {
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getKasutajanimi());
            refreshToken = new RefreshToken();
            refreshToken.setUserId(user.getId());
            refreshToken.setToken(newRefreshToken);
            refreshToken.setKehtivus(LocalDateTime.now().plusWeeks(1));
            refreshTokenRepository.save(refreshToken);
        }

        addHttpOnlyCookie(response, "accessToken", accessToken, 600);
    }

    @Transactional
    public void clearTokens(HttpServletResponse response) {
        try {
            Long userId = SecurityUtils.getAuthenticatedUserId();
            if (userId != null) {
                refreshTokenRepository.deleteByUserId(userId);
            }
        } catch (Exception e) {
            // Log the error but continue with cookie removal
            System.err.println("Error during token cleanup: " + e.getMessage());
        } finally {
            // Always clear cookies regardless of token deletion success
            addHttpOnlyCookie(response, "accessToken", "", 0);
        }
    }

    public void refreshToken(HttpServletResponse response) {
        Long userId = SecurityUtils.getAuthenticatedUserId();
        Users user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));
        RefreshToken storedToken = refreshTokenRepository.findByUserId(userId);
        if (storedToken == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No refresh token found for user");
        }
        if (!jwtUtil.validateToken(storedToken.getToken())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }

        String newAccessToken = jwtUtil.generateToken(user.getKasutajanimi());
        addHttpOnlyCookie(response, "accessToken", newAccessToken, 600);
    }

    public void addHttpOnlyCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "None");
        response.addCookie(cookie);
    }
}