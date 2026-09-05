package com.relaxit.backend.repository;

import com.relaxit.backend.entity.PostureMeasurement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PostureMeasurementRepository extends JpaRepository<PostureMeasurement, UUID> {

  List<PostureMeasurement> findByDeviceIdAndTimestampBetweenOrderByTimestampDesc(UUID deviceId, LocalDateTime from, LocalDateTime to);

  Page<PostureMeasurement> findByDeviceIdAndTimestampBetween(UUID deviceId, LocalDateTime from, LocalDateTime to, Pageable pageable);

  List<PostureMeasurement> findBySessionIdOrderByTimestampAsc(UUID sessionId);
}
