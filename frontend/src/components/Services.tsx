function ServiceCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card" style={{textAlign:'center'}}>
      <div className="badge-icon" style={{margin:'0 auto 12px'}} aria-hidden>
        <img src={icon} alt="" style={{width:20,height:20}} />
      </div>
      <div style={{fontWeight:600, marginBottom:6}}>{title}</div>
      <div style={{fontSize:13, color:'#6b7280'}}>{text}</div>
    </div>
  )
}

export default function Services() {
  return (
    <section className="section">
      <div className="container-app" style={{textAlign:'center'}}>
        <h2 style={{fontSize:24, margin:0}}>Nuestros Servicios</h2>
        <p style={{marginTop:8, color:'#6b7280'}}>Ofrecemos una gama completa de servicios veterinarios diseñados para mantener a tu mascota saludable y feliz.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:20, marginTop:24}}>
          <ServiceCard icon="/images/icon-home.svg" title="Citas a Domicilio" text="Reserva consultas veterinarias en la comodidad de tu hogar" />
          <ServiceCard icon="/images/icon-lab.svg" title="Exámenes Médicos" text="Solicita y revisa los resultados de estudios médicos para tu mascota" />
          <ServiceCard icon="/images/icon-card.svg" title="Pagos Seguros" text="Paga con tarjeta de crédito o efectivo de forma segura" />
        </div>
      </div>
    </section>
  )
}


