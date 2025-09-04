import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiFetch } from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !lastName || !email || !phone || !address || !password) {
      alert('Completa todos los campos')
      return
    }
    try {
      await apiFetch('/auth/register', { method:'POST', body: JSON.stringify({ nombre:name, apellido:lastName, email, password, telefono:phone, direccion:address }) })
      alert('Cuenta creada, ahora inicia sesión')
      navigate('/login')
    } catch (err:any) {
      alert(err.message || 'Error al registrarse')
    }
  }
  return (
    <div style={{minHeight:'100vh', position:'relative', overflow:'hidden', background:'linear-gradient(135deg, #f8fafc 0%, #fff 40%, #f1f5f9 100%)'}}>
      <div aria-hidden style={{position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(1200px 500px at 70% 10%, rgba(37,99,235,0.08), transparent 60%), radial-gradient(800px 400px at 20% 90%, rgba(5,150,105,0.05), transparent 60%)'}} />
      <img aria-hidden src="/images/line-dog.svg" style={{position:'absolute', left:'5%', top:'18%', width:160, opacity:.8, filter:'drop-shadow(0 0 20px rgba(37,99,235,.15))'}} />
      <img aria-hidden src="/images/line-cat.svg" style={{position:'absolute', right:'8%', bottom:'12%', width:140, opacity:.8, filter:'drop-shadow(0 0 20px rgba(5,150,105,.15))'}} />
      <div aria-hidden style={{position:'absolute', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(135deg, rgba(37,99,235,0.05) 0 2px, transparent 2px 20px)'}} />

      <div className="container-app" style={{display:'grid', placeItems:'center', minHeight:'100vh', position:'relative', zIndex:1}}>
        <div style={{position:'relative', width:'100%', maxWidth:430, padding:28, borderRadius:20, border:'1px solid rgba(255,255,255,0.45)', background:'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))', boxShadow:'0 30px 80px rgba(37,99,235,0.15), 0 6px 18px rgba(0,0,0,0.05)', backdropFilter:'blur(10px)'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
            <img src="/images/logo-pawtech.svg" alt="VetCare" style={{width:28, height:28}} />
            <div style={{fontWeight:700, fontSize:20}}>VetCare</div>
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h1 style={{margin:'8px 0 18px', fontSize:22, color:'#1f2937'}}>Crear Cuenta</h1>
            <Link to="/" style={{display:'inline-flex', alignItems:'center', gap:6, textDecoration:'none', fontSize:12, color:'#1f2937'}}>
              <img src="/images/i-back.svg" alt="" style={{width:16}} />
              Volver al inicio
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <label style={{display:'block', fontSize:12, color:'#7a7a7a', marginBottom:6}}>Nombre Completo</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff'}}>
              <img src="/images/i-user.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nombre" autoComplete="given-name" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff', marginTop:10}}>
              <img src="/images/i-user.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Apellido" autoComplete="family-name" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>

            <label style={{display:'block', fontSize:12, color:'#7a7a7a', margin:'14px 0 6px'}}>Correo Electrónico</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff'}}>
              <img src="/images/i-mail.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>

            <label style={{display:'block', fontSize:12, color:'#7a7a7a', margin:'14px 0 6px'}}>Teléfono</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff'}}>
              <img src="/images/i-phone.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+57 300 123 4567" autoComplete="tel" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>

            <label style={{display:'block', fontSize:12, color:'#7a7a7a', margin:'14px 0 6px'}}>Dirección</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff'}}>
              <img src="/images/icon-location.svg" alt="" style={{width:18, opacity:.9}} />
              <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Calle 123, Ciudad" autoComplete="street-address" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
            </div>

            <label style={{display:'block', fontSize:12, color:'#7a7a7a', margin:'14px 0 6px'}}>Contraseña</label>
            <div style={{display:'flex', alignItems:'center', gap:8, border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 14px', background:'#fff'}}>
              <img src="/images/i-lock.svg" alt="" style={{width:18, opacity:.9}} />
              <input type={showPwd? 'text' : 'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" style={{border:'none', outline:'none', width:'100%', background:'transparent'}} />
              <button type="button" onClick={()=>setShowPwd(!showPwd)} style={{background:'transparent', border:'none', cursor:'pointer'}}>
                <img src={showPwd? '/images/i-eye-off.svg' : '/images/i-eye.svg'} alt="mostrar" style={{width:18, opacity:.9}} />
              </button>
            </div>

            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:18, padding:'12px 18px', background:'linear-gradient(90deg, #2563eb, #3b82f6, #1d4ed8)', backgroundSize:'200% 100%', animation:'gradientMove 4s ease infinite'}}>Crear Cuenta</button>
          </form>
          <Link to="/login" style={{display:'block', textAlign:'center', marginTop:12, textDecoration:'none'}}>
            <button className="btn-ghost" style={{width:'100%', borderColor:'rgba(37,99,235,0.45)'}}>Ya tengo cuenta</button>
          </Link>

          <div aria-hidden style={{position:'absolute', inset:0, borderRadius:20, padding:1, pointerEvents:'none', background:'linear-gradient(135deg, rgba(37,99,235,.6), rgba(59,130,246,.4), rgba(5,150,105,.4))', WebkitMask:'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)', WebkitMaskComposite:'xor'}} />
        </div>
      </div>

      <style>{`@keyframes gradientMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
    </div>
  )
}
