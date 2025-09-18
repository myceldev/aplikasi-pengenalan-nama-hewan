import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  const login = async ({ email }) => {
    // TODO: integrate real API. For now, simple role rule by email.
    // teacher@demo.com => teacher, else student
    const role = email?.toLowerCase() === 'teacher@demo.com' ? 'teacher' : 'student'
    const fakeUser = { id: 'local', name: role === 'teacher' ? 'Guru' : 'Siswa', email, role }
    setUser(fakeUser)
    return fakeUser
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout, isAuthenticated: !!user }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
