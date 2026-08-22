package com.ecommerce.auth.dto;

import com.ecommerce.common.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Édition admin d'un autre utilisateur — email volontairement absent (comme
 * pour UpdateProfileRequest) : c'est l'identifiant de connexion, le changer
 * demanderait une revérification qu'on n'a pas. Ici en plus le rôle, qui n'a
 * de sens que côté admin (voir UserService#updateUser pour les garde-fous
 * contre l'auto-rétrogradation).
 */
@Getter
@Setter
public class UpdateUserRequest {

    @NotBlank
    private String fullName;

    @NotNull
    private Role role;
}
