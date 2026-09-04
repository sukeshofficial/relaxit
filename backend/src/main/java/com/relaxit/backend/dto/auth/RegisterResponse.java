package com.relaxit.backend.dto.auth;

import java.util.UUID;

public class RegisterResponse {
  private UUID id;
  private String firstName;
  private String lastName;
  private String email;

  public RegisterResponse(
      UUID id,
      String firstName,
      String lastName,
      String email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  public UUID getId() {
    return id;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getEmail() {
    return email;
  }
}
