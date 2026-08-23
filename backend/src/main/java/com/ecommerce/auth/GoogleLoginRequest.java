package com.ecommerce.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * "idToken" est le jeton renvoyé par Google Identity Services côté client
 * (bibliothèque JS), PAS un mot de passe Google — le mot de passe Google ne
 * transite jamais par notre backend. On vérifie juste que ce jeton est
 * authentique et qu'il nous est bien destiné (voir AuthService#loginWithGoogle).
 */
@Getter
@Setter
public class GoogleLoginRequest {

    @NotBlank
    private String idToken;
}
