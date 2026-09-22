package com.relaxit.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/debug")
public class DebugCorsController {

  @GetMapping("/cors")
  public ResponseEntity<Map<String, Object>> getDebugCors() {
    Map<String, Object> debug = new HashMap<>();
    debug.put("status", "ok");
    debug.put("server", "spring-boot");
    debug.put("path", "/api/v1/debug/cors");
    return ResponseEntity.ok(debug);
  }
}
