import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import ProductRail from '../components/home/ProductRail'
import { CATEGORIES, GRADES } from '../constants/catalogue'

export default function HomePage() {
  return (
    <div>
      <Hero />

      <ProductRail
        eyebrow="Sélection"
        title="Nos meilleures ventes"
        // NB : pas de compteur de ventes en base pour l'instant → tri de repli.
        // À remplacer par un vrai tri "salesCount" côté backend si vous
        // ajoutez ce champ avant la soutenance.
        sort="id,asc"
      />

      <ProductRail
        eyebrow="Fraîchement arrivé"
        title="Nouveaux produits"
        sort="createdAt,desc"
      />

      {/* Category showcase */}
      <section id="categories" className="scroll-mt-20 border-t border-line bg-surface-muted">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow mb-3">Catégories</p>
          <h2 className="font-display text-3xl font-medium text-ink">Achetez par catégorie</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/boutique?category=${cat.id}`}
                className="group flex aspect-[4/3] flex-col justify-end border border-line bg-surface p-5 text-left transition hover:border-ink"
              >
                <span className="font-display text-lg font-medium text-ink">{cat.label}</span>
                <span className="mt-1 text-xs text-ink-soft transition group-hover:text-brand-600">
                  Voir les produits →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grade explainer */}
      <section id="grades" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="eyebrow mb-3">Nos grades</p>
          <h2 className="max-w-xl font-display text-3xl font-medium text-ink">
            Un état, un prix. Jamais de surprise.
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {GRADES.map((g) => (
              <div key={g.code} className="border-t border-line pt-4">
                <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
                  {g.code}
                </span>
                <p className="mt-2 font-display text-lg font-medium text-ink">{g.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
