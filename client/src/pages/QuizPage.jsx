import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animals } from '../data/animals.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i=a.length-1;i>0;i--) {
    const j = Math.floor(Math.random() * (i+1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions() {
  const optsBase = ['Herbivora','Karnivora','Omnivora']
  const list = animals.map(a => {
    const type = (a.foodType || '').toLowerCase()
    let correct = 'Omnivora'
    if (type.includes('herbivora')) correct = 'Herbivora'
    else if (type.includes('karnivora')) correct = 'Karnivora'
    const options = shuffle([correct, ...optsBase.filter(o=>o!==correct)]).slice(0,3)
    const answer = options.indexOf(correct)
    return {
      q: `${a.name} termasuk...?`,
      options,
      answer,
      ref: a.id,
      img: a.image,
    }
  })
  return list
}

// Audio feedback using Web Audio API (tiny chime)
function playChime(isCorrect) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = isCorrect ? 880 : 220
    g.gain.value = 0.0001
    o.connect(g)
    g.connect(ctx.destination)
    const now = ctx.currentTime
    g.gain.exponentialRampToValueAtTime(0.2, now + 0.02)
    g.gain.exponentialRampToValueAtTime(0.00001, now + 0.25)
    o.start()
    o.stop(now + 0.26)
    o.onended = () => ctx.close()
  } catch {
    /* ignore */
  }
}

export default function QuizPage() {
  const [phase, setPhase] = useState('setup') // setup | playing | result
  const [count, setCount] = useState(8)
  const [mode, setMode] = useState('none') // none | per | total
  const [mute, setMute] = useState(false)

  const pool = useMemo(() => shuffle(buildQuestions()), [])
  const questions = useMemo(() => pool.slice(0, count), [pool, count])

  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [awarded, setAwarded] = useState(false)
  const [selected, setSelected] = useState(null) // index clicked
  const [locked, setLocked] = useState(false)

  // timers
  const [msLeft, setMsLeft] = useState(0)
  const timerRef = useRef(null)
  const deadlineRef = useRef(0) // per or total

  const total = questions.length
  const current = questions[step]
  const totalDurationMs = mode === 'per' ? 15000 : mode === 'total' ? 180000 : 0
  const timerPct = useMemo(() => {
    if (!totalDurationMs) return 0
    return Math.max(0, Math.min(100, (msLeft / totalDurationMs) * 100))
  }, [msLeft, totalDurationMs])
  const progressPct = useMemo(() => {
    if (total === 0) return 0
    return Math.max(0, Math.min(100, (step / total) * 100))
  }, [step, total])

  useEffect(() => {
    if (phase !== 'playing') return
    // init timers
    if (mode === 'per') {
      deadlineRef.current = Date.now() + 15000
    } else if (mode === 'total') {
      deadlineRef.current = Date.now() + 180000
    } else {
      deadlineRef.current = 0
    }
    setMsLeft(deadlineRef.current ? (deadlineRef.current - Date.now()) : 0)
    clearInterval(timerRef.current)
    if (deadlineRef.current) {
      timerRef.current = setInterval(() => {
        const left = deadlineRef.current - Date.now()
        setMsLeft(left)
        if (left <= 0) {
          if (mode === 'per') nextQuestion(false)
          else if (mode === 'total') finish()
        }
      }, 250)
    }
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step, mode])

  const formatTime = (ms) => {
    const s = Math.max(0, Math.ceil(ms/1000))
    const m = Math.floor(s/60)
    const r = s%60
    return m>0 ? `${m}:${String(r).padStart(2,'0')}` : `${r}s`
  }

  const bestKey = useMemo(()=>`best_${count}_${mode}`, [count, mode])
  const bestScore = useMemo(()=>{
    try { return parseInt(localStorage.getItem(bestKey) || '0', 10) || 0 } catch { return 0 }
  }, [bestKey])

  const start = () => {
    setPhase('playing')
    setStep(0)
    setScore(0)
    setAwarded(false)
  }

  const nextQuestion = (correct) => {
    setScore(s => s + (correct ? 1 : 0))
    // reset per-question timer
    if (mode === 'per') deadlineRef.current = Date.now() + 15000
    setStep(s => {
      const n = s + 1
      if (n >= total) {
        finish(correct)
        return s
      }
      return n
    })
    setSelected(null)
    setLocked(false)
  }

  const choose = (idx) => {
    if (phase !== 'playing') return
    if (locked) return
    const correct = idx === current.answer
    setSelected(idx)
    setLocked(true)
    if (!mute) playChime(correct)
    setTimeout(() => nextQuestion(correct), 700)
  }

  const finish = () => {
    setPhase('result')
    // save best
    try {
      const prev = parseInt(localStorage.getItem(bestKey) || '0', 10) || 0
      if (score > prev) localStorage.setItem(bestKey, String(score))
    } catch { /* ignore storage errors */ }
  }

  const addStars = () => {
    if (awarded) return
    try {
      const key = 'stars_total'
      const raw = localStorage.getItem(key)
      const prev = raw ? parseInt(raw, 10) || 0 : 0
      const next = prev + score
      localStorage.setItem(key, String(next))
      const logKey = 'stars_log'
      const logRaw = localStorage.getItem(logKey)
      const log = logRaw ? JSON.parse(logRaw) : []
      log.push({ amount: score, at: Date.now(), source: 'quiz' })
      localStorage.setItem(logKey, JSON.stringify(log.slice(-200)))
      setAwarded(true)
    } catch { /* ignore storage errors */ }
  }

  return (
    <div className="min-h-[70vh]">
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Kuis Mini Hewan</h1>
          <div className="flex items-center gap-2">
            <button onClick={()=>setMute(m=>!m)} className={`px-3 py-1.5 rounded-full ${mute?'bg-orange-400':'bg-orange-500'}`}>{mute?'Unmute':'Mute'}</button>
            <Link to="/" className="px-3 py-1.5 rounded-full bg-white/20 text-white">Beranda</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
          {phase === 'setup' && (
            <div className="grid gap-4">
              <div>
                <p className="text-xl font-bold mb-2 text-emerald-700">Pilih Tingkat Kesulitan</p>
                <div className="flex flex-wrap gap-2">
                  {[5,8,12].map(n => (
                    <button key={n} onClick={()=>setCount(n)} className={`px-4 py-2 rounded-full border ${count===n?'bg-orange-400 text-white border-orange-400':'bg-white border-black/10'}`}>{n} Pertanyaan</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm mb-1">Mode Waktu</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={()=>setMode('none')} className={`px-4 py-2 rounded-full border ${mode==='none'?'bg-orange-500 text-white border-orange-500':'bg-white border-black/10'}`}>Tanpa Timer</button>
                  <button onClick={()=>setMode('per')} className={`px-4 py-2 rounded-full border ${mode==='per'?'bg-orange-500 text-white border-orange-500':'bg-white border-black/10'}`}>15 dtk/soal</button>
                  <button onClick={()=>setMode('total')} className={`px-4 py-2 rounded-full border ${mode==='total'?'bg-orange-500 text-white border-orange-500':'bg-white border-black/10'}`}>3 menit total</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Skor terbaik: <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{bestScore}</span></div>
                <button onClick={start} className="px-4 py-2 rounded-full text-white bg-emerald-600 hover:brightness-110">Mulai</button>
              </div>
            </div>
          )}

          {phase === 'playing' && current && (
            <div>
              <div className="flex items-center justify-between mb-3 text-sm">
                <span>{step+1}/{total}</span>
                {mode!=='none' && (
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{formatTime(msLeft)}</span>
                )}
              </div>
              {/* Progress bars */}
              <div className="h-2 rounded-full bg-black/5 overflow-hidden mb-3">
                <div className="h-full bg-emerald-500" style={{width: `${progressPct}%`}} />
              </div>
              {mode!=='none' && (
                <div className="h-1.5 rounded-full bg-black/10 overflow-hidden mb-3">
                  <div className="h-full bg-orange-400" style={{width: `${timerPct}%`}} />
                </div>
              )}
              <div className="rounded-xl overflow-hidden border border-black/5 mb-3 transition-shadow duration-200 hover:shadow-md">
                <img src={current.img} alt="img" className="w-full h-40 sm:h-48 object-cover" />
              </div>
              <p className="text-lg font-semibold mb-3">{current.q}</p>
              <div className="grid gap-2">
                {current.options.map((opt, i) => {
                  const isCorrect = i === current.answer
                  const isSelected = selected === i
                  const stateClass = locked
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-300'
                      : isSelected
                        ? 'bg-red-100 border-red-300'
                        : 'bg-[color:var(--color-secondary)]'
                    : 'bg-[color:var(--color-secondary)] hover:brightness-110 active:scale-95'
                  return (
                    <button
                      key={i}
                      onClick={()=>choose(i)}
                      disabled={locked}
                      className={`px-4 py-3 rounded-xl text-left border transition-colors duration-150 min-h-[52px] ${stateClass}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {locked && (
                <div className={`fixed left-1/2 -translate-x-1/2 bottom-6 px-4 py-2 rounded-full shadow-md text-white ${selected===current.answer ? 'bg-emerald-600' : 'bg-red-500'}`}>
                  {selected===current.answer ? 'Benar! 🎉' : 'Kurang tepat 😅'}
                </div>
              )}
            </div>
          )}

          {phase === 'result' && (
            <div className="text-center">
              <p className="text-lg font-bold">Skor kamu: {score} / {total}</p>
              <p className="mt-1 text-sm">Bintang didapat: ⭐ {score}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button onClick={addStars} disabled={awarded} className="px-4 py-2 rounded-xl text-white bg-[color:var(--color-primary)] disabled:opacity-50 transition-all duration-150 active:scale-95 hover:brightness-110">Simpan Bintang</button>
                <button onClick={()=>{setPhase('setup')}} className="px-4 py-2 rounded-xl bg-[color:var(--color-secondary)] transition-all duration-150 active:scale-95 hover:brightness-110">Main lagi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
