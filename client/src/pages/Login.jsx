import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [email, setEmail] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      if (from) navigate(from, { replace: true })
      else if (user.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    }
  }, [isAuthenticated, from, navigate, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login({ email })
  }

  const loginTeacherDemo = async () => {
    await login({ email: 'teacher@demo.com' })
  }

  const loginStudentDemo = async () => {
    await login({ email: 'student@demo.com' })
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-6">
      <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold mb-2">Masuk</h1>
        <p className="text-sm mb-4">Masukkan email. Gunakan <b>teacher@demo.com</b> untuk masuk sebagai Guru. Lainnya akan masuk sebagai Siswa.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-[color:var(--color-secondary)]/50 outline-none" />
          <button type="submit" className="w-full px-4 py-3 rounded-xl text-white bg-[color:var(--color-primary)] hover:brightness-110 active:scale-95">Masuk</button>
        </form>
        <div className="mt-4 grid sm:grid-cols-2 gap-2">
          <button onClick={loginTeacherDemo} className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10">Masuk Guru (Demo)</button>
          <button onClick={loginStudentDemo} className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10">Masuk Siswa (Demo)</button>
        </div>
      </div>
    </div>
  )
}
