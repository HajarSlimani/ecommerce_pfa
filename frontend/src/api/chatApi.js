import axios from 'axios'

// Le chatbot est un microservice indépendant (chatbot-service/, FastAPI sur
// le port 8001) — appelé directement depuis le frontend, pas via le backend
// Spring. Pas besoin du token JWT ni de l'en-tête panier invité utilisés par
// axiosInstance : ce service n'a pas de notion de session utilisateur.
const chatAxios = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_BASE_URL || 'http://localhost:8001',
  timeout: 20000, // Groq + recherche vectorielle peuvent prendre quelques secondes
})

export const chatApi = {
  send: (message, history = []) => chatAxios.post('/chat', { message, history }).then((r) => r.data),
}
