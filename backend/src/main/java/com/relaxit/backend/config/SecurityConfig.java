package com.relaxit.backend.config;

import com.relaxit.backend.security.DeviceAuthenticationFilter;
import com.relaxit.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final DeviceAuthenticationFilter deviceAuthFilter;

  public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, DeviceAuthenticationFilter deviceAuthFilter) {
    this.jwtAuthFilter = jwtAuthFilter;
    this.deviceAuthFilter = deviceAuthFilter;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  /**
   * Single authoritative CORS configuration.
   * Used by both the outer-servlet CorsFilter and Spring Security's .cors() DSL.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(
        // "https://relaxit.forgegrid.in",
        "http://localhost:5173",
        "http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList(
        "Authorization", "Content-Type", "Accept", "Origin",
        "X-Requested-With", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
    configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers(
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/v1/auth/refresh-token",
                "/api/v1/auth/verify-email",
                "/api/v1/auth/forgot-password",
                "/api/v1/auth/reset-password",
                "/api/v1/auth/logout",
                "/api/v1/health",
                "/api/v1/debug/**",
                "/api/v1/dev/simulation/**")
            .permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(deviceAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
