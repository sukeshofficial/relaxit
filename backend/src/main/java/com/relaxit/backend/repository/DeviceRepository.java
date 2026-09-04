package com.relaxit.backend.repository;

import com.relaxit.backend.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {

  List<Device> findAllByUserId(UUID userId);

  Optional<Device> findByIdAndUserId(UUID id, UUID userId);

  Optional<Device> findByDeviceIdentifier(String deviceIdentifier);

  boolean existsByDeviceIdentifier(String deviceIdentifier);
}
