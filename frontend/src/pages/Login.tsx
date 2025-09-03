import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login: doLogin } = useAuth()
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      alert('Por favor ingresa tu correo y contraseña')
      return
    }
    try {
      const data = await apiFetch('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
      doLogin(data.token, data.user)
      if (data.user.rol === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err:any) {
      alert(err.message || 'Error al iniciar sesión')
    }
  }
  return (
    <div style={{minHeight:'100vh', position:'relative', overflow:'hidden', background:'linear-gradient(135deg, #fff7ec 0%, #fff 40%, #fef3e7 100%)'}}>
      {/* Fondo malla orgánica */}
      <div aria-hidden style={{position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(1200px 500px at 70% 10%, rgba(234,88,12,0.08), transparent 60%), radial-gradient(800px 400px at 20% 90%, rgba(16,185,129,0.05), transparent 60%)'}} />

      {/* Siluetas animales line art */}
      <img aria-hidden src="/images/line-dog.svg" style={{position:'absolute', left:'5%', top:'18%', width:160, opacity:.8, filter:'drop-shadow(0 0 20px rgba(234,88,12,.15))', pointerEvents:'none'}} />
      <img aria-hidden src="/images/line-cat.svg" style={{position:'absolute', right:'8%', bottom:'12%', width:140, opacity:.8, filter:'drop-shadow(0 0 20px rgba(16,185,129,.15))', pointerEvents:'none'}} />

      {/* Partículas diagonales opcionales */}
      <div aria-hidden style={{position:'absolute', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(135deg, rgba(249,115,22,0.05) 0 2px, transparent 2px 20px)'}} />

      <div className="container-app" style={{display:'grid', placeItems:'center', minHeight:'100vh', position:'relative', zIndex:1}}>
        {/* Tarjeta glassmorphism */}
        <div style={{position:'relative', width:'100%', maxWidth:430, padding:28, borderRadius:20, border:'1px solid rgba(255,255,255,0.45)', background:'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))', boxShadow:'0 30px 80px rgba(234,88,12,0.15), 0 6px 18px rgba(0,0,0,0.05)', backdropFilter:'blur(10px)'}}>
          {/* Logo futurista */}
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
            <img src="/images/logo-pawtech.svg" alt="VetCare" style={{width:28, height:28}} />
            <div style={{fontWeight:700, fontSize:20}}>VetCare</div>
          </div>

          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h1 style={{margin:'8px 0 18px', fontSize:22, color:'#7a2e12'}}>Bienvenido</h1>
            <Link to="/" style={{display:'inline-flex', alignItems:'center', gap:6, textDecoration:'none', fontSize:12, color:'#7a2e12'}}>
              <img src="/images/i-back.svg" alt="" style={{width:16}} />
              Volver al inicio
            </Link>
          </div>

          {/* Inputs */}
          <form onSubmit={handleSubmit}>
            <label style={{display:'block', fontSize:12, color:'#7a7a7a', marginBottom:6}}>Correo electrónico</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #f0e7de', borderRadius:12, padding:'12px 14px', background:'#fff', boxShadow:'inset 0 0 0 1px rgba(249,115,22,0.08)'}}>
              <img src="/images/i-mail.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" autoComplete="email" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>

            <label style={{display:'block', fontSize:12, color:'#7a7a7a', margin:'14px 0 6px'}}>Contraseña</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #f0e7de', borderRadius:12, padding:'12px 14px', background:'#fff', boxShadow:'inset 0 0 0 1px rgba(16,185,129,0.06)'}}>
              <img src="/images/i-lock.svg" alt="" style={{width:18, opacity:.9}} />
              <input type={showPwd? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
              <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{background:'transparent', border:'none', cursor:'pointer'}}>
                <img src={showPwd? '/images/i-eye-off.svg' : '/images/i-eye.svg'} alt="mostrar" style={{width:18, opacity:.9}} />
              </button>
            </div>

            {/* Botones */}
            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:18, padding:'12px 18px', background:'linear-gradient(90deg, #f97316, #fb7b3c, #ef6c00)', backgroundSize:'200% 100%', animation:'gradientMove 4s ease infinite'}}>
              Iniciar Sesión
            </button>
          </form>
          <Link to="/register" style={{display:'block', textAlign:'center', marginTop:12, textDecoration:'none'}}>
            <button className="btn-ghost" style={{width:'100%', borderColor:'rgba(249,115,22,0.45)'}}>Registrarse</button>
          </Link>

          <div style={{marginTop:12, fontSize:12, color:'#6b7280', textAlign:'center'}}>
            ¿Olvidaste tu contraseña?
          </div>

          {/* Brillo en borde */}
          <div aria-hidden style={{position:'absolute', inset:0, borderRadius:20, padding:1, pointerEvents:'none', background:'linear-gradient(135deg, rgba(249,115,22,.6), rgba(245,158,11,.4), rgba(16,185,129,.4))', WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite:'xor'}} />
        </div>
      </div>

      <style>
        {`@keyframes gradientMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}
      </style>
    </div>
  )
}


