import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAnimalById } from '../data/animals.js'

export default function AnimalDetail() {
  const { id } = useParams()
  const animal = getAnimalById(id)
  const [narrationMode, setNarrationMode] = useState('self') // self | narrate
  const [isNarrating, setIsNarrating] = useState(false)
  const utteranceRef = useRef(null)
  const navigate = useNavigate()

  // Save reading history when viewing an animal
  useEffect(() => {
    if (!animal) return
    try {
      const key = 'reading_history'
      const raw = localStorage.getItem(key)
      const list = raw ? JSON.parse(raw) : []
      const entry = { id: animal.id, name: animal.name, at: Date.now() }
      // avoid duplicates in a row
      if (!list.length || list[list.length - 1]?.id !== animal.id) {
        const next = [...list, entry].slice(-50)
        localStorage.setItem(key, JSON.stringify(next))
      }
    } catch {
      /* ignore storage errors */
    }
  }, [animal])

  const narrationText = useMemo(() => {
    if (!animal) return ''
    return `${animal.name}. Nama latin: ${animal.latin}. Jenis makanan: ${animal.foodType}. Habitat: ${animal.habitat}. Populasi: ${animal.population}. Status konservasi: ${animal.status}. Ciri khas: ${animal.unique}. Fakta menarik: ${animal.funFact}.`
  }, [animal])

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  const startNarration = () => {
    if (!canSpeak) return
    const u = new SpeechSynthesisUtterance(narrationText)
    u.lang = 'id-ID'
    u.rate = 0.95
    u.pitch = 1
    u.onend = () => setIsNarrating(false)
    u.onerror = () => setIsNarrating(false)
    utteranceRef.current = u
    setIsNarrating(true)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  const stopNarration = () => {
    if (!canSpeak) return
    window.speechSynthesis.cancel()
    setIsNarrating(false)
  }

  if (!animal) return <div className="max-w-4xl mx-auto p-4">Hewan tidak ditemukan.</div>

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button onClick={()=>navigate(-1)} className="mb-3 px-3 py-1.5 rounded-full bg-[color:var(--color-secondary)] transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">← Kembali</button>
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-b from-[color:var(--color-primary)] to-emerald-500/70 text-white">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="relative transition-shadow duration-200 hover:shadow-md rounded-xl">
              <img src={animal.image} alt={animal.name} className="w-full h-64 object-contain rounded-xl bg-white/10" />
              <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white bg-black/30">{animal.status}</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">{animal.name}</h1>
              <p className="text-sm italic mb-3">{animal.latin}</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/20">Mode: {narrationMode === 'self' ? 'Baca Mandiri' : 'Dibacakan'}</span>
                {canSpeak && (
                  <>
                    {isNarrating ? (
                      <button onClick={stopNarration} className="px-3 py-1.5 rounded-full text-white bg-red-500 transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95">Hentikan Narasi</button>
                    ) : (
                      <button onClick={startNarration} className="px-3 py-1.5 rounded-full text-white bg-[color:var(--color-tertiary-orange)] transition-all duration-150 hover:brightness-110 motion-safe:active:scale-95">Putar Narasi</button>
                    )}
                    <button onClick={()=>setNarrationMode(narrationMode==='self'?'narrate':'self')} className="px-3 py-1.5 rounded-full bg-white/20 transition-all duration-150 hover:bg-white/30">Ganti Mode</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
            <span className="opacity-70 mr-1">Legenda status:</span>
            <span title="Kritis: risiko kepunahan sangat tinggi" className="px-2 py-1 rounded-full text-white bg-red-600">Kritis (CR)</span>
            <span title="Terancam: berisiko punah jika tidak dilindungi" className="px-2 py-1 rounded-full text-white bg-orange-500">Terancam (EN)</span>
            <span title="Rentan: populasi menurun, perlu perlindungan" className="px-2 py-1 rounded-full text-black bg-amber-400">Rentan (VU)</span>
            <span title="Tidak Terancam: populasi stabil" className="px-2 py-1 rounded-full text-white bg-emerald-600">Tidak Terancam (LC)</span>
          </div>
        </div>

        <div className="px-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/5 bg-[color:var(--color-secondary)]/40 p-4 transition-all duration-200 hover:-translate-y-0.5">
            <p className="font-semibold mb-1">Habitat</p>
            <p className="text-sm">{animal.habitat}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-[color:var(--color-secondary)]/40 p-4 transition-all duration-200 hover:-translate-y-0.5">
            <p className="font-semibold mb-1">Makanan</p>
            <p className="text-sm">{animal.foodType}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-[color:var(--color-secondary)]/40 p-4 transition-all duration-200 hover:-translate-y-0.5">
            <p className="font-semibold mb-1">Populasi</p>
            <p className="text-sm">{animal.population}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-[color:var(--color-tertiary-orange)]/90 text-white p-4 transition-all duration-200 hover:-translate-y-0.5">
            <p className="font-semibold mb-1">Fakta Menarik</p>
            <p className="text-sm">{animal.funFact}</p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="rounded-2xl border border-black/5 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5">
            <p className="font-semibold mb-2">Karakteristik Unik</p>
            <ul className="text-sm list-disc pl-5">
              {String(animal.unique).split(/\. |\n|\./).filter(Boolean).map((line, idx) => (
                <li key={idx}>{line.trim()}</li>
              ))}
            </ul>
          </div>
        </div>

        {animal.video && (
          <div className="p-4">
            <video className="w-full rounded-xl transition-shadow duration-200 hover:shadow-md" src={animal.video} controls />
          </div>
        )}
      </div>
    </div>
  )
}
