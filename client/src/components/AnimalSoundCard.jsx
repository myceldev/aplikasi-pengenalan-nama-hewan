import { useEffect, useMemo, useRef, useState } from 'react'

export default function AnimalSoundCard({ animal, isFavorite = false, onToggleFavorite }) {
  const audioRef = useRef(null)
  const [status, setStatus] = useState('Ready') // Ready | Playing | Error
  const [isPlaying, setIsPlaying] = useState(false)
  const [wiggle, setWiggle] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => { setStatus('Playing'); setIsPlaying(true) }
    const onPause = () => { setStatus('Ready'); setIsPlaying(false) }
    const onEnded = () => { setStatus('Ready'); setIsPlaying(false) }
    const onError = () => setStatus('Error')
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const tapAnimal = () => {
    if (reducedMotion) return
    setWiggle(true)
    setTimeout(() => setWiggle(false), 600)
  }

  const statusInfo = useMemo(() => {
    // Expect formats like "Kritis (CR)", "Terancam (EN)", "Rentan (VU)", "Tidak Terancam (LC)"
    const match = /\(([^)]+)\)/.exec(animal.status || '')
    const code = (match?.[1] || '').toUpperCase()
    switch (code) {
      case 'CR':
        return { bg: 'bg-red-600', label: 'CR' }
      case 'EN':
        return { bg: 'bg-orange-500', label: 'EN' }
      case 'VU':
        return { bg: 'bg-amber-500', label: 'VU' }
      case 'LC':
        return { bg: 'bg-emerald-600', label: 'LC' }
      default:
        return { bg: 'bg-slate-500', label: '' }
    }
  }, [animal.status])

  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      const update = () => setReducedMotion(!!mq.matches)
      update()
      mq.addEventListener?.('change', update)
      return () => mq.removeEventListener?.('change', update)
    } catch {
      /* ignore */
    }
  }, [])

  const label = useMemo(() => {
    if (status === 'Error') return 'Error'
    return isPlaying ? 'Pause' : 'Play'
  }, [status, isPlaying])

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'Playing': return 'Memutar'
      case 'Error': return 'Gagal memutar suara'
      default: return 'Siap'
    }
  }, [status])

  const dotClass = useMemo(() => {
    if (status === 'Playing') return 'bg-emerald-500'
    if (status === 'Error') return 'bg-red-500'
    return ''
  }, [status])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch {
      setStatus('Error')
    }
  }

  return (
    <div className="rounded-2xl p-3 bg-white shadow-sm border border-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="relative" onClick={tapAnimal}>
        {!imgLoaded && (
          <div className="w-full h-40 rounded-xl bg-[color:var(--color-secondary)]/60 animate-pulse" />
        )}
        <img
          loading="lazy"
          decoding="async"
          onLoad={()=>setImgLoaded(true)}
          onError={()=>{ setImgError(true); setImgLoaded(true) }}
          src={imgError ? undefined : animal.image}
          alt={animal.name}
          className={`w-full h-40 object-contain select-none transition-opacity duration-300 ${wiggle ? 'animate-bounce' : ''} ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{background: imgError ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' : undefined}}
        />

        {/* Status badge */}
        <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs text-white ${statusInfo.bg}`}>
          {animal.status}
        </span>

        {/* Favorite heart */}
        {onToggleFavorite && (
          <button
            aria-label="toggle favorite"
            onClick={(e)=>{e.preventDefault(); e.stopPropagation(); onToggleFavorite(animal.id)}}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full grid place-items-center border border-black/10 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80'}`}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        )}

        {/* Play/Pause button near image */}
        <button aria-label={isPlaying ? 'Pause suara hewan' : 'Putar suara hewan'} onClick={(e)=>{e.preventDefault(); e.stopPropagation(); toggle()}} className="absolute bottom-2 left-2 px-3 py-1.5 rounded-full text-white bg-[color:var(--color-primary)] hover:brightness-110 active:scale-95 transition-all duration-150">
          {label}
        </button>
        {status !== 'Ready' && (
          <span aria-label={statusLabel} title={statusLabel} className={`absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full ${dotClass}`} />
        )}
      </div>
      <div className="mt-2">
        <p className="font-bold text-sm">{animal.name}</p>
      </div>
      {animal.sound && (
        <audio ref={audioRef} src={animal.sound} preload="auto" />
      )}
    </div>
  )
}
