import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import ChatMessageBubble from './ChatMessageBubble'

const SUGGESTIONS = [
  'Quelle est la garantie sur un produit grade B ?',
  'Quels produits avez-vous en stock ?',
  'Combien de temps pour un retour ?',
]

export default function ChatPanel({ onClose }) {
  const { messages, sendMessage, isPending } = useChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isPending])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-float sm:w-96">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="eyebrow">Assistant Hajar Shop</p>
          <p className="font-display text-sm text-ink">Comment puis-je vous aider ?</p>
        </div>
        <button onClick={onClose} aria-label="Fermer le chat" className="text-ink-soft transition hover:text-ink">
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-soft">
              Posez-moi une question sur nos produits, la garantie, les retours ou le suivi de commande.
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-ink-soft transition hover:border-brand-300 hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <ChatMessageBubble key={i} message={m} />
        ))}

        {isPending && (
          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Sparkles size={12} className="animate-pulse" />
            L'assistant réfléchit…
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message…"
          className="flex-1 rounded-full border border-line bg-surface-muted px-3.5 py-2 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          disabled={isPending || !input.trim()}
          aria-label="Envoyer"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-brand-600 disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
