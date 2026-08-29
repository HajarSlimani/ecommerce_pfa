import { Link } from 'react-router-dom'
import PriceTag from '../common/PriceTag'

export default function ChatMessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser ? 'bg-ink text-white' : message.error ? 'bg-deal-up/10 text-deal-up' : 'bg-surface-muted text-ink'
        }`}
      >
        {message.content}
      </div>

      {/* Produits retrouvés par la recherche sémantique — indépendants du
          texte généré par le LLM, voir rag_pipeline.py côté service. */}
      {message.products?.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {message.products.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex items-center gap-3 rounded-xl border border-line px-3 py-2 transition hover:border-brand-300"
            >
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-surface-muted">
                {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink">{p.name}</p>
                {p.min_price != null && <PriceTag price={p.min_price} size="sm" />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
