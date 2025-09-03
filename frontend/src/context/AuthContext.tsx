import { createContext, useContext, useEffect, useState } from 'react'

type User = { id: number; nombre: string; apellido: string; rol: 'cliente'|'veterinario'|'admin' }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Usar setTimeout para evitar el parpadeo del botón
    const timer = setTimeout(() => {
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user')
      if (t && u) { 
        setToken(t); 
        setUser(JSON.parse(u)) 
      }
      setLoading(false)
    }, 100) // Delay mínimo para evitar parpadeos

    return () => clearTimeout(timer)
  }, [])

  function login(t: string, u: User) {
    setToken(t); setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
  }

  function logout() {
    setToken(null); setUser(null)
    localStorage.removeItem('token'); localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth outside provider')
  return ctx
}


