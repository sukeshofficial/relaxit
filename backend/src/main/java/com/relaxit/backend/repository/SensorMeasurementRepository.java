package com.relaxit.backend.repository;

import com.relaxit.backend.entity.SensorMeasurement;
import com.relaxit.backend.entity.SensorType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SensorMeasurementRepository extends JpaRepository<SensorMeasurement, UUID> {

  List<SensorMeasurement> findByDeviceIdAndTimestampBetween(UUID deviceId, LocalDateTime from, LocalDateTime to);

  List<SensorMeasurement> findBySessionId(UUID sessionId);

  Page<SensorMeasurement> findByDeviceIdAndSensorType(UUID deviceId, SensorType sensorType, Pageable pageable);

  Page<SensorMeasurement> findByDeviceId(UUID deviceId, Pageable pageable);
}
