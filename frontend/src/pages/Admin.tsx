import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

type TabKey = 'usuarios'|'pacientes'|'servicios'|'citas'|'pagos'

type Usuario = {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  rol: 'cliente'|'veterinario'|'admin'
  fecha_registro: string
}

type Paciente = {
  id_paciente: number
  id_usuario: number
  nombre: string
  especie: string
  raza: string
  edad: number
  peso: number
}

type Servicio = {
  id_servicio: number
  nombre: string
  descripcion: string
  precio: number
}

type Cita = {
  id_cita: number
  id_usuario: number
  id_paciente: number
  id_servicio: number
  fecha_cita: string
  estado: 'pendiente'|'confirmada'|'completada'|'cancelada'
  cliente_nombre?: string
  cliente_apellido?: string
  paciente_nombre?: string
  servicio_nombre?: string
}

type Pago = {
  id_pago: number
  id_cita: number
  metodo_pago: 'tarjeta_credito'|'efectivo'|'transferencia'
  monto: number
  fecha_pago: string
  estado: 'pendiente'|'pagado'|'fallido'
  cliente_nombre?: string
  paciente_nombre?: string
  servicio_nombre?: string
}

function TopBar({tab, setTab}:{tab:TabKey; setTab:(t:TabKey)=>void}){
  const tabs: {key:TabKey; label:string}[] = [
    {key:'usuarios',label:'Usuarios'},
    {key:'pacientes',label:'Pacientes'},
    {key:'servicios',label:'Servicios'},
    {key:'citas',label:'Citas'},
    {key:'pagos',label:'Pagos'},
  ]
  return (
    <div className="container-app" style={{
      display:'flex',
      gap:12,
      marginTop:24,
      marginBottom:16,
      justifyContent:'center'
    }}>
      {tabs.map(t => (
        <button key={t.key} onClick={()=>setTab(t.key)} className="btn-ghost" style={{
          borderColor: tab===t.key? 'rgba(37,99,235,0.6)':'#eee', 
          background: tab===t.key? 'var(--brand-accent-light)':'#fff', 
          padding:'12px 20px', 
          borderRadius:20,
          fontSize:14,
          fontWeight:500,
          transition:'all 0.2s ease',
          boxShadow: tab===t.key? '0 4px 20px rgba(249, 115, 22, 0.15)':'0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function SearchBar({placeholder, value, onChange, onSubmit}:{placeholder:string; value:string; onChange:(v:string)=>void; onSubmit:()=>void}){
  return (
    <div className="container-app" style={{
      marginTop: 16,
      marginBottom: 16,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        position: 'relative'
      }}>
        <form onSubmit={(e)=>{e.preventDefault(); onSubmit()}} style={{position:'relative'}}>
          <span aria-hidden style={{
            position:'absolute',
            left:16,
            top:'50%',
            transform:'translateY(-50%)',
            opacity:0.7,
            zIndex:1
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M21 21l-4.3-4.3" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="7" stroke="#6b7280" strokeWidth="2" fill="none"/>
            </svg>
          </span>
          <input 
            value={value} 
            onChange={(e)=>onChange(e.target.value)} 
            placeholder={placeholder} 
            style={{
              width:'100%',
              padding:'14px 16px 14px 48px',
              border:'2px solid #e2e8f0',
              borderRadius:16,
              fontSize:16,
              background:'#ffffff',
              boxShadow:'0 4px 20px rgba(37, 99, 235, 0.08)',
              transition:'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--brand-orange)'
              e.target.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.15)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.08)'
            }}
          />
        </form>
      </div>
    </div>
  )
}

function Section({title, children}:{title:string; children:React.ReactNode}){
  return (
    <section className="section">
      <div className="container-app">
        <div className="card" style={{
          padding: 18,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 32px rgba(37, 99, 235, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--brand-orange) 0%, var(--brand-orange-600) 100%)'
          }} />
          <div style={{fontWeight:600, marginBottom:6, color: 'var(--brand-text)'}}>{title}</div>
          {children}
        </div>
      </div>
    </section>
  )
}

function Table({headers, rows}:{headers:string[]; rows:React.ReactNode}){
  return (
    <div className="admin-table" style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'separate', borderSpacing:0}}>
        <thead>
          <tr>
            {headers.map((h,i)=> (
              <th key={i} style={{textAlign:'left', padding:'12px 10px', borderBottom:'1px solid #e2e8f0', fontSize:12, color:'#6b7280', background:'#f8fafc'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      <style>
        {`
          .admin-table th, .admin-table td { border-right: 1px solid #e2e8f0; }
          .admin-table th:last-child, .admin-table td:last-child { border-right: none; }
          .admin-table tbody tr { background: #ffffff; }
          .admin-table tbody tr + tr td { border-top: 1px solid #e2e8f0; }
          .admin-table tbody tr:hover { background: #f8fafc; }
        `}
      </style>
    </div>
  )
}

function RoleBadge({role}:{role:Usuario['rol']}){
  const styles: Record<Usuario['rol'], React.CSSProperties> = {
    admin: { background:'#fee2e2', color:'#b91c1c', border:'1px solid #fca5a5' },
    veterinario: { background:'#eef2ff', color:'#1f2937', border:'1px solid #e2e8f0' },
    cliente: { background:'#f3f4f6', color:'#6b7280', border:'1px solid #e2e8f0' },
  }
  return <span style={{...styles[role], padding:'4px 10px', borderRadius:999, fontSize:12}}>{role.charAt(0).toUpperCase()+role.slice(1)}</span>
}

function SpecBadge({spec}:{spec:string}){
  const key = spec.toLowerCase()
  const styles: Record<string, React.CSSProperties> = {
    perro: { background:'#eef2ff', color:'#111827', border:'1px solid #e2e8f0' },
    gato: { background:'#f3f4f6', color:'#374151', border:'1px solid #e2e8f0' },
    conejo:{ background:'#fef3c7', color:'#92400e', border:'1px solid #fde68a' },
    ave:   { background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca' },
  }
  const style = styles[key] || { background:'#f3f4f6', color:'#6b7280', border:'1px solid #e2e8f0' }
  return <span style={{...style, padding:'4px 10px', borderRadius:999, fontSize:12, textTransform:'capitalize'}}>{spec}</span>
}

function StatusBadge({status}:{status:Cita['estado']}){
  const styles: Record<Cita['estado'], React.CSSProperties> = {
    pendiente: { background:'#f3f4f6', color:'#374151', border:'1px solid #e2e8f0' },
    confirmada: { background:'#111827', color:'#ffffff', border:'1px solid #111827' },
    completada: { background:'#e7f8ef', color:'#065f46', border:'1px solid #a7f3d0' },
    cancelada: { background:'#fee2e2', color:'#b91c1c', border:'1px solid #fecaca' },
  }
  const label = status.charAt(0).toUpperCase()+status.slice(1)
  return <span style={{...styles[status], padding:'4px 10px', borderRadius:999, fontSize:12}}>{label}</span>
}

function formatDateDisplay(iso: string){
  const d = new Date(iso)
  // 15 sept 2024
  return new Intl.DateTimeFormat('es-CO', { day:'2-digit', month:'short', year:'numeric' }).format(d).replace(/\./g,'')
}

function formatTime12(iso: string){
  const d = new Date(iso)
  let h = d.getHours()
  const m = d.getMinutes().toString().padStart(2,'0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  const hh = h.toString().padStart(2,'0')
  return `${hh}:${m} ${ampm}`
}

function IconButton({title, onClick, children}:{title:string; onClick:()=>void; children:React.ReactNode}){
  return (
    <button onClick={onClick} title={title} style={{background:'#fff', border:'1px solid #eee', width:32, height:32, display:'inline-grid', placeItems:'center', borderRadius:10, cursor:'pointer'}}>
      {children}
    </button>
  )
}

function Modal({open, onClose, children}:{open:boolean; onClose:()=>void; children:React.ReactNode}){
  if(!open) return null
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.15)', display:'grid', placeItems:'center', zIndex:50}} onClick={onClose}>
      <div className="card" style={{width:'min(640px, 92vw)', padding:20}} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function UserForm({initial, onSubmit, onCancel}:{initial?:Partial<Usuario>; onSubmit:(u:Partial<Usuario>)=>void; onCancel:()=>void}){
  const [nombre, setNombre] = useState(initial?.nombre||'')
  const [apellido, setApellido] = useState(initial?.apellido||'')
  const [email, setEmail] = useState(initial?.email||'')
  const [telefono, setTelefono] = useState(initial?.telefono||'')
  const [direccion, setDireccion] = useState(initial?.direccion||'')
  const [rol, setRol] = useState<Usuario['rol']>(initial?.rol||'cliente')
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSubmit({nombre, apellido, email, telefono, direccion, rol})}}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Nombre</label>
          <input value={nombre} onChange={(e)=>setNombre(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Apellido</label>
          <input value={apellido} onChange={(e)=>setApellido(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Teléfono</label>
          <input value={telefono} onChange={(e)=>setTelefono(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Dirección</label>
          <input value={direccion} onChange={(e)=>setDireccion(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Rol</label>
          <select value={rol} onChange={(e)=>setRol(e.target.value as Usuario['rol'])} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            <option value="cliente">Cliente</option>
            <option value="veterinario">Veterinario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:16}}>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  )
}

export default function Admin(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  useEffect(()=>{ if(!user || user.rol!=='admin') nav('/login') }, [user])

  const [tab, setTab] = useState<TabKey>('usuarios')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])

  async function fetchAll(){
    setLoading(true)
    if(tab==='usuarios') setUsuarios(await apiFetch(`/admin/usuarios?q=${encodeURIComponent(q)}`))
    if(tab==='pacientes') {
      setPacientes(await apiFetch(`/admin/pacientes?q=${encodeURIComponent(q)}`))
      // dueños para el formulario
      setUsuarios(await apiFetch(`/admin/usuarios?q=`))
    }
    if(tab==='servicios') setServicios(await apiFetch(`/admin/servicios?q=${encodeURIComponent(q)}`))
    if(tab==='citas'){
      setCitas(await apiFetch(`/admin/citas?q=${encodeURIComponent(q)}`))
      setUsuarios(await apiFetch(`/admin/usuarios?q=`))
      setPacientes(await apiFetch(`/admin/pacientes?q=`))
      setServicios(await apiFetch(`/admin/servicios?q=`))
    }
    if(tab==='pagos') {
      setPagos(await apiFetch(`/admin/pagos?q=${encodeURIComponent(q)}`))
      setCitas(await apiFetch(`/admin/citas?q=`))
      // Cargar usuarios y pacientes para el formulario de pagos
      setUsuarios(await apiFetch(`/admin/usuarios?q=`))
      setPacientes(await apiFetch(`/admin/pacientes?q=`))
      setServicios(await apiFetch(`/admin/servicios?q=`))
    }
    setLoading(false)
  }

  useEffect(()=>{ fetchAll() }, [tab])

  // Búsqueda con debounce (mejora UX)
  useEffect(()=>{
    const id = setTimeout(()=>{ if(q.trim().length>=0) fetchAll() }, 400)
    return ()=> clearTimeout(id)
  }, [q])

  async function onNewUser(){
    setEditing(null)
    setOpenModal(true)
  }

  async function saveUser(data: Partial<Usuario>){
    if(editing){
      await apiFetch(`/admin/usuarios/${editing.id_usuario}`, { method:'PUT', body: JSON.stringify(data) })
    } else {
      await apiFetch('/admin/usuarios', { method:'POST', body: JSON.stringify(data) })
    }
    setOpenModal(false)
    await fetchAll()
  }

  async function deleteUser(u: Usuario){
    if(!confirm(`Eliminar usuario ${u.nombre} ${u.apellido}?`)) return
    await apiFetch(`/admin/usuarios/${u.id_usuario}`, { method:'DELETE' })
    await fetchAll()
  }

  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Usuario|null>(null)

  const rowsUsuarios = useMemo(()=> usuarios.map(u => (
    <tr key={u.id_usuario}>
      <td style={{padding:'10px 8px'}}>{u.id_usuario}</td>
      <td style={{padding:'10px 8px'}}>{u.nombre} {u.apellido}<div style={{fontSize:12,color:'#6b7280'}}>{u.direccion}</div></td>
      <td style={{padding:'10px 8px'}}>{u.email}</td>
      <td style={{padding:'10px 8px'}}>{u.telefono}</td>
      <td style={{padding:'10px 8px'}}><RoleBadge role={u.rol} /></td>
      <td style={{padding:'10px 8px'}}>{new Date(u.fecha_registro).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })}</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'inline-flex', gap:6}}>
          <IconButton title="Editar" onClick={()=>{ setEditing(u); setOpenModal(true) }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#374151"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#374151"/></svg>
          </IconButton>
          <IconButton title="Eliminar" onClick={()=>deleteUser(u)}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7z" fill="#b91c1c"/><path d="M9 7V5h6v2" fill="#b91c1c"/><path d="M4 7h16" stroke="#b91c1c" strokeWidth="2"/></svg>
          </IconButton>
        </div>
      </td>
    </tr>
  )), [usuarios])

  // Pacientes CRUD
  const [openPatientModal, setOpenPatientModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Paciente|null>(null)

  function onNewPatient(){ setEditingPatient(null); setOpenPatientModal(true) }

  async function savePatient(data: Partial<Paciente>){
    const payload = { ...data, edad: Number(data.edad), peso: Number(data.peso) }
    if(editingPatient){
      await apiFetch(`/admin/pacientes/${editingPatient.id_paciente}`, { method:'PUT', body: JSON.stringify(payload) })
    } else {
      await apiFetch('/admin/pacientes', { method:'POST', body: JSON.stringify(payload) })
    }
    setOpenPatientModal(false)
    await fetchAll()
  }

  async function deletePatient(p: Paciente){
    if(!confirm(`Eliminar paciente ${p.nombre}?`)) return
    await apiFetch(`/admin/pacientes/${p.id_paciente}`, { method:'DELETE' })
    await fetchAll()
  }

  const rowsPacientes = useMemo(()=> pacientes.map(p => (
    <tr key={p.id_paciente}>
      <td style={{padding:'10px 8px'}}>{p.id_paciente}</td>
      <td style={{padding:'10px 8px'}}>{p.nombre}</td>
      <td style={{padding:'10px 8px'}}><SpecBadge spec={p.especie} /></td>
      <td style={{padding:'10px 8px'}}>{p.raza}</td>
      <td style={{padding:'10px 8px'}}>{p.edad} años</td>
      <td style={{padding:'10px 8px'}}>{p.peso} kg</td>
      <td style={{padding:'10px 8px'}}>{(usuarios.find(u=>u.id_usuario===p.id_usuario)?.nombre)||''} {(usuarios.find(u=>u.id_usuario===p.id_usuario)?.apellido)||''}</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'inline-flex', gap:6}}>
          <IconButton title="Editar" onClick={()=>{ setEditingPatient(p); setOpenPatientModal(true) }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#374151"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#374151"/></svg>
          </IconButton>
          <IconButton title="Eliminar" onClick={()=>deletePatient(p)}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7z" fill="#b91c1c"/><path d="M9 7V5h6v2" fill="#b91c1c"/><path d="M4 7h16" stroke="#b91c1c" strokeWidth="2"/></svg>
          </IconButton>
        </div>
      </td>
    </tr>
  )), [pacientes, usuarios])

  // Servicios CRUD
  const [openServiceModal, setOpenServiceModal] = useState(false)
  const [editingService, setEditingService] = useState<Servicio|null>(null)

  function onNewService(){ setEditingService(null); setOpenServiceModal(true) }

  async function saveService(data: Partial<Servicio>){
    const payload = { ...data, precio: Number(data.precio) }
    if(editingService){
      await apiFetch(`/admin/servicios/${editingService.id_servicio}`, { method:'PUT', body: JSON.stringify(payload) })
    } else {
      await apiFetch('/admin/servicios', { method:'POST', body: JSON.stringify(payload) })
    }
    setOpenServiceModal(false)
    await fetchAll()
  }

  async function deleteService(s: Servicio){
    if(!confirm(`Eliminar servicio ${s.nombre}?`)) return
    await apiFetch(`/admin/servicios/${s.id_servicio}`, { method:'DELETE' })
    await fetchAll()
  }

  const rowsServicios = useMemo(()=> servicios.map(s => (
    <tr key={s.id_servicio}>
      <td style={{padding:'10px 8px'}}>{s.id_servicio}</td>
      <td style={{padding:'10px 8px'}}>{s.nombre}</td>
      <td style={{padding:'10px 8px'}}>{s.descripcion}</td>
      <td style={{padding:'10px 8px'}}>{`$ ${Number(s.precio).toLocaleString('es-CO')}`}</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'inline-flex', gap:6}}>
          <IconButton title="Editar" onClick={()=>{ setEditingService(s); setOpenServiceModal(true) }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#374151"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#374151"/></svg>
          </IconButton>
          <IconButton title="Eliminar" onClick={()=>deleteService(s)}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7z" fill="#b91c1c"/><path d="M9 7V5h6v2" fill="#b91c1c"/><path d="M4 7h16" stroke="#b91c1c" strokeWidth="2"/></svg>
          </IconButton>
        </div>
      </td>
    </tr>
  )), [servicios])

  // Citas CRUD + badges de estado
  const [openCitaModal, setOpenCitaModal] = useState(false)
  const [editingCita, setEditingCita] = useState<Cita|null>(null)

  function onNewCita(){ setEditingCita(null); setOpenCitaModal(true) }

  async function saveCita(data: Partial<Cita>){
    const payload = { ...data }
    if(editingCita){
      await apiFetch(`/admin/citas/${editingCita.id_cita}`, { method:'PUT', body: JSON.stringify(payload) })
    } else {
      await apiFetch('/admin/citas', { method:'POST', body: JSON.stringify(payload) })
    }
    setOpenCitaModal(false)
    await fetchAll()
  }

  async function deleteCita(c: Cita){
    if(!confirm(`Eliminar la cita #${c.id_cita}?`)) return
    await apiFetch(`/admin/citas/${c.id_cita}`, { method:'DELETE' })
    await fetchAll()
  }

  const rowsCitas = useMemo(()=> citas.map(c => (
    <tr key={c.id_cita}>
      <td style={{padding:'10px 8px'}}>{c.id_cita}</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <span>{formatDateDisplay(c.fecha_cita)}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8, marginTop:4, color:'#6b7280'}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#9ca3af" strokeWidth="1.6"/><path d="M12 6v6l4 2" fill="none" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <span>{formatTime12(c.fecha_cita)}</span>
        </div>
      </td>
      <td style={{padding:'10px 8px'}}>{c.cliente_nombre} {c.cliente_apellido}</td>
      <td style={{padding:'10px 8px'}}>{c.paciente_nombre}</td>
      <td style={{padding:'10px 8px'}}>{c.servicio_nombre}</td>
      <td style={{padding:'10px 8px'}}><StatusBadge status={c.estado} /></td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'inline-flex', gap:6}}>
          <IconButton title="Editar" onClick={()=>{ setEditingCita(c); setOpenCitaModal(true) }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#374151"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#374151"/></svg>
          </IconButton>
          <IconButton title="Eliminar" onClick={()=>deleteCita(c)}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7z" fill="#b91c1c"/><path d="M9 7V5h6v2" fill="#b91c1c"/><path d="M4 7h16" stroke="#b91c1c" strokeWidth="2"/></svg>
          </IconButton>
        </div>
      </td>
    </tr>
  )), [citas])

  // Pagos CRUD
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Pago|null>(null)

  function onNewPayment(){ setEditingPayment(null); setOpenPaymentModal(true) }

  async function savePayment(data: Partial<Pago>){
    try {
      let payload: Partial<Pago>
      
      // Validar que los datos requeridos estén presentes
      if (!data.id_cita || !data.metodo_pago || !data.monto || !data.estado) {
        alert('Por favor, completa todos los campos requeridos')
        return
      }
      
      if(editingPayment){
        // Para editar, solo enviamos los campos que queremos actualizar
        payload = { 
          ...data, 
          monto: Number(data.monto)
        }
        console.log('Actualizando pago existente:', editingPayment.id_pago, payload)
        const response = await apiFetch(`/admin/pagos/${editingPayment.id_pago}`, { method:'PUT', body: JSON.stringify(payload) })
        console.log('Respuesta del servidor:', response)
      } else {
        // Para crear nuevo, incluimos la fecha en formato MySQL compatible
        const now = new Date();
        const mysqlDate = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0') + ' ' + 
                         String(now.getHours()).padStart(2, '0') + ':' + 
                         String(now.getMinutes()).padStart(2, '0') + ':' + 
                         String(now.getSeconds()).padStart(2, '0');
        
        payload = { 
          ...data, 
          monto: Number(data.monto),
          fecha_pago: mysqlDate
        }
        console.log('Creando nuevo pago:', payload)
        const response = await apiFetch('/admin/pagos', { method:'POST', body: JSON.stringify(payload) })
        console.log('Respuesta del servidor:', response)
      }
      setOpenPaymentModal(false)
      await fetchAll()
         } catch (error: unknown) {
       console.error('Error al guardar el pago:', error)
       // Mostrar información más detallada del error
       let errorMessage = 'Error al guardar el pago. '
       if (error instanceof Error && error.message.includes('Error de red')) {
         errorMessage += 'El servidor no respondió correctamente. Verifica que esté funcionando.'
       } else if (error instanceof Error) {
         errorMessage += error.message
       } else {
         errorMessage += 'Error desconocido'
       }
       alert(errorMessage)
     }
  }

  async function deletePayment(p: Pago){
    if(!confirm(`Eliminar el pago #${p.id_pago}?`)) return
    await apiFetch(`/admin/pagos/${p.id_pago}`, { method:'DELETE' })
    await fetchAll()
  }

  const rowsPagos = useMemo(()=> pagos.map(p => (
    <tr key={p.id_pago}>
      <td style={{padding:'10px 8px'}}>{p.id_pago}</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 2v3M17 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <span>{formatDateDisplay(p.fecha_pago)}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8, marginTop:4, color:'#6b7280'}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#9ca3af" strokeWidth="1.6"/><path d="M12 6v6l4 2" fill="none" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <span>{formatTime12(p.fecha_pago)}</span>
        </div>
      </td>
      <td style={{padding:'10px 8px'}}>{p.cliente_nombre}</td>
      <td style={{padding:'10px 8px'}}>{p.servicio_nombre}</td>
      <td style={{padding:'10px 8px'}}>{p.paciente_nombre}</td>
      <td style={{padding:'10px 8px'}}>{`$ ${Number(p.monto).toLocaleString('es-CO')}`}</td>
      <td style={{padding:'10px 8px'}}>{
        p.estado === 'pagado' ? <span style={{background:'#e7f8ef', color:'#065f46', border:'1px solid #a7f3d0', padding:'4px 10px', borderRadius:999, fontSize:12}}>Pagado</span>
        : p.estado === 'pendiente' ? <span style={{background:'#f3f4f6', color:'#374151', border:'1px solid #e5e7eb', padding:'4px 10px', borderRadius:999, fontSize:12}}>Pendiente</span>
        : <span style={{background:'#fee2e2', color:'#b91c1c', border:'1px solid #fecaca', padding:'4px 10px', borderRadius:999, fontSize:12}}>Fallido</span>
      }</td>
      <td style={{padding:'10px 8px'}}>
        <div style={{display:'inline-flex', gap:6}}>
          <IconButton title="Editar" onClick={()=>{ setEditingPayment(p); setOpenPaymentModal(true) }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#374151"/><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#374151"/></svg>
          </IconButton>
          <IconButton title="Eliminar" onClick={()=>deletePayment(p)}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 7h12l-1 14H7L6 7z" fill="#b91c1c"/><path d="M9 7V5h6v2" fill="#b91c1c"/><path d="M4 7h16" stroke="#b91c1c" strokeWidth="2"/></svg>
          </IconButton>
        </div>
      </td>
    </tr>
  )), [pagos])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #f8fafc 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <header style={{
        background: 'linear-gradient(90deg, #ffffff 0%, #fff9f5 100%)',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 20px rgba(249, 115, 22, 0.08)'
      }}> 
        <div className="container-app" style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <img src="/images/logo-mark.svg" alt="Logo VetCare" style={{width:24,height:24}} />
            <strong style={{fontSize:18}}>Sistema de Gestión Veterinaria</strong>
          </div>
          <nav style={{display:'flex',gap:8}}>
            <button className="btn-ghost" onClick={()=>{ window.location.href='/' }}>Inicio</button>
            <button className="btn-primary" onClick={()=>{ logout(); window.location.href='/login' }}>Salir</button>
          </nav>
        </div>
      </header>

      <div style={{
        background: 'radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.03) 0%, transparent 50%)',
        minHeight: 'calc(100vh - 64px)',
        paddingTop: '32px',
        paddingBottom: '32px'
      }}>
        <TopBar tab={tab} setTab={(t)=>{ setTab(t); setQ('') }} />
        <SearchBar value={q} onChange={setQ} onSubmit={fetchAll} placeholder={`Buscar ${tab}...`} />

      {tab==='usuarios' && (
        <Section title="Gestión de Usuarios">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#6b7280'}}>Clientes, veterinarios y administradores del sistema</div>
            <button className="btn-primary" onClick={onNewUser} style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Nuevo Usuario
            </button>
          </div>
          {loading ? (
            <div style={{padding:16,color:'#6b7280'}}>Cargando usuarios…</div>
          ) : (
            <>
              <Table headers={["ID","Nombre Completo","Email","Teléfono","Rol","Fecha Registro","Acciones"]} rows={rowsUsuarios} />
              <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Mostrando {usuarios.length} usuario(s)</div>
            </>
          )}
        </Section>
      )}

      {tab==='pacientes' && (
        <Section title="Gestión de Pacientes">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#6b7280'}}>Mascotas y animales registrados en el sistema</div>
            <button className="btn-primary" onClick={onNewPatient} style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Nuevo Paciente
            </button>
          </div>
          <Table headers={["ID","Nombre","Especie","Raza","Edad","Peso (kg)","Propietario","Acciones"]} rows={rowsPacientes} />
          <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Mostrando {pacientes.length} paciente(s)</div>
        </Section>
      )}

      {tab==='servicios' && (
        <Section title="Gestión de Servicios">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#6b7280'}}>Servicios médicos y tratamientos ofrecidos</div>
            <button className="btn-primary" onClick={onNewService} style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Nuevo Servicio
            </button>
          </div>
          <Table headers={["ID","Nombre del Servicio","Descripción","Precio","Acciones"]} rows={rowsServicios} />
          <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>
            Precio promedio: {`$ ${(
              servicios.length ? (servicios.reduce((a,b)=> a + Number(b.precio||0), 0) / servicios.length) : 0
            ).toLocaleString('es-CO', {maximumFractionDigits:0})}`}
          </div>
        </Section>
      )}

      {tab==='citas' && (
        <Section title="Gestión de Citas">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#6b7280'}}>Agenda y seguimiento de citas médicas</div>
            <button className="btn-primary" onClick={onNewCita} style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Nueva Cita
            </button>
          </div>
          <Table headers={["ID","Fecha y Hora","Cliente","Paciente","Servicio","Estado","Acciones"]} rows={rowsCitas} />
          <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>
            Pendientes: {citas.filter(x=>x.estado==='pendiente').length} · Confirmadas: {citas.filter(x=>x.estado==='confirmada').length} · Completadas: {citas.filter(x=>x.estado==='completada').length} · Canceladas: {citas.filter(x=>x.estado==='cancelada').length}
          </div>
        </Section>
      )}

      {tab==='pagos' && (
        <Section title="Gestión de Pagos">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <div style={{fontSize:13,color:'#6b7280'}}>Registro y seguimiento de pagos realizados</div>
            <button className="btn-primary" onClick={onNewPayment} style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              Registrar Pago
            </button>
          </div>
                     <div className="container-app" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14, marginBottom:12}}>
             <div className="card" style={{
               borderLeft:'6px solid #10b981',
               background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
               boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)'
             }}>
               <div style={{display:'flex',alignItems:'center',gap:8,color:'#059669'}}>
                 <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 12h16" stroke="#059669" strokeWidth="2"/><path d="M4 7h16" stroke="#059669" strokeWidth="2"/><path d="M4 17h16" stroke="#059669" strokeWidth="2"/></svg>
                 <strong>Total Pagado</strong>
               </div>
               <div style={{fontSize:26, marginTop:6, color:'#059669'}}>{`$ ${(pagos.filter(p=>p.estado==='pagado').reduce((a,b)=>a+Number(b.monto||0),0)).toLocaleString('es-CO')}`}</div>
             </div>
             <div className="card" style={{
               borderLeft:'6px solid #f59e0b',
               background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
               boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)'
             }}>
               <div style={{display:'flex',alignItems:'center',gap:8,color:'#d97706'}}>
                 <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 8v4l3 3" stroke="#d97706" strokeWidth="2" fill="none"/></svg>
                 <strong>Pendiente</strong>
               </div>
               <div style={{fontSize:26, marginTop:6, color:'#d97706'}}>{`$ ${(pagos.filter(p=>p.estado==='pendiente').reduce((a,b)=>a+Number(b.monto||0),0)).toLocaleString('es-CO')}`}</div>
             </div>
             <div className="card" style={{
               borderLeft:'6px solid #6b7280',
               background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
               boxShadow: '0 4px 20px rgba(107, 114, 128, 0.1)'
             }}>
               <div style={{display:'flex',alignItems:'center',gap:8,color:'#6b7280'}}>
                 <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 12h16" stroke="#6b7280" strokeWidth="2"/></svg>
                 <strong>Total Transacciones</strong>
               </div>
               <div style={{fontSize:26, marginTop:6, color:'#6b7280'}}>{pagos.length}</div>
             </div>
           </div>
          <Table headers={["ID","Fecha y Hora","Cliente","Servicio","Paciente","Monto","Estado","Acciones"]} rows={rowsPagos} />
          <div style={{marginTop:8,fontSize:12,color:'#6b7280'}}>Pagados: {pagos.filter(p=>p.estado==='pagado').length} · Pendientes: {pagos.filter(p=>p.estado==='pendiente').length} · Fallidos: {pagos.filter(p=>p.estado==='fallido').length}</div>
                 </Section>
       )}
       </div>

       <Modal open={openModal} onClose={()=>setOpenModal(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:600}}>{editing? 'Editar Usuario' : 'Nuevo Usuario'}</div>
          <button className="btn-ghost" onClick={()=>setOpenModal(false)}>Cerrar</button>
        </div>
        <UserForm initial={editing ?? undefined} onCancel={()=>setOpenModal(false)} onSubmit={saveUser} />
      </Modal>

      <Modal open={openPatientModal} onClose={()=>setOpenPatientModal(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:600}}>{editingPatient? 'Editar Paciente' : 'Nuevo Paciente'}</div>
          <button className="btn-ghost" onClick={()=>setOpenPatientModal(false)}>Cerrar</button>
        </div>
        <PatientForm owners={usuarios} initial={editingPatient ?? undefined} onCancel={()=>setOpenPatientModal(false)} onSubmit={savePatient} />
      </Modal>

      <Modal open={openServiceModal} onClose={()=>setOpenServiceModal(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:600}}>{editingService? 'Editar Servicio' : 'Nuevo Servicio'}</div>
          <button className="btn-ghost" onClick={()=>setOpenServiceModal(false)}>Cerrar</button>
        </div>
        <ServiceForm initial={editingService ?? undefined} onCancel={()=>setOpenServiceModal(false)} onSubmit={saveService} />
      </Modal>

      <Modal open={openCitaModal} onClose={()=>setOpenCitaModal(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:600}}>{editingCita? 'Editar Cita' : 'Nueva Cita'}</div>
          <button className="btn-ghost" onClick={()=>setOpenCitaModal(false)}>Cerrar</button>
        </div>
        <CitaForm
          owners={usuarios}
          patients={pacientes}
          services={servicios}
          initial={editingCita ?? undefined}
          onCancel={()=>setOpenCitaModal(false)}
          onSubmit={saveCita}
        />
      </Modal>

      <Modal open={openPaymentModal} onClose={()=>setOpenPaymentModal(false)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:600}}>{editingPayment? 'Editar Pago' : 'Nuevo Pago'}</div>
          <button className="btn-ghost" onClick={()=>setOpenPaymentModal(false)}>Cerrar</button>
        </div>
        <PaymentForm
          citas={citas}
          initial={editingPayment ?? undefined}
          onCancel={()=>setOpenPaymentModal(false)}
          onSubmit={savePayment}
        />
      </Modal>
    </div>
  )
}

function PatientForm({owners, initial, onSubmit, onCancel}:{owners:Usuario[]; initial?:Partial<Paciente>; onSubmit:(p:Partial<Paciente>)=>void; onCancel:()=>void}){
  const [id_usuario, setOwner] = useState<number>(initial?.id_usuario || (owners[0]?.id_usuario||0))
  const [nombre, setNombre] = useState(initial?.nombre||'')
  const [especie, setEspecie] = useState(initial?.especie||'Perro')
  const [raza, setRaza] = useState(initial?.raza||'')
  const [edad, setEdad] = useState<number>(initial?.edad || 0)
  const [peso, setPeso] = useState<number>(initial?.peso || 0)
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ id_usuario, nombre, especie, raza, edad, peso }) }}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Propietario</label>
          <select value={id_usuario} onChange={(e)=>setOwner(Number(e.target.value))} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            {owners.map(o => (
              <option key={o.id_usuario} value={o.id_usuario}>{o.nombre} {o.apellido}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Nombre</label>
          <input value={nombre} onChange={(e)=>setNombre(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Especie</label>
          <select value={especie} onChange={(e)=>setEspecie(e.target.value)} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            <option>Perro</option>
            <option>Gato</option>
            <option>Conejo</option>
            <option>Ave</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Raza</label>
          <input value={raza} onChange={(e)=>setRaza(e.target.value)} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
                 <div>
           <label style={{fontSize:12,color:'#6b7280'}}>Edad (años)</label>
           <input 
             type="text" 
             value={edad || ''} 
             onChange={(e)=>{
               const value = e.target.value.replace(/[^0-9]/g, '');
               setEdad(value ? Number(value) : 0);
             }} 
             placeholder="0"
             style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} 
           />
         </div>
         <div>
           <label style={{fontSize:12,color:'#6b7280'}}>Peso (kg)</label>
           <input 
             type="text" 
             value={peso ? peso.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : ''} 
             onChange={(e)=>{
               // Remover todos los caracteres excepto números y punto
               const value = e.target.value.replace(/[^0-9.]/g, '');
               // Permitir solo un punto decimal y máximo 2 decimales
               const parts = value.split('.');
               if (parts.length <= 2 && (!parts[1] || parts[1].length <= 2)) {
                 setPeso(value ? Number(value) : 0);
               }
             }}
             onFocus={(e) => {
               // Al hacer foco, mostrar el número sin formatear para facilitar la edición
               e.target.value = peso.toString();
             }}
             onBlur={(e) => {
               // Al perder el foco, formatear el número
               e.target.value = peso ? peso.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : '';
             }}
             placeholder="0.0"
             style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} 
           />
         </div>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:16}}>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  )
}

function ServiceForm({initial, onSubmit, onCancel}:{initial?:Partial<Servicio>; onSubmit:(s:Partial<Servicio>)=>void; onCancel:()=>void}){
  const [nombre, setNombre] = useState(initial?.nombre||'')
  const [descripcion, setDescripcion] = useState(initial?.descripcion||'')
  const [precio, setPrecio] = useState<number>(Number(initial?.precio||0))
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ nombre, descripcion, precio }) }}>
      <div style={{display:'grid', gridTemplateColumns:'1fr', gap:12}}>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Nombre del Servicio</label>
          <input value={nombre} onChange={(e)=>setNombre(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Descripción</label>
          <textarea value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} rows={3} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
                 <div>
           <label style={{fontSize:12,color:'#6b7280'}}>Precio (COP)</label>
           <input 
             type="text" 
             value={precio ? precio.toLocaleString('es-CO') : ''} 
             onChange={(e)=>{
               // Remover todos los caracteres no numéricos
               const value = e.target.value.replace(/[^0-9]/g, '');
               setPrecio(value ? Number(value) : 0);
             }}
             onFocus={(e) => {
               // Al hacer foco, mostrar el número sin formatear para facilitar la edición
               e.target.value = precio.toString();
             }}
             onBlur={(e) => {
               // Al perder el foco, formatear el número
               e.target.value = precio ? precio.toLocaleString('es-CO') : '';
             }}
             placeholder="0"
             required 
             style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} 
           />
         </div>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:16}}>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  )
}

function CitaForm({owners, patients, services, initial, onSubmit, onCancel}:{owners:Usuario[]; patients:Paciente[]; services:Servicio[]; initial?:Partial<Cita>; onSubmit:(c:Partial<Cita>)=>void; onCancel:()=>void}){
  const [id_usuario, setUser] = useState<number>(initial?.id_usuario || (owners[0]?.id_usuario||0))
  const [id_paciente, setPatient] = useState<number>(initial?.id_paciente || (patients[0]?.id_paciente||0))
  const [id_servicio, setService] = useState<number>(initial?.id_servicio || (services[0]?.id_servicio||0))
  const [fecha_cita, setFecha] = useState(initial?.fecha_cita ? initial!.fecha_cita.substring(0,16) : '')
  const [estado, setEstado] = useState<Cita['estado']>(initial?.estado || 'pendiente')
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ id_usuario, id_paciente, id_servicio, fecha_cita, estado }) }}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Cliente</label>
          <select value={id_usuario} onChange={(e)=>setUser(Number(e.target.value))} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            {owners.map(o => (
              <option key={o.id_usuario} value={o.id_usuario}>{o.nombre} {o.apellido}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Paciente</label>
          <select value={id_paciente} onChange={(e)=>setPatient(Number(e.target.value))} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            {patients.map(p => (
              <option key={p.id_paciente} value={p.id_paciente}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Servicio</label>
          <select value={id_servicio} onChange={(e)=>setService(Number(e.target.value))} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            {services.map(s => (
              <option key={s.id_servicio} value={s.id_servicio}>{s.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Fecha y hora</label>
          <input type="datetime-local" value={fecha_cita} onChange={(e)=>setFecha(e.target.value)} required style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} />
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Estado</label>
          <select value={estado} onChange={(e)=>setEstado(e.target.value as Cita['estado'])} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:16}}>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">Guardar</button>
      </div>
    </form>
  )
}

function PaymentForm({citas, initial, onSubmit, onCancel}:{citas:Cita[]; initial?:Partial<Pago>; onSubmit:(p:Partial<Pago>)=>void; onCancel:()=>void}){
  const [id_cita, setCita] = useState<number>(initial?.id_cita || (citas[0]?.id_cita||0))
  const [metodo_pago, setMetodo] = useState<Pago['metodo_pago']>(initial?.metodo_pago || 'tarjeta_credito')
  const [monto, setMonto] = useState<number>(Number(initial?.monto || 0))
  const [estado, setEstado] = useState<Pago['estado']>(initial?.estado || 'pendiente')
  
  // Obtener la cita seleccionada para mostrar información adicional
  const citaSeleccionada = citas.find(c => c.id_cita === id_cita)
  
  // Actualizar el monto cuando se seleccione una cita diferente (para nuevos pagos)
  useEffect(() => {
    if (!initial && citas.length > 0 && id_cita) {
      const cita = citas.find(c => c.id_cita === id_cita)
      if (cita) {
        // Aquí podrías obtener el precio del servicio si lo tienes disponible
        // Por ahora dejamos el monto como está
      }
    }
  }, [id_cita, citas, initial])
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ id_cita, metodo_pago, monto, estado }) }}>
      {initial && (
        <div style={{
          marginBottom: 16, 
          padding: '12px 16px', 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
          border: '2px solid #0ea5e9', 
          borderRadius: 12, 
          fontSize: 13, 
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0ea5e9">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <strong>Editando pago #{initial.id_pago}</strong> - Modifica los campos necesarios
        </div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Cita</label>
          <select value={id_cita} onChange={(e)=>setCita(Number(e.target.value))} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            {citas.map((c: Cita) => (
              <option key={c.id_cita} value={c.id_cita}>{c.cliente_nombre} {c.cliente_apellido} - {c.paciente_nombre} - {formatDateDisplay(c.fecha_cita)}</option>
            ))}
          </select>
          {citaSeleccionada && (
            <div style={{marginTop: 4, fontSize: 11, color: '#6b7280', padding: '8px', background: '#f9fafb', borderRadius: 6}}>
              <strong>Detalles de la cita:</strong><br/>
              Cliente: {citaSeleccionada.cliente_nombre} {citaSeleccionada.cliente_apellido}<br/>
              Paciente: {citaSeleccionada.paciente_nombre}<br/>
              Servicio: {citaSeleccionada.servicio_nombre}<br/>
              Fecha: {formatDateDisplay(citaSeleccionada.fecha_cita)} a las {formatTime12(citaSeleccionada.fecha_cita)}
            </div>
          )}
        </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Método de Pago</label>
          <select value={metodo_pago} onChange={(e)=>setMetodo(e.target.value as Pago['metodo_pago'])} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            <option value="tarjeta_credito">Tarjeta de Crédito</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
                 <div>
           <label style={{fontSize:12,color:'#6b7280'}}>Monto (COP)</label>
           <input 
             type="text" 
             value={monto ? monto.toLocaleString('es-CO') : ''} 
             onChange={(e)=>{
               // Remover todos los caracteres no numéricos
               const value = e.target.value.replace(/[^0-9]/g, '');
               setMonto(value ? Number(value) : 0);
             }}
             onFocus={(e) => {
               // Al hacer foco, mostrar el número sin formatear para facilitar la edición
               e.target.value = monto.toString();
             }}
             onBlur={(e) => {
               // Al perder el foco, formatear el número
               e.target.value = monto ? monto.toLocaleString('es-CO') : '';
             }}
             placeholder="0"
             required 
             style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}} 
           />
         </div>
        <div>
          <label style={{fontSize:12,color:'#6b7280'}}>Estado</label>
          <select value={estado} onChange={(e)=>setEstado(e.target.value as Pago['estado'])} style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:10}}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="fallido">Fallido</option>
          </select>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:16}}>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-primary">
          {initial ? 'Actualizar Pago' : 'Guardar Pago'}
        </button>
      </div>
    </form>
  )
}


