package com.relaxit.backend.repository;

import com.relaxit.backend.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {

  Page<Alert> findByDeviceIdOrderByCreatedAtDesc(UUID deviceId, Pageable pageable);

  Page<Alert> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
