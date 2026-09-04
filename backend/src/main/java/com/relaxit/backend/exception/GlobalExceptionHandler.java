package com.relaxit.backend.exception;

import com.relaxit.backend.dto.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
    ErrorResponse errorResponse = new ErrorResponse(
        false,
        ex.getMessage(),
        Collections.emptyMap());
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
  }

  @ExceptionHandler(InvalidPasswordException.class)
  public ResponseEntity<ErrorResponse> handleInvalidPasswordException(InvalidPasswordException ex) {
    ErrorResponse errorResponse = new ErrorResponse(
        false,
        ex.getMessage(),
        Collections.emptyMap());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
  public ResponseEntity<ErrorResponse> handleAuthenticationException(
      org.springframework.security.core.AuthenticationException ex) {
    ErrorResponse errorResponse = new ErrorResponse(
        false,
        "Invalid email or password",
        Collections.emptyMap());
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }

    ErrorResponse errorResponse = new ErrorResponse(
        false,
        "Validation failed",
        errors);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}
