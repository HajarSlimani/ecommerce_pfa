package com.ecommerce.auth;

import com.ecommerce.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // hashé (BCrypt)

    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.CLIENT;

    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * "columnDefinition" (pas juste @Builder.Default) : on veut que la
     * colonne ait un DEFAULT false au niveau base, pas seulement en Java —
     * sinon les lignes existantes (créées avant l'ajout de ce champ)
     * récupèrent NULL lors de l'ALTER TABLE, ce qui casserait la logique
     * "email non vérifié" pour tous les comptes déjà en base.
     */
    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private boolean emailVerified = false;
}
