import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import ChatPanel from './ChatPanel'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && <ChatPanel onClose={() => setIsOpen(false)} />}

      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-float transition hover:bg-brand-600"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
