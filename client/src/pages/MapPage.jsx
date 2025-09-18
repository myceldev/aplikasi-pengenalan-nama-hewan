import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animals } from '../data/animals.js'

// Simple loader for Leaflet CSS/JS via CDN
function useLeafletCdn() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // if already present
    if (window.L) { setReady(true); return }
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    css.crossOrigin = ''
    document.head.appendChild(css)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => setReady(true)
    document.body.appendChild(script)

    return () => {
      // do not remove globally; leave CSS/JS cached
    }
  }, [])
  return ready
}

function statusColor(status) {
  const code = (/(\(([^)]+)\))/.exec(status || '')?.[2] || '').toUpperCase()
  switch (code) {
    case 'CR': return '#dc2626' // red-600
    case 'EN': return '#f97316' // orange-500
    case 'VU': return '#f59e0b' // amber-500
    case 'LC': return '#059669' // emerald-600
    default: return '#334155' // slate-700
  }
}

export default function MapPage() {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const ready = useLeafletCdn()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready || !containerRef.current) return
    const L = window.L
    if (!L) return
    if (mapRef.current) return

    const map = L.map(containerRef.current).setView([-2.2, 117.0], 4.6)
    mapRef.current = map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    animals.forEach(a => {
      if (!a.location) return
      const color = statusColor(a.status)
      const marker = L.circleMarker([a.location.lat, a.location.lng], {
        radius: 8,
        color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map)
      const html = `
        <div style="display:flex;gap:10px;align-items:center; padding:2px 0;">
          <img src="${a.image}" alt="${a.name}" style="width:56px;height:56px;object-fit:contain;border-radius:10px;"/>
          <div>
            <div style="font-weight:800;margin-bottom:2px;">${a.name}</div>
            <div style="font-size:12px;opacity:.8;">${a.status}</div>
            <a data-route="/animal/${a.id}" href="/animal/${a.id}" style="display:inline-block;margin-top:6px;padding:6px 10px;background:#eef2ff;border-radius:999px;color:#2563eb;text-decoration:none">Lihat detail</a>
          </div>
        </div>
      `
      marker.bindPopup(html)
      marker.on('popupopen', (e) => {
        const node = e.popup.getElement()
        if (!node) return
        const link = node.querySelector('a[data-route]')
        if (link) {
          link.addEventListener('click', (ev) => {
            ev.preventDefault()
            const to = link.getAttribute('data-route')
            navigate(to)
          }, { once: true })
        }
      })
    })

    return () => {
      try { map.remove() } catch { /* ignore cleanup errors */ }
      mapRef.current = null
    }
  }, [ready, navigate])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold mb-2">Peta Persebaran</h1>
        <p className="text-sm mb-4">Lihat persebaran mamalia Indonesia. Ketuk marker untuk info singkat dan menuju halaman detail.</p>
        <div ref={containerRef} className="w-full rounded-xl overflow-hidden h-[55vh] sm:h-[60vh] md:h-[70vh]" style={{ background:'var(--color-secondary)'}} />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="opacity-70 mr-1">Legenda:</span>
          <span className="px-2 py-1 rounded-full text-white bg-red-600">CR</span>
          <span className="px-2 py-1 rounded-full text-white bg-orange-500">EN</span>
          <span className="px-2 py-1 rounded-full text-black bg-amber-400">VU</span>
          <span className="px-2 py-1 rounded-full text-white bg-emerald-600">LC</span>
        </div>
      </div>
    </div>
  )
}
