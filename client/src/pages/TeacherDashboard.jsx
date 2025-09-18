import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState([])
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [activities, setActivities] = useState([])
  const [students, setStudents] = useState([]) // demo students store
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editLink, setEditLink] = useState('')
  const [lastDeleted, setLastDeleted] = useState(null)
  const [showUndo, setShowUndo] = useState(false)
  const [lbSortBy, setLbSortBy] = useState(() => localStorage.getItem('lb_sort_by') || 'stars')
  const [lbDir, setLbDir] = useState(() => localStorage.getItem('lb_sort_dir') || 'desc')
  const [actFilter, setActFilter] = useState(() => localStorage.getItem('activities_filter') || 'all')

  useEffect(() => {
    // load materials
    try {
      const raw = localStorage.getItem('materials_list')
      setMaterials(raw ? JSON.parse(raw) : [])
    } catch { /* ignore storage errors */ }
    // load / seed demo students
    try {
      const raw = localStorage.getItem('students_demo')
      let list = raw ? JSON.parse(raw) : null
      if (!list) {
        list = [
          { id: crypto.randomUUID(), name: 'Ayu', stars: 8 },
          { id: crypto.randomUUID(), name: 'Bima', stars: 5 },
          { id: crypto.randomUUID(), name: 'Citra', stars: 12 },
          { id: crypto.randomUUID(), name: 'Dewi', stars: 3 },
        ]
      } else {
        // ensure ids
        list = list.map(s => s.id ? s : { ...s, id: crypto.randomUUID() })
      }
      setStudents(list)
      localStorage.setItem('students_demo', JSON.stringify(list))
    } catch { /* ignore storage errors */ }

    // recent activities (quiz stars + reading)
    try {
      const logRaw = localStorage.getItem('stars_log')
      const logs = logRaw ? JSON.parse(logRaw) : []
      const readRaw = localStorage.getItem('reading_history')
      const reads = readRaw ? JSON.parse(readRaw) : []
      const mapped = [
        ...logs.map(l => ({ type: 'quiz', at: l.at, text: `Quiz selesai • +${l.amount} ⭐` })),
        ...reads.slice(-10).map(r => ({ type: 'read', at: r.at || Date.now(), text: `Membaca: ${r.name}` })),
      ]
      const recent = mapped.sort((a,b)=>b.at-a.at).slice(0,10)
      setActivities(recent)
    } catch { /* ignore storage errors */ }
  }, [])

  // recompute leaderboard when students or stars change
  const getStarsTotal = () => parseInt(localStorage.getItem('stars_total') || '0', 10) || 0
  useEffect(() => {
    try {
      const me = { name: 'Kelas Kamu', stars: getStarsTotal() }
      const merged = [...students, me]
      setLeaderboard(merged)
    } catch { /* ignore */ }
  }, [students])

  // utilities
  const saveMaterials = (next) => {
    try { localStorage.setItem('materials_list', JSON.stringify(next)) } catch { /* ignore storage errors */ }
  }

  const hostFromUrl = (u) => {
    try { return new URL(u).host } catch { return '' }
  }

  const humanize = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    const yesterday = new Date(now); yesterday.setDate(now.getDate()-1)
    const isYesterday = d.toDateString() === yesterday.toDateString()
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    if (isToday) return `Hari ini, ${time}`
    if (isYesterday) return `Kemarin, ${time}`
    return d.toLocaleString('id-ID')
  }

  const addMaterial = (e) => {
    e.preventDefault()
    const item = { id: crypto.randomUUID(), title: title.trim(), link: link.trim() }
    if (!item.title) return
    setMaterials(prev => {
      const next = [item, ...prev].slice(0,50)
      saveMaterials(next)
      return next
    })
    setTitle(''); setLink('')
  }

  const removeMaterial = (id) => {
    setMaterials(prev => {
      const target = prev.find(m=>m.id===id)
      const next = prev.filter(m=>m.id!==id)
      saveMaterials(next)
      if (target) {
        setLastDeleted(target)
        setShowUndo(true)
        setTimeout(()=>setShowUndo(false), 5000)
      }
      return next
    })
  }

  const undoDelete = () => {
    if (!lastDeleted) return
    setMaterials(prev => {
      const next = [lastDeleted, ...prev]
      saveMaterials(next)
      return next
    })
    setLastDeleted(null); setShowUndo(false)
  }

  // inline edit
  const startEdit = (m) => { setEditId(m.id); setEditTitle(m.title); setEditLink(m.link || '') }
  const cancelEdit = () => { setEditId(null); setEditTitle(''); setEditLink('') }
  const saveEdit = () => {
    if (!editId) return
    setMaterials(prev => {
      const next = prev.map(m => m.id===editId ? { ...m, title: editTitle.trim() || m.title, link: editLink.trim() } : m)
      saveMaterials(next)
      return next
    })
    cancelEdit()
  }

  // drag & drop reorder
  const onDragStart = (e, id) => { e.dataTransfer.setData('text/plain', id) }
  const onDragOver = (e) => { e.preventDefault() }
  const onDrop = (e, overId) => {
    e.preventDefault()
    const dragId = e.dataTransfer.getData('text/plain')
    if (!dragId || dragId===overId) return
    setMaterials(prev => {
      const from = prev.findIndex(m=>m.id===dragId)
      const to = prev.findIndex(m=>m.id===overId)
      if (from<0 || to<0) return prev
      const next = [...prev]
      const [m] = next.splice(from,1)
      next.splice(to,0,m)
      saveMaterials(next)
      return next
    })
  }

  const exportJSON = (filename, obj) => {
    try {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch { /* ignore */ }
  }

  const exportMaterials = () => exportJSON('materials.json', materials)

  const onImportMaterials = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (Array.isArray(data)) {
        setMaterials(data)
        localStorage.setItem('materials_list', JSON.stringify(data))
      }
    } catch { /* ignore */ }
    e.target.value = ''
  }

  const exportDemoData = () => {
    try {
      const bundle = {
        stars_total: localStorage.getItem('stars_total') || '0',
        stars_log: JSON.parse(localStorage.getItem('stars_log') || '[]'),
        reading_history: JSON.parse(localStorage.getItem('reading_history') || '[]'),
        materials_list: JSON.parse(localStorage.getItem('materials_list') || '[]'),
        students_demo: JSON.parse(localStorage.getItem('students_demo') || '[]'),
      }
      exportJSON('mammalsid_demo_export.json', bundle)
    } catch { /* ignore */ }
  }

  const resetDemoData = () => {
    try {
      ['stars_total','stars_log','reading_history','materials_list'].forEach(k=>localStorage.removeItem(k))
      // keep students_demo seed
      setMaterials([])
      setStudents([])
      setActivities([])
    } catch { /* ignore */ }
  }

  const exportLeaderboardCSV = () => {
    try {
      const header = 'rank,name,stars\n'
      const sorted = sortLeaderboard(leaderboard)
      const rows = sorted.map((s, idx) => `${idx+1},${s.name},${s.stars}`).join('\n')
      const csv = header + rows
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const stamp = new Date().toISOString().slice(0,10)
      a.download = `leaderboard_${stamp}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch { /* ignore */ }
  }

  const sortLeaderboard = (list) => {
    const arr = [...list]
    arr.sort((a,b)=>{
      let cmp = 0
      if (lbSortBy==='name') cmp = a.name.localeCompare(b.name)
      else cmp = (a.stars||0) - (b.stars||0)
      return lbDir==='asc' ? cmp : -cmp
    })
    return arr
  }

  const maxStars = Math.max(1, ...leaderboard.map(s=>s.stars||0))

  const filteredActivities = activities.filter(a=> actFilter==='all' ? true : a.type===actFilter)

  const clearActivities = () => {
    try { localStorage.removeItem('stars_log'); localStorage.removeItem('reading_history') } catch { /* ignore */ }
    setActivities([])
  }

  useEffect(()=>{ localStorage.setItem('lb_sort_by', lbSortBy); localStorage.setItem('lb_sort_dir', lbDir)}, [lbSortBy, lbDir])
  useEffect(()=>{ localStorage.setItem('activities_filter', actFilter)}, [actFilter])

  // demo students manager helpers
  const saveStudents = (list) => { try { localStorage.setItem('students_demo', JSON.stringify(list)) } catch { /* ignore */ } }
  const addStudent = (name, stars) => {
    const item = { id: crypto.randomUUID(), name: name.trim(), stars: Math.max(0, parseInt(stars || '0', 10) || 0) }
    if (!item.name) return
    setStudents(prev => { const next = [item, ...prev].slice(0,50); saveStudents(next); return next })
  }
  const updateStudent = (id, patch) => {
    setStudents(prev => { const next = prev.map(s=>s.id===id ? { ...s, ...patch } : s); saveStudents(next); return next })
  }
  const removeStudent = (id) => {
    setStudents(prev => { const next = prev.filter(s=>s.id!==id); saveStudents(next); return next })
  }

  // analytics data
  const totalMaterials = materials.length
  const totalStudents = students.length + 1 // include demo "Kelas Kamu"
  const avgStars = (() => {
    if (!leaderboard.length) return 0
    const sum = leaderboard.reduce((acc, s)=> acc + (s.stars||0), 0)
    return Math.round((sum/leaderboard.length) * 10) / 10
  })()
  const starLogs = (() => {
    try { return JSON.parse(localStorage.getItem('stars_log') || '[]') } catch { return [] }
  })()
  const lastPoints = starLogs.slice(-10).map(l=> l.amount || 0)
  const maxPoint = Math.max(1, ...lastPoints)

  const sparkPath = (() => {
    if (lastPoints.length === 0) return ''
    const w = 100, h = 24
    const step = w / Math.max(1, lastPoints.length - 1)
    return lastPoints.map((v, i) => {
      const x = Math.round(i * step)
      const y = Math.round(h - (v / maxPoint) * h)
      return `${i===0 ? 'M' : 'L'}${x},${y}`
    }).join(' ')
  })()
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold mb-2">Dashboard Guru</h1>
        <p className="mb-4 text-sm">Selamat datang, {user?.name || 'Guru'}. Berikut contoh fitur kelas (demo, tersimpan di perangkat ini).</p>
        {/* Analytics */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5">
            <p className="text-xs opacity-70">Total Materi</p>
            <p className="text-2xl font-extrabold">{totalMaterials}</p>
          </div>
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5">
            <p className="text-xs opacity-70">Total Siswa (demo)</p>
            <p className="text-2xl font-extrabold">{totalStudents}</p>
          </div>
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5">
            <p className="text-xs opacity-70">Rata-rata Bintang</p>
            <p className="text-2xl font-extrabold">{avgStars}</p>
          </div>
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5">
            <p className="text-xs opacity-70">Kenaikan Bintang (10 sesi)</p>
            <svg viewBox="0 0 100 24" className="w-full h-6" preserveAspectRatio="none">
              <path d={sparkPath} stroke="#FEA405" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">👥 Siswa Demo</p>
          </div>
          <StudentManager students={students} onAdd={addStudent} onUpdate={updateStudent} onRemove={removeStudent} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">📘 Materi Kelas</p>
            </div>
            <form onSubmit={addMaterial} className="grid sm:grid-cols-3 gap-2 mb-2">
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul" className="sm:col-span-1 w-full px-3 py-2 rounded-lg bg-white" />
              <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link (opsional)" className="sm:col-span-1 w-full px-3 py-2 rounded-lg bg-white" />
              <button className="px-3 py-2 rounded-lg text-white bg-[color:var(--color-primary)]">Tambah</button>
            </form>
            <div className="sticky top-2 z-10 -mx-2 px-2 py-2 rounded-lg bg-[color:var(--color-secondary)]/60 backdrop-blur flex flex-wrap gap-2 mb-2">
              <button onClick={exportMaterials} className="px-3 py-1.5 rounded-lg bg-white border border-black/10">Export</button>
              <label className="px-3 py-1.5 rounded-lg bg-white border border-black/10 cursor-pointer">
                Import
                <input onChange={onImportMaterials} type="file" accept="application/json" className="hidden" />
              </label>
            </div>
            {materials.length === 0 ? (
              <p className="text-xs opacity-70">Belum ada materi. Tambahkan dari form di atas.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {materials.map(m => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between bg-white rounded-lg border border-black/5 p-2 transition-colors duration-150 hover:bg-[color:var(--color-secondary)]/30"
                    draggable
                    onDragStart={(e)=>onDragStart(e, m.id)}
                    onDragOver={onDragOver}
                    onDrop={(e)=>onDrop(e, m.id)}
                  >
                    <div className="min-w-0">
                      {editId===m.id ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') saveEdit(); if(e.key==='Escape') cancelEdit();}} className="px-3 py-2 rounded-lg bg-[color:var(--color-secondary)]/40 w-full" />
                          <input value={editLink} onChange={e=>setEditLink(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') saveEdit(); if(e.key==='Escape') cancelEdit();}} placeholder="Link" className="px-3 py-2 rounded-lg bg-[color:var(--color-secondary)]/40 w-full" />
                        </div>
                      ) : (
                        <div className="truncate">
                          <p className="font-semibold truncate">{m.title}</p>
                          {m.link && (
                            <a className="text-xs underline text-blue-600 inline-flex items-center gap-1" href={m.link} target="_blank" rel="noreferrer">
                              <img alt="fav" className="w-3 h-3" src={`https://www.google.com/s2/favicons?sz=32&domain=${hostFromUrl(m.link)}`} />
                              {hostFromUrl(m.link)}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {editId===m.id ? (
                        <>
                          <button onClick={saveEdit} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700">Simpan</button>
                          <button onClick={cancelEdit} className="px-3 py-1.5 rounded-lg bg-white border">Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(m)} className="px-3 py-1.5 rounded-lg bg-white border">Ubah</button>
                          <button onClick={()=>removeMaterial(m.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Hapus</button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">🏆 Papan Peringkat (Bintang)</p>
              <div className="flex items-center gap-2 text-xs">
                <select value={lbSortBy} onChange={e=>setLbSortBy(e.target.value)} className="px-2 py-1 rounded-md bg-white border">
                  <option value="stars">Urut: Bintang</option>
                  <option value="name">Urut: Nama</option>
                </select>
                <button onClick={()=>setLbDir(d=>d==='asc'?'desc':'asc')} className="px-2 py-1 rounded-md bg-white border">{lbDir==='asc'?'Naik ↑':'Turun ↓'}</button>
              </div>
            </div>
            <ul className="text-sm space-y-1">
              {sortLeaderboard(leaderboard).map((s, idx) => (
                <li key={idx} className="bg-white rounded-lg border border-black/5 px-3 py-2 transition-colors duration-150 hover:bg-[color:var(--color-secondary)]/30">
                  <div className="flex items-center justify-between">
                    <span>{idx+1}. {s.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-300">⭐ {s.stars}</span>
                  </div>
                  <div className="h-1.5 mt-2 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full bg-amber-400" style={{width: `${Math.round((s.stars||0)/maxStars*100)}%`}} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xs opacity-70 mt-2">Data contoh. Integrasi akun siswa bisa dihubungkan ke server nanti.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={exportLeaderboardCSV} className="px-3 py-1.5 rounded-lg bg-white border border-black/10">Export CSV</button>
              <button onClick={exportDemoData} className="px-3 py-1.5 rounded-lg bg-white border border-black/10">Export Data Demo</button>
              <button onClick={resetDemoData} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Reset Data Demo</button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[color:var(--color-secondary)]/40 border border-black/5 sm:col-span-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">🕒 Aktivitas Terbaru</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex rounded-full bg-white border p-0.5">
                  <button onClick={()=>setActFilter('all')} className={`px-2 py-0.5 rounded-full ${actFilter==='all'?'bg-[color:var(--color-secondary)]/60':''}`}>Semua</button>
                  <button onClick={()=>setActFilter('read')} className={`px-2 py-0.5 rounded-full ${actFilter==='read'?'bg-[color:var(--color-secondary)]/60':''}`}>Baca</button>
                  <button onClick={()=>setActFilter('quiz')} className={`px-2 py-0.5 rounded-full ${actFilter==='quiz'?'bg-[color:var(--color-secondary)]/60':''}`}>Kuis</button>
                </div>
                <button onClick={clearActivities} className="px-2 py-1 rounded-md bg-white border">Bersihkan</button>
              </div>
            </div>
            {filteredActivities.length === 0 ? (
              <p className="text-xs opacity-70">Belum ada aktivitas terbaru.</p>
            ) : (
              <ul className="text-sm space-y-1">
                {filteredActivities.map((a, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-white rounded-lg border border-black/5 px-3 py-2 transition-colors duration-150 hover:bg-[color:var(--color-secondary)]/30">
                    <span className="inline-flex items-center gap-2">
                      <span>{a.type==='read'?'📖':'⭐'}</span>
                      <span>{a.text}</span>
                    </span>
                    <span className="text-xs opacity-70" title={new Date(a.at).toLocaleString('id-ID')}>{humanize(a.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {showUndo && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-6 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
          <span>Materi dihapus</span>
          <button onClick={undoDelete} className="px-3 py-1 rounded-full bg-white text-black">Urungkan</button>
        </div>
      )}
    </div>
  )
}

function StudentManager({ students, onAdd, onUpdate, onRemove }) {
  const [name, setName] = useState('')
  const [stars, setStars] = useState('')
  const submit = (e) => { e.preventDefault(); onAdd(name, stars); setName(''); setStars('') }
  return (
    <div>
      <form onSubmit={submit} className="grid grid-cols-3 gap-2 mb-2 text-sm">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama" className="col-span-1 w-full px-3 py-2 rounded-lg bg-white" />
        <input value={stars} onChange={e=>setStars(e.target.value)} placeholder="Bintang" type="number" min="0" className="col-span-1 w-full px-3 py-2 rounded-lg bg-white" />
        <button className="px-3 py-2 rounded-lg text-white bg-[color:var(--color-primary)]">Tambah</button>
      </form>
      {students.length===0 ? (
        <p className="text-xs opacity-70">Belum ada siswa demo.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {students.map(s => (
            <li key={s.id} className="flex items-center justify-between bg-white rounded-lg border border-black/5 p-2">
              <div className="flex items-center gap-2">
                <input value={s.name} onChange={e=>onUpdate(s.id,{name:e.target.value})} className="px-2 py-1 rounded bg-[color:var(--color-secondary)]/40" />
                <input value={s.stars} onChange={e=>onUpdate(s.id,{stars:Math.max(0, parseInt(e.target.value||'0',10)||0)})} type="number" min="0" className="w-20 px-2 py-1 rounded bg-[color:var(--color-secondary)]/40" />
              </div>
              <button onClick={()=>onRemove(s.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600">Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
