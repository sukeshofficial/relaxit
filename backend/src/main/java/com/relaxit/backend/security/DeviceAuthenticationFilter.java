package com.relaxit.backend.security;

import com.relaxit.backend.entity.Device;
import com.relaxit.backend.repository.DeviceRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import org.springframework.context.annotation.Lazy;

@Component
public class DeviceAuthenticationFilter extends OncePerRequestFilter {

  public static final String HEADER_DEVICE_IDENTIFIER = "X-Device-Identifier";
  public static final String HEADER_DEVICE_SECRET = "X-Device-Secret";

  private final DeviceRepository deviceRepository;
  private final PasswordEncoder passwordEncoder;

  public DeviceAuthenticationFilter(DeviceRepository deviceRepository, @Lazy PasswordEncoder passwordEncoder) {
    this.deviceRepository = deviceRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
    String path = request.getServletPath();
    return path.startsWith("/api/v1/auth/") || path.startsWith("/api/v1/dev/simulation/");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    String deviceIdentifier = request.getHeader(HEADER_DEVICE_IDENTIFIER);
    String deviceSecret = request.getHeader(HEADER_DEVICE_SECRET);

    if (deviceIdentifier != null && !deviceIdentifier.isBlank() && deviceSecret != null && !deviceSecret.isBlank()) {
      Optional<Device> deviceOpt = deviceRepository.findByDeviceIdentifier(deviceIdentifier);

      if (deviceOpt.isPresent()) {
        Device device = deviceOpt.get();
        if (device.getDeviceSecretHash() != null
            && passwordEncoder.matches(deviceSecret, device.getDeviceSecretHash())) {
          DevicePrincipal principal = new DevicePrincipal(device);
          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
              principal,
              null,
              Collections.singletonList(new SimpleGrantedAuthority("ROLE_DEVICE")));
          SecurityContextHolder.getContext().setAuthentication(authentication);
        }
      }
    }

    filterChain.doFilter(request, response);
  }
}
