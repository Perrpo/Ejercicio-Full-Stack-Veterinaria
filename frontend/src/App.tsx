import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Services from './components/Services'
import CTA from './components/CTA'

function App() {
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

export default App
