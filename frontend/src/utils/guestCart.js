const KEY = 'guestCartId'

/**
 * Génère (une seule fois) et persiste un identifiant de panier invité, pour
 * qu'un visiteur non connecté ne perde pas son panier tant qu'il n'a pas créé
 * de compte. Envoyé via le header X-Guest-Cart-Id sur les requêtes panier
 * (et auth, pour permettre la fusion à la connexion).
 */
export function getOrCreateGuestCartId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

/**
 * À appeler après une connexion/inscription réussie : le panier invité vient
 * d'être fusionné côté backend, l'identifiant local n'a plus lieu d'être.
 */
export function clearGuestCartId() {
  localStorage.removeItem(KEY)
}
