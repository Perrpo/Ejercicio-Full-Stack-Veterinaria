import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Benefits from '../components/Benefits'
import Services from '../components/Services'
import CTA from '../components/CTA'

export default function Landing() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <CTA />
      </main>
    </div>
  )
}


