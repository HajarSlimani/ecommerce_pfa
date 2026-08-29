import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { chatApi } from '../api/chatApi'

// Nombre de tours gardés dans l'historique envoyé au backend : assez pour
// garder un fil de conversation cohérent, sans faire grossir indéfiniment
// le prompt (donc la latence et le coût de chaque appel Groq).
const MAX_HISTORY_TURNS = 6

/**
 * Pas de persistance ni de cache React Query pour les messages eux-mêmes :
 * une conversation de chat est un état local éphémère (elle vit et meurt
 * avec le composant), contrairement aux données serveur habituelles gérées
 * ailleurs dans l'app. useMutation sert uniquement à gérer l'appel réseau
 * (isPending, erreurs), pas le stockage de la conversation.
 */
export function useChat() {
  const [messages, setMessages] = useState([])

  const mutation = useMutation({ mutationFn: ({ message, history }) => chatApi.send(message, history) })

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (!trimmed || mutation.isPending) return

      const history = messages.slice(-MAX_HISTORY_TURNS * 2).map(({ role, content }) => ({ role, content }))
      setMessages((prev) => [...prev, { role: 'user', content: trimmed }])

      mutation.mutate(
        { message: trimmed, history },
        {
          onSuccess: (data) => {
            setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, products: data.products }])
          },
          onError: () => {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: "Désolé, je n'arrive pas à répondre pour le moment. Réessayez dans un instant.",
                error: true,
              },
            ])
          },
        }
      )
    },
    [messages, mutation]
  )

  return { messages, sendMessage, isPending: mutation.isPending }
}
