function Benefit({ iconSrc, title, text }: { iconSrc: string; title: string; text: string }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <div className="badge-icon" aria-hidden>
        <img src={iconSrc} alt="" style={{width:20,height:20}} />
      </div>
      <div>
        <div style={{fontWeight:600}}>{title}</div>
        <div style={{fontSize:12,color:'#6b7280'}}>{text}</div>
      </div>
    </div>
  )
}

export default function Benefits() {
  return (
    <section className="section section-muted">
      <div className="container-app" style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:24}}>
        <Benefit iconSrc="/images/icon-location.svg" title="Atención veterinaria a domicilio" text="Cómodo y cercano a tu familia" />
        <Benefit iconSrc="/images/icon-clock.svg" title="Horarios flexibles adaptados a ti" text="Nos ajustamos a tu agenda" />
        <Benefit iconSrc="/images/icon-shield.svg" title="Veterinarios certificados y confiables" text="Profesionales a tu servicio" />
      </div>
    </section>
  )
}


