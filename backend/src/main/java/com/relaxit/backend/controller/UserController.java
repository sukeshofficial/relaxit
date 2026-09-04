package com.relaxit.backend.controller;

import com.relaxit.backend.dto.auth.AuthUserResponse;
import com.relaxit.backend.dto.user.ChangePasswordRequest;
import com.relaxit.backend.dto.user.UpdateProfileRequest;
import com.relaxit.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public ResponseEntity<AuthUserResponse> getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    AuthUserResponse userResponse = userService.getCurrentUser(email);

    return ResponseEntity.ok(userResponse);
  }

  @PutMapping("/me")
  public ResponseEntity<AuthUserResponse> updateProfile(
      @Valid @RequestBody UpdateProfileRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    AuthUserResponse userResponse = userService.updateProfile(email, request);

    return ResponseEntity.ok(userResponse);
  }

  @PutMapping("/me/password")
  public ResponseEntity<Map<String, Object>> changePassword(
      @Valid @RequestBody ChangePasswordRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    userService.changePassword(email, request);

    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Password updated successfully");

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/me")
  public ResponseEntity<Map<String, Object>> deleteAccount(
      @RequestParam(defaultValue = "false") boolean permanent) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    Map<String, Object> response = new HashMap<>();

    if (permanent) {
      userService.deleteAccountPermanently(email);
      response.put("success", true);
      response.put("message", "Account permanently deleted");
    } else {
      userService.deactivateAccount(email);
      response.put("success", true);
      response.put("message", "Account deactivated successfully");
    }

    return ResponseEntity.ok(response);
  }
}
