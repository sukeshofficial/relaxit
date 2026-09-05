package com.relaxit.backend.repository;

import com.relaxit.backend.entity.DeviceEvent;
import com.relaxit.backend.entity.DeviceEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeviceEventRepository extends JpaRepository<DeviceEvent, UUID> {

  Page<DeviceEvent> findByDeviceId(UUID deviceId, Pageable pageable);

  List<DeviceEvent> findByDeviceIdAndEventTypeOrderByTimestampDesc(UUID deviceId, DeviceEventType eventType);
}
