package com.example.backend.auth;

import com.example.backend.users.UserPrincipal;
import com.example.backend.users.UserRepository;
import com.example.backend.users.Users;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    private final UserRepository userRepository;

    public JWTAuthenticationFilter(JWTUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
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
        if (accessToken != null && jwtUtil.validateToken(accessToken)) {
            String username = jwtUtil.extractUserName(accessToken);

            Users user = userRepository.findByKasutajanimi(username);
            if (user != null) {
                UserPrincipal userPrincipal = new UserPrincipal(user);
                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities())
                );

            }
        }
        filterChain.doFilter(request, response);
    }
}