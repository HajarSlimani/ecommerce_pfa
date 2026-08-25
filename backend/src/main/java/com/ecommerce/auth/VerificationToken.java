package com.ecommerce.auth;

import com.ecommerce.common.enums.TokenType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Sert à la fois pour la vérification d'email et le mot de passe oublié
 * (voir TokenType) — même mécanique dans les deux cas (jeton aléatoire à
 * usage unique, expirant), pas de raison de dupliquer deux entités
 * quasi-identiques.
 */
@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    @Column(nullable = false)
    private Instant expiresAt;

    @Builder.Default
    private boolean used = false;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public boolean isValid() {
        return !used && expiresAt.isAfter(Instant.now());
    }
}
