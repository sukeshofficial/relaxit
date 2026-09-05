package com.relaxit.backend.repository;

import com.relaxit.backend.entity.DeviceSession;
import com.relaxit.backend.entity.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceSessionRepository extends JpaRepository<DeviceSession, UUID> {

  Optional<DeviceSession> findByDeviceIdAndStatus(UUID deviceId, SessionStatus status);

  List<DeviceSession> findAllByDeviceIdAndStatus(UUID deviceId, SessionStatus status);

  Page<DeviceSession> findByDeviceId(UUID deviceId, Pageable pageable);

  Page<DeviceSession> findByUserId(UUID userId, Pageable pageable);

  List<DeviceSession> findByDeviceIdAndStartedAtBetween(UUID deviceId, LocalDateTime from, LocalDateTime to);
}
