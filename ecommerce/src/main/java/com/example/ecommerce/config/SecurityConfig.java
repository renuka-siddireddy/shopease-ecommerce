package com.example.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/products.html",
                                "/cart.html",
                                "/order.html",
                                "/profile.html",

                                "/css/**",
                                "/js/**",
                                "/images/**",

                                "/**/*.jpg",
                                "/**/*.jpeg",
                                "/**/*.png",
                                "/**/*.webp",
                                "/**/*.gif",
                                "/**/*.css",
                                "/**/*.js",

                                "/favicon.ico"
                        ).permitAll()

                        .requestMatchers(
                                "/auth/**",
                                "/products/**",
                                "/cart/**",
                                "/orders/**",
                                "/users/**"
                        ).permitAll()

                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        .anyRequest().permitAll()
                )

                .formLogin(login -> login.disable());

        return http.build();
    }
}
