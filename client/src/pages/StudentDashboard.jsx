import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [stars, setStars] = useState(0)
  const [history, setHistory] = useState([])
  const [streak, setStreak] = useState(0)
  const [bestTick, setBestTick] = useState(0)

  useEffect(() => {
    try {
      const s = parseInt(localStorage.getItem('stars_total') || '0', 10) || 0
      setStars(s)
    } catch {
      /* ignore storage errors */
    }
    try {
      const raw = localStorage.getItem('reading_history')
      const list = raw ? JSON.parse(raw) : []
      setHistory(list.slice(-5).reverse())
    } catch {
      /* ignore storage errors */
    }

    // simple daily streak
    try {
      const key = 'daily_streak'
      const raw = localStorage.getItem(key)
      const data = raw ? JSON.parse(raw) : { count: 0, last: null }
      const today = new Date(); today.setHours(0,0,0,0)
      const lastDate = data.last ? new Date(data.last) : null
      if (!lastDate) {
        data.count = 1
      } else {
        const diff = (today - new Date(lastDate.setHours(0,0,0,0))) / 86400000
        if (diff === 0) {
          // already counted today
        } else if (diff === 1) {
          data.count += 1
        } else if (diff > 1) {
          data.count = 1
        }
      }
      data.last = today.toISOString()
      localStorage.setItem(key, JSON.stringify(data))
      setStreak(data.count)
    } catch {
      /* ignore */
    }
  }, [])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <h1 className="text-2xl font-extrabold mb-2">Halo, {user?.name || 'Siswa'} 👋</h1>
        <p className="text-sm mb-4">Lanjutkan membaca dan bermain game untuk mengumpulkan bintang!</p>
        <div className="mb-4 flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-yellow-400 text-black font-semibold">⭐ {stars} bintang</span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-200 text-emerald-800 font-semibold">🔥 Streak: {streak} hari</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className="px-4 py-2 rounded-xl bg-[color:var(--color-secondary)] transition-all duration-150 hover:brightness-110 active:scale-95">Lihat Hewan</Link>
          <Link to="/quiz" className="px-4 py-2 rounded-xl bg-[color:var(--color-tertiary-orange)] text-white transition-all duration-150 hover:brightness-110 active:scale-95">Main Kuis</Link>
          <Link to="/guess-sound" className="px-4 py-2 rounded-xl bg-[color:var(--color-secondary)] transition-all duration-150 hover:brightness-110 active:scale-95">Tebak Suara</Link>
          <Link to="/map" className="px-4 py-2 rounded-xl bg-[color:var(--color-secondary)] transition-all duration-150 hover:brightness-110 active:scale-95">Jelajah Peta</Link>
        </div>
      </div>
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mt-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <h2 className="text-lg font-bold mb-2">Skor Terbaik</h2>
        <div key={bestTick} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {['none','per','total'].map(m => (
            [5,8,12].map(c => {
              let v = 0
              try { v = parseInt(localStorage.getItem(`best_${c}_${m}`) || '0', 10) || 0 } catch { /* ignore storage errors */ }
              const label = m==='none' ? 'Tanpa Timer' : (m==='per' ? '15 dtk/soal' : '3 menit total')
              return (
                <div key={`${m}-${c}`} className="rounded-xl border border-black/5 bg-[color:var(--color-secondary)]/40 p-3 transition-all duration-200 hover:-translate-y-0.5">
                  <p className="font-semibold mb-1">{c} soal • {label}</p>
                  <p>Skor: <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{v}</span></p>
                </div>
              )
            })
          ))}
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              try {
                ['none','per','total'].forEach(m => [5,8,12].forEach(c => localStorage.removeItem(`best_${c}_${m}`)))
              } catch { /* ignore storage errors */ }
              setBestTick(t => t + 1)
            }}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 transition-all duration-150 active:scale-95 hover:bg-red-100"
          >
            Reset Skor Terbaik
          </button>
        </div>
      </div>
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm mt-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <h2 className="text-lg font-bold mb-2">Riwayat Bacaan Terakhir</h2>
        {history.length === 0 ? (
          <p className="text-sm opacity-70">Belum ada riwayat. Mulai eksplorasi dari beranda!</p>
        ) : (
          <ul className="text-sm list-disc pl-5 space-y-1">
            {history.map((h, idx) => (
              <li key={idx} className="transition-colors duration-150 hover:text-emerald-700">
                <Link className="underline" to={`/animal/${h.id}`}>{h.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
