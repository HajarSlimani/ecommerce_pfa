package com.ecommerce.auth;

import com.ecommerce.common.enums.TokenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByTokenAndType(String token, TokenType type);
}
