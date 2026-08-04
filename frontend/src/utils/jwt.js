/**
 * Décodage minimal d'un JWT côté client (pas de vérification de signature,
 * juste lecture du payload — la validation réelle se fait côté backend).
 */
export function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}
