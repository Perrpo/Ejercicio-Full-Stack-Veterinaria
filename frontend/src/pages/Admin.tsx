import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

type TabKey = 'usuarios'|'pacientes'|'servicios'|'citas'|'pagos'

function TopBar({tab, setTab}:{tab:TabKey; setTab:(t:TabKey)=>void}){
  const tabs: {key:TabKey; label:string}[] = [
    {key:'usuarios',label:'Usuarios'},
    {key:'pacientes',label:'Pacientes'},
    {key:'servicios',label:'Servicios'},
    {key:'citas',label:'Citas'},
    {key:'pagos',label:'Pagos'},
  ]
  return (
    <div className="container-app" style={{display:'flex',gap:14,marginTop:18,marginBottom:12}}>
      {tabs.map(t => (
        <button key={t.key} onClick={()=>setTab(t.key)} className="btn-ghost" style={{borderColor: tab===t.key? 'rgba(249,115,22,0.6)':'#eee', background: tab===t.key? 'var(--brand-cream)':'#fff'}}>{t.label}</button>
      ))}
    </div>
  )
}

function SearchBar({placeholder, value, onChange}:{placeholder:string; value:string; onChange:(v:string)=>void}){
  return (
    <div className="container-app" style={{marginTop:8}}>
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} style={{width:'100%',padding:'12px 14px',border:'1px solid #eee',borderRadius:12}} />
    </div>
  )
}

function Section({title, children}:{title:string; children:React.ReactNode}){
  return (
    <section className="section">
      <div className="container-app">
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:600, marginBottom:6}}>{title}</div>
          {children}
        </div>
      </div>
    </section>
  )
}

function Table({headers, rows}:{headers:string[]; rows:React.ReactNode}){
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            {headers.map((h,i)=> (
              <th key={i} style={{textAlign:'left', padding:'10px 8px', borderBottom:'1px solid #f0e7de', fontSize:12, color:'#6b7280'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default function Admin(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  useEffect(()=>{ if(!user || user.rol!=='admin') nav('/login') }, [user])

  const [tab, setTab] = useState<TabKey>('usuarios')
  const [q, setQ] = useState('')

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [pacientes, setPacientes] = useState<any[]>([])
  const [servicios, setServicios] = useState<any[]>([])
  const [citas, setCitas] = useState<any[]>([])
  const [pagos, setPagos] = useState<any[]>([])

  async function fetchAll(){
    if(tab==='usuarios') setUsuarios(await apiFetch(`/admin/usuarios?q=${encodeURIComponent(q)}`))
    if(tab==='pacientes') setPacientes(await apiFetch(`/admin/pacientes?q=${encodeURIComponent(q)}`))
    if(tab==='servicios') setServicios(await apiFetch(`/admin/servicios?q=${encodeURIComponent(q)}`))
    if(tab==='citas') setCitas(await apiFetch(`/admin/citas?q=${encodeURIComponent(q)}`))
    if(tab==='pagos') setPagos(await apiFetch(`/admin/pagos?q=${encodeURIComponent(q)}`))
  }

  useEffect(()=>{ fetchAll() }, [tab])

  const rowsUsuarios = useMemo(()=> usuarios.map(u => (
    <tr key={u.id_usuario}>
      <td style={{padding:'10px 8px'}}>{u.id_usuario}</td>
      <td style={{padding:'10px 8px'}}>{u.nombre} {u.apellido}</td>
      <td style={{padding:'10px 8px'}}>{u.email}</td>
      <td style={{padding:'10px 8px'}}>{u.telefono}</td>
      <td style={{padding:'10px 8px'}}><span className="btn-ghost" style={{padding:'4px 8px', borderColor:'#eee'}}>{u.rol}</span></td>
      <td style={{padding:'10px 8px'}}>{new Date(u.fecha_registro).toLocaleDateString()}</td>
    </tr>
  )), [usuarios])

  const rowsPacientes = useMemo(()=> pacientes.map(p => (
    <tr key={p.id_paciente}>
      <td style={{padding:'10px 8px'}}>{p.id_paciente}</td>
      <td style={{padding:'10px 8px'}}>{p.nombre}</td>
      <td style={{padding:'10px 8px'}}>{p.especie}</td>
      <td style={{padding:'10px 8px'}}>{p.raza}</td>
      <td style={{padding:'10px 8px'}}>{p.edad} años</td>
      <td style={{padding:'10px 8px'}}>{p.peso} kg</td>
      <td style={{padding:'10px 8px'}}>{p.propietario_nombre} {p.propietario_apellido}</td>
    </tr>
  )), [pacientes])

  const rowsServicios = useMemo(()=> servicios.map(s => (
    <tr key={s.id_servicio}>
      <td style={{padding:'10px 8px'}}>{s.id_servicio}</td>
      <td style={{padding:'10px 8px'}}>{s.nombre}</td>
      <td style={{padding:'10px 8px'}}>{s.descripcion}</td>
      <td style={{padding:'10px 8px'}}>${Number(s.precio).toLocaleString('es-CO')}</td>
    </tr>
  )), [servicios])

  const rowsCitas = useMemo(()=> citas.map(c => (
    <tr key={c.id_cita}>
      <td style={{padding:'10px 8px'}}>{c.id_cita}</td>
      <td style={{padding:'10px 8px'}}>{new Date(c.fecha_cita).toLocaleString()}</td>
      <td style={{padding:'10px 8px'}}>{c.cliente_nombre} {c.cliente_apellido}</td>
      <td style={{padding:'10px 8px'}}>{c.paciente_nombre}</td>
      <td style={{padding:'10px 8px'}}>{c.servicio_nombre}</td>
      <td style={{padding:'10px 8px'}}><span className="btn-ghost" style={{padding:'4px 8px', borderColor:'#eee'}}>{c.estado}</span></td>
    </tr>
  )), [citas])

  const rowsPagos = useMemo(()=> pagos.map(p => (
    <tr key={p.id_pago}>
      <td style={{padding:'10px 8px'}}>{p.id_pago}</td>
      <td style={{padding:'10px 8px'}}>{new Date(p.fecha_pago).toLocaleDateString()}</td>
      <td style={{padding:'10px 8px'}}>{p.cliente_nombre}</td>
      <td style={{padding:'10px 8px'}}>{p.servicio_nombre}</td>
      <td style={{padding:'10px 8px'}}>{p.paciente_nombre}</td>
      <td style={{padding:'10px 8px'}}>${Number(p.monto).toLocaleString('es-CO')}</td>
      <td style={{padding:'10px 8px'}}><span className="btn-ghost" style={{padding:'4px 8px', borderColor:'#eee'}}>{p.estado}</span></td>
    </tr>
  )), [pagos])

  return (
    <div>
      <header style={{background:'#ffffff',borderBottom:'1px solid #f1ebe4'}}> 
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

      <TopBar tab={tab} setTab={(t)=>{ setTab(t); setQ('') }} />
      <SearchBar value={q} onChange={setQ} placeholder={`Buscar ${tab}...`} />
      <div className="container-app" style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
        <button className="btn-primary" onClick={fetchAll}>Buscar</button>
      </div>

      {tab==='usuarios' && (
        <Section title="Gestión de Usuarios">
          <Table headers={["ID","Nombre Completo","Email","Teléfono","Rol","Fecha Registro"]} rows={rowsUsuarios} />
        </Section>
      )}

      {tab==='pacientes' && (
        <Section title="Gestión de Pacientes">
          <Table headers={["ID","Nombre","Especie","Raza","Edad","Peso","Propietario"]} rows={rowsPacientes} />
        </Section>
      )}

      {tab==='servicios' && (
        <Section title="Gestión de Servicios">
          <Table headers={["ID","Servicio","Descripción","Precio (COP)"]} rows={rowsServicios} />
        </Section>
      )}

      {tab==='citas' && (
        <Section title="Gestión de Citas">
          <Table headers={["ID","Fecha y Hora","Cliente","Paciente","Servicio","Estado"]} rows={rowsCitas} />
        </Section>
      )}

      {tab==='pagos' && (
        <Section title="Gestión de Pagos">
          <Table headers={["ID","Fecha","Cliente","Servicio","Paciente","Monto","Estado"]} rows={rowsPagos} />
        </Section>
      )}
    </div>
  )
}


