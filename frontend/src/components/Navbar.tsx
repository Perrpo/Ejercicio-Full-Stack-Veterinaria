import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header style={{background:'#ffffff',borderBottom:'1px solid #f1ebe4'}}> 
      <div className="container-app" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <img src="/images/logo-mark.svg" alt="Logo VetCare" style={{width:24,height:24}} />
          <strong style={{fontSize:18}}>VetCare</strong>
        </div>
        <nav>
          {!user && (
            <Link to="/login" style={{textDecoration:'none'}}>
              <button className="btn-primary" aria-label="Iniciar Sesión" style={{display:'inline-flex',alignItems:'center',gap:8}}>
                <img src="/images/icon-login.svg" alt="" style={{width:16,height:16}} />
                Iniciar Sesión
              </button>
            </Link>
          )}
          {user && (
            <div style={{display:'inline-flex', gap:8}}>
              {user.rol === 'admin' && (
                <Link to="/admin" style={{textDecoration:'none'}}>
                  <button className="btn-ghost">Panel</button>
                </Link>
              )}
              <button className="btn-primary" onClick={()=>{ logout(); window.location.href='/' }}>Salir</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}


