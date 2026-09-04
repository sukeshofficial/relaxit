package com.relaxit.backend.service;

import com.relaxit.backend.dto.auth.AuthUserResponse;
import com.relaxit.backend.dto.user.ChangePasswordRequest;
import com.relaxit.backend.dto.user.UpdateProfileRequest;
import com.relaxit.backend.entity.User;
import com.relaxit.backend.entity.UserStatus;
import com.relaxit.backend.exception.InvalidPasswordException;
import com.relaxit.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public AuthUserResponse getCurrentUser(String email) {
    User user = findEntityByEmail(email);
    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new UsernameNotFoundException("User account is inactive or deleted");
    }
    return new AuthUserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());
  }

  public AuthUserResponse getUserById(UUID id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    if (user.getStatus() != UserStatus.ACTIVE) {
      throw new UsernameNotFoundException("User account is inactive or deleted");
    }
    return new AuthUserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail());
  }

  public User findEntityByEmail(String email) {
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
  }

  @Transactional
  public AuthUserResponse updateProfile(String email, UpdateProfileRequest request) {
    User user = findEntityByEmail(email);

    user.setFirstName(request.getFirstName().trim());
    user.setLastName(request.getLastName().trim());

    User updatedUser = userRepository.save(user);

    return new AuthUserResponse(
        updatedUser.getId(),
        updatedUser.getFirstName(),
        updatedUser.getLastName(),
        updatedUser.getEmail());
  }

  @Transactional
  public void changePassword(String email, ChangePasswordRequest request) {
    User user = findEntityByEmail(email);

    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
      throw new InvalidPasswordException("Current password is incorrect");
    }

    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
      throw new InvalidPasswordException("New password must be different from current password");
    }

    String hashedNewPassword = passwordEncoder.encode(request.getNewPassword());
    user.setPassword(hashedNewPassword);
    userRepository.save(user);
  }

  @Transactional
  public void deactivateAccount(String email) {
    User user = findEntityByEmail(email);
    user.setStatus(UserStatus.DEACTIVATED);
    user.setDeletedAt(LocalDateTime.now());
    userRepository.save(user);
  }

  @Transactional
  public void deleteAccountPermanently(String email) {
    User user = findEntityByEmail(email);
    userRepository.delete(user);
  }
}
