import React from 'react'
import { Link } from 'react-router-dom'
import AnimalSoundCard from '../components/AnimalSoundCard.jsx'
import { animals } from '../data/animals.js'

const Home = () => {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('Semua')
  const [favorites, setFavorites] = React.useState(()=>{
    try { return JSON.parse(localStorage.getItem('favorites_animals')) || [] } catch { return [] }
  })
  const [favOnly, setFavOnly] = React.useState(false)

  const statuses = React.useMemo(() => {
    const s = Array.from(new Set(animals.map(a => a.status)))
    return ['Semua', ...s]
  }, [])

  const filtered = React.useMemo(() => {
    const base = animals.filter(a => {
      const q = query.trim().toLowerCase()
      const okText = !q || [a.name, a.latin, a.habitat].some(t => t.toLowerCase().includes(q))
      const okStatus = status === 'Semua' || a.status === status
      return okText && okStatus
    })
    return favOnly ? base.filter(a => favorites.includes(a.id)) : base
  }, [query, status, favOnly, favorites])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
      try { localStorage.setItem('favorites_animals', JSON.stringify(next)) } catch { /* ignore storage errors */ }
      return next
    })
  }

  return (
    <>
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--color-primary)] to-emerald-500/70" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Mamalia Indonesia</h1>
          <p className="mt-2 text-sm sm:text-base max-w-2xl">Jelajahi dunia menakjubkan mamalia Indonesia melalui cerita interaktif yang menyenangkan!</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/" className="px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Mode Membaca</Link>
            <Link to="/map" className="px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Jelajah Peta</Link>
            <Link to="/quiz" className="px-4 py-2 rounded-full bg-[color:var(--color-tertiary-orange)] text-black font-semibold transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Mulai Kuis</Link>
            <Link to="/guess-sound" className="px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70">Tebak Suara</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-2">Temui Teman-Teman Hewan Kita</h2>
        <p className="text-sm opacity-80 mb-4">Klik pada setiap hewan untuk mempelajari fakta-fakta menarik tentang mereka!</p>

        <div className="grid sm:grid-cols-3 gap-2 mb-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari hewan (nama lokal, latin, habitat)" className="sm:col-span-2 w-full px-4 py-3 rounded-xl bg-[color:var(--color-secondary)]/50 outline-none" />
          <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[color:var(--color-secondary)]/50 outline-none">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <label className="inline-flex items-center gap-2 text-sm mb-4 select-none">
          <input type="checkbox" checked={favOnly} onChange={e=>setFavOnly(e.target.checked)} />
          Tampilkan favorit saja
        </label>

        {/* Compact conservation status legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
          <span className="opacity-70 mr-1">Legenda status:</span>
          <span title="Kritis: risiko kepunahan sangat tinggi" className="px-2 py-1 rounded-full text-white bg-red-600">Kritis (CR)</span>
          <span title="Terancam: berisiko punah jika tidak dilindungi" className="px-2 py-1 rounded-full text-white bg-orange-500">Terancam (EN)</span>
          <span title="Rentan: populasi menurun, perlu perlindungan" className="px-2 py-1 rounded-full text-black bg-amber-400">Rentan (VU)</span>
          <span title="Tidak Terancam: populasi stabil" className="px-2 py-1 rounded-full text-white bg-emerald-600">Tidak Terancam (LC)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(animal => (
            <Link key={animal.id} to={`/animal/${animal.id}`} className="block active:scale-95 transition-transform">
              <AnimalSoundCard
                animal={animal}
                isFavorite={favorites.includes(animal.id)}
                onToggleFavorite={toggleFavorite}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-tertiary-orange)]/80">
        <div className="max-w-6xl mx-auto px-4 py-10 text-white">
          <h3 className="text-xl font-extrabold mb-4">Fitur Pembelajaran Interaktif</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-black/10 p-4 border border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-2xl">📖</div>
              <p className="font-semibold">Cerita Interaktif</p>
              <p className="text-sm opacity-90">Baca dan dengarkan cerita menarik tentang setiap hewan.</p>
            </div>
            <div className="rounded-2xl bg-black/10 p-4 border border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-2xl">🗺️</div>
              <p className="font-semibold">Peta Interaktif</p>
              <p className="text-sm opacity-90">Jelajahi habitat alami hewan-hewan di seluruh Indonesia.</p>
            </div>
            <div className="rounded-2xl bg-black/10 p-4 border border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-2xl">🎮</div>
              <p className="font-semibold">Mini Games</p>
              <p className="text-sm opacity-90">Mainkan kuis dan permainan seru untuk menguji pengetahuan.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home