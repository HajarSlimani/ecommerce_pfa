import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'

const SLIDE_DURATION = 6000

export default function Hero() {
  // Les produits les plus récemment ajoutés font office de mise en avant hero
  // tant qu'il n'existe pas de champ "featured" dédié côté catalogue.
  const { data } = useProducts({ size: 6, sort: 'createdAt,desc' })
  const slides = (data?.content || []).filter((p) => p.imageUrl).slice(0, 5)

  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (slides.length < 2) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timerRef.current)
  }, [slides.length])

  const pause = () => clearInterval(timerRef.current)
  const resume = () => {
    if (slides.length < 2) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_DURATION)
  }

  if (slides.length === 0) {
    return (
      <section className="relative -mt-20 flex min-h-[90vh] items-center justify-center bg-ink px-6 pt-20">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
            Électronique reconditionnée
          </p>
          <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            La seconde vie de la tech, au prix juste.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
            Smartphones, ordinateurs et audio contrôlés, gradés et garantis.
          </p>
          <Link
            to="/boutique"
            className="mt-8 inline-block rounded-full bg-brand-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            Explorer le catalogue
          </Link>
        </div>
      </section>
    )
  }

  const active = slides[index]

  return (
    <section
      onMouseEnter={pause}
      onMouseLeave={resume}
      className="relative -mt-20 h-[90vh] min-h-[560px] overflow-hidden bg-ink"
    >
      {slides.map((product, i) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            key={`${product.id}-${i === index}`}
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-cover ${i === index ? 'animate-kenburns' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 px-6 pb-24 pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-white/70">
            {active.brand || 'Électronique reconditionnée'}
          </p>
          <h1 className="max-w-2xl font-sans text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            {active.name}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Contrôlé, gradé et garanti — au prix ajusté du moment.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={`/products/${active.id}`}
              className="rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              En savoir plus
            </Link>
            <Link
              to={`/products/${active.id}`}
              className="rounded-full bg-brand-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Acheter
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Diapositive ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
