import { FAQ } from "@/components/sections/FAQ";
import { ExperienceLab } from "@/components/ExperienceLab";
import { ScrollExperience } from "@/components/ScrollExperience";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { TechStrip } from "@/components/sections/TechStrip";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Integrations } from "@/components/sections/Integrations";
import { Contact } from "@/components/sections/Contact";
export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <ScrollExperience />
      <main id="conteudo">
        <Hero />
        <TechStrip />
        <Manifesto />
        <ExperienceLab />
        <Services />
        <Portfolio />
        <Process />
        <About />
        <Integrations />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
