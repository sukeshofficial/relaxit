package com.relaxit.backend.dto.auth;

public class LoginResponse {

  private boolean success;
  private String message;
  private LoginData data;

  public LoginResponse() {
  }

  public LoginResponse(boolean success, String message, AuthUserResponse user, String accessToken, String refreshToken,
      Long expiresIn) {
    this.success = success;
    this.message = message;
    this.data = new LoginData(user, accessToken, refreshToken, expiresIn);
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public LoginData getData() {
    return data;
  }

  public void setData(LoginData data) {
    this.data = data;
  }

  public static class LoginData {
    private AuthUserResponse user;
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;

    public LoginData() {
    }

    public LoginData(AuthUserResponse user, String accessToken, String refreshToken, Long expiresIn) {
      this.user = user;
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.expiresIn = expiresIn;
    }

    public AuthUserResponse getUser() {
      return user;
    }

    public void setUser(AuthUserResponse user) {
      this.user = user;
    }

    public String getAccessToken() {
      return accessToken;
    }

    public void setAccessToken(String accessToken) {
      this.accessToken = accessToken;
    }

    public String getRefreshToken() {
      return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
      this.refreshToken = refreshToken;
    }

    public Long getExpiresIn() {
      return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
      this.expiresIn = expiresIn;
    }
  }
}
