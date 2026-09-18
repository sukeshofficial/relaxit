package com.relaxit.backend.repository;

import com.relaxit.backend.entity.RefreshToken;
import com.relaxit.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

  Optional<RefreshToken> findByTokenHash(String tokenHash);

  List<RefreshToken> findAllByUserAndRevokedAtIsNull(User user);

  void deleteAllByUser(User user);
}
