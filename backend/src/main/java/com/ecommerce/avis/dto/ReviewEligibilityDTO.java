package com.ecommerce.avis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Renvoyé à l'utilisateur connecté sur la fiche produit pour savoir s'il
 * peut laisser un avis (a une commande Expédiée+ pour ce produit) et s'il
 * en a déjà un (pour pré-remplir le formulaire en mode édition plutôt que
 * création).
 */
@Getter
@Builder
@AllArgsConstructor
public class ReviewEligibilityDTO {
    private boolean canReview;
    private ReviewDTO existingReview; // null si aucun avis existant
}
