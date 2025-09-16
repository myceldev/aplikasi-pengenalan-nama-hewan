import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useState } from 'react'

export default function SiteNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const active = 'text-[color:var(--color-tertiary-orange)] font-semibold'
  const base = 'px-3 py-2 rounded-xl hover:text-[color:var(--color-tertiary-orange)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-secondary)]'

  return (
    <header className="sticky top-0 z-20 bg-[color:var(--color-secondary)]/80 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/logo.svg"
            onError={(e)=>{e.currentTarget.src='/logo.png'}}
            alt="MammalsID"
            className="inline-block w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-md shadow-sm p-0.5 transition-transform duration-150 sm:group-hover:scale-[1.03] active:scale-95"
          />
          <span className="text-lg font-extrabold">MammalsID</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <NavLink to="/" className={({isActive})=> isActive?active:base}>Beranda</NavLink>
          <NavLink to="/map" className={({isActive})=> isActive?active:base}>Peta</NavLink>
          <NavLink to="/quiz" className={({isActive})=> isActive?active:base}>Kuis</NavLink>
          {user?.role === 'student' && (
            <NavLink to="/student" className={({isActive})=> isActive?active:base}>Siswa</NavLink>
          )}
          {user?.role === 'teacher' && (
            <NavLink to="/teacher" className={({isActive})=> isActive?active:base}>Guru</NavLink>
          )}
        </nav>
        <div className="relative flex items-center gap-2">
          {/* Mobile hamburger */}
          <button aria-label="Buka menu" className="sm:hidden btn-ghost w-9 h-9 rounded-xl" onClick={()=>setMobileOpen(m=>!m)}>☰</button>
          {!user ? (
            <Link to="/login" className="btn-primary rounded-full">Masuk</Link>
          ) : (
            <>
              <span className="hidden sm:inline-block px-2 py-1 rounded-full text-xs bg-white/60 border border-black/5">{user.role === 'teacher' ? 'Guru' : 'Siswa'}</span>
              <button aria-label="User menu" onClick={()=>setOpen(o=>!o)} className="w-9 h-9 rounded-full bg-[color:var(--color-primary)] text-white font-bold grid place-items-center transition-transform duration-200 motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-secondary)]">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>
              {open && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-black/5 rounded-xl shadow-md overflow-hidden">
                  {user.role === 'teacher' && (
                    <button onClick={()=>{setOpen(false); navigate('/teacher')}} className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-secondary)]/40 transition-colors duration-150">Dashboard Guru</button>
                  )}
                  {user.role === 'student' && (
                    <button onClick={()=>{setOpen(false); navigate('/student')}} className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-secondary)]/40 transition-colors duration-150">Dashboard Siswa</button>
                  )}
                  <button onClick={()=>{setOpen(false); navigate('/quiz')}} className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-secondary)]/40 transition-colors duration-150">Kuis</button>
                  <button onClick={()=>{setOpen(false); navigate('/guess-sound')}} className="w-full text-left px-4 py-2 hover:bg-[color:var(--color-secondary)]/40 transition-colors duration-150">Tebak Suara</button>
                  <button onClick={()=>{setOpen(false); handleLogout()}} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150">Keluar</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Mobile dropdown sheet */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-black/5 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2 text-sm">
            <NavLink onClick={()=>setMobileOpen(false)} to="/" className={({isActive})=> (isActive?active:base) + ' block'}>Beranda</NavLink>
            <NavLink onClick={()=>setMobileOpen(false)} to="/map" className={({isActive})=> (isActive?active:base) + ' block'}>Peta</NavLink>
            <NavLink onClick={()=>setMobileOpen(false)} to="/quiz" className={({isActive})=> (isActive?active:base) + ' block'}>Kuis</NavLink>
            {user?.role === 'student' && (
              <NavLink onClick={()=>setMobileOpen(false)} to="/student" className={({isActive})=> (isActive?active:base) + ' block'}>Siswa</NavLink>
            )}
            {user?.role === 'teacher' && (
              <NavLink onClick={()=>setMobileOpen(false)} to="/teacher" className={({isActive})=> (isActive?active:base) + ' block'}>Guru</NavLink>
            )}
            {user && (
              <>
                <button onClick={()=>{setMobileOpen(false); navigate('/guess-sound')}} className={base + ' text-left'}>Tebak Suara</button>
                <button onClick={()=>{setMobileOpen(false); handleLogout()}} className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-150 text-left">Keluar</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
