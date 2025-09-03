import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header style={{background:'#ffffff',borderBottom:'1px solid #f1ebe4'}}> 
      <div className="container-app" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <img src="/images/logo-mark.svg" alt="Logo VetCare" style={{width:24,height:24}} />
          <strong style={{fontSize:18}}>VetCare</strong>
        </div>
        <nav>
          <Link to="/login" style={{textDecoration:'none'}}>
            <button className="btn-primary" aria-label="Iniciar Sesión" style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <img src="/images/icon-login.svg" alt="" style={{width:16,height:16}} />
              Iniciar Sesión
            </button>
          </Link>
        </nav>
      </div>
    </header>
  )
}


