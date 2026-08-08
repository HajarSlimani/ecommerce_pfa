package com.ecommerce.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * L'email n'est volontairement pas modifiable ici : c'est l'identifiant de
 * connexion (unique en base, utilisé dans le JWT comme subject), le changer
 * demanderait une revérification (email de confirmation) qu'on n'a pas
 * encore. Seul le nom complet est éditable pour l'instant.
 */
@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank
    private String fullName;
}
