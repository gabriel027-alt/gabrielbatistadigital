import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Arrow, ArrowDown } from "./ui/icons";
import { HeroScene } from "./HeroScene";
export function Hero() {
  return <section id="inicio" className="studio-hero portrait-hero">
    <div className="hero-pin">
      <HeroScene />
      <div className="shell studio-hero-layout"><div className="studio-hero-copy">
        <p className="eyebrow"><span className="status-dot" /> GABRIEL BATISTA / DESIGN & DESENVOLVIMENTO WEB</p>
        <h1>Seu negócio.<br /><span>Um site à altura.</span></h1>
        <p className="studio-hero-description">Crio sites e landing pages para apresentar o valor da sua marca e facilitar o próximo contato. Do design ao desenvolvimento, você conversa direto comigo.</p>
        <div className="studio-hero-actions">
          <a className="button button-primary" href={buildWhatsAppUrl("Olá, Gabriel! Quero um site para meu negócio. Podemos conversar sobre o projeto?")} target="_blank" rel="noopener noreferrer">Conversar sobre meu site <Arrow size={17} /></a>
          <a className="studio-project-link" href="#modelos">Ver modelos por nicho <ArrowDown size={15} /></a>
        </div>
        <p className="hero-contact-note">Conte o que sua empresa faz e o que precisa melhorar no digital.</p>
        <ul className="hero-value-points" aria-label="Como trabalho"><li>Design e código no mesmo projeto</li><li>Experiência para desktop e celular</li><li>Escopo definido antes de começar</li></ul>
      </div></div>
      <div className="portrait-signature"><span>Gabriel Batista</span><p>Seu projeto, em contato direto<br />com quem vai desenvolver.</p></div>
      <div className="shell studio-hero-footer"><span>20 DEMONSTRAÇÕES PARA EXPLORAR · MARCAS FICTÍCIAS</span><a href="#modelos">ENCONTRE SEU NICHO <ArrowDown size={12} /></a><span>DESIGN COM IDENTIDADE / DESENVOLVIMENTO SOB MEDIDA</span></div>
    </div>
  </section>;
}
