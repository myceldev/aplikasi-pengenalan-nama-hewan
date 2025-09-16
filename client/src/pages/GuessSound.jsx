import { useEffect, useMemo, useRef, useState } from 'react'
import { animals } from '../data/animals.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i=a.length-1;i>0;i--) {
    const j = Math.floor(Math.random() * (i+1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GuessSound() {
  const rounds = 5
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [choices, setChoices] = useState([])
  const [answer, setAnswer] = useState(null)
  const [status, setStatus] = useState('idle') // idle | playing | correct | wrong | done
  const audioRef = useRef(null)

  const pool = useMemo(() => animals.filter(a => a.sound), [])

  const setupRound = () => {
    const opts = shuffle(pool).slice(0, 4)
    const ans = opts[Math.floor(Math.random() * opts.length)]
    setChoices(opts)
    setAnswer(ans)
    setStatus('idle')
    if (audioRef.current) {
      audioRef.current.src = ans.sound
      audioRef.current.load()
    }
  }

  useEffect(() => {
    setupRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playSound = async () => {
    if (!audioRef.current) return
    try {
      setStatus('playing')
      await audioRef.current.play()
    } catch {
      setStatus('idle')
    }
  }

  const pick = (a) => {
    if (status === 'done') return
    if (!answer) return
    if (a.id === answer.id) {
      setScore(s => s + 1)
      setStatus('correct')
    } else {
      setStatus('wrong')
    }
  }

  const next = () => {
    if (round >= rounds) {
      setStatus('done')
      return
    }
    setRound(r => r + 1)
    setupRound()
  }

  const saveStars = () => {
    try {
      const key = 'stars_total'
      const prev = parseInt(localStorage.getItem(key) || '0', 10) || 0
      localStorage.setItem(key, String(prev + score))
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card">
        <h1 className="text-2xl font-extrabold mb-2">Tebak Suara Hewan</h1>
        <p className="text-sm mb-3">Dengarkan suaranya, lalu pilih hewan yang tepat!</p>

        <div className="rounded-2xl bg-[color:var(--color-secondary)]/50 p-4 border border-black/5">
          <div className="flex items-center gap-3">
            <button onClick={playSound} className="btn-primary rounded-xl">Putar Suara</button>
            <span className="text-sm">Round {round}/{rounds}</span>
            <span className="text-sm">Skor: {score}</span>
          </div>
          <audio ref={audioRef} preload="auto" />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 mt-4">
          {choices.map((c) => (
            <button key={c.id} onClick={()=>pick(c)} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/5 hover:brightness-105 transition-all duration-150 motion-safe:active:scale-95 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <img src={c.image} alt={c.name} className="w-12 h-12 object-contain" />
              <div>
                <div className="font-semibold text-left">{c.name}</div>
                <div className="text-xs opacity-70 text-left">{c.status}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          {status === 'correct' && <div className="px-3 py-2 rounded-xl bg-emerald-100 text-emerald-700 inline-block">Benar! 🎉</div>}
          {status === 'wrong' && <div className="px-3 py-2 rounded-xl bg-red-100 text-red-700 inline-block">Kurang tepat 😅</div>}
        </div>

        <div className="mt-4 flex gap-2">
          {status !== 'done' ? (
            <button onClick={next} className="btn-accent rounded-xl">Lanjut</button>
          ) : (
            <>
              <button onClick={saveStars} className="btn-primary rounded-xl">Simpan Bintang (+{score})</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
