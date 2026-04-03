import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { TokenSection } from "@/components/landing/token-section"
import { Roadmap } from "@/components/landing/roadmap"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="features"><Features /></section>
      <section id="token"><TokenSection /></section>
      <section id="roadmap"><Roadmap /></section>
      <Footer />
    </main>
  )
}
