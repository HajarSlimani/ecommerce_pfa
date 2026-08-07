import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../constants/catalogue'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-lg font-medium text-ink">
            NewDev <span className="italic text-brand-500">Shop</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Électronique reconditionnée, contrôlée et garantie. Les prix s’ajustent
            en continu grâce à un moteur de pricing piloté par IA.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Boutique</p>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to="/" className="transition hover:text-ink">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Compte</p>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li><Link to="/cart" className="transition hover:text-ink">Panier</Link></li>
            <li><Link to="/orders" className="transition hover:text-ink">Mes commandes</Link></li>
            <li><Link to="/login" className="transition hover:text-ink">Connexion</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">À propos</p>
          <p className="text-sm leading-relaxed text-ink-soft">
            Projet de fin d’année — plateforme e-commerce avec pricing dynamique
            piloté par IA.
          </p>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5">
        <p className="mx-auto max-w-6xl text-xs text-ink-soft">
          © {new Date().getFullYear()} NewDev Shop.
        </p>
      </div>
    </footer>
  )
}
