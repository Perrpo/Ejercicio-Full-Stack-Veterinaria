export default function Hero() {
  return (
    <section className="section" style={{background:'#f8fafc'}}>
      <div className="container-app" style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:56,lineHeight:1.05,margin:0,fontWeight:700,color:'#1f2937'}}>
            Cuidado Veterinario
            <br />
            <span style={{color:'#2563eb'}}>en tu Hogar</span>
          </h1>
          <p style={{marginTop:16,maxWidth:620,color:'#6b7280'}}>
            Ofrecemos servicios veterinarios profesionales a domicilio. Tu mascota recibirá la mejor atención sin salir de casa.
          </p>
          <div style={{display:'flex',gap:12,marginTop:20}}>
            <button className="btn-primary">Comenzar Ahora</button>
            <button className="btn-ghost">Conocer Más</button>
          </div>
        </div>
        <div>
          <img
            src="/images/gato-hero.png"
            alt="Veterinario atendiendo a un gato"
            style={{width:'100%',height:380,objectFit:'cover',borderRadius:16,border:'1px solid #e2e8f0',boxShadow:'0 35px 120px rgba(37, 99, 235, 0.25)'}}
          />
        </div>
      </div>
    </section>
  )
}


