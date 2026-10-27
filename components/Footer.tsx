import { navigation, siteConfig } from "@/lib/site";
import { Brand } from "./ui/shared";
import { Arrow, WhatsAppIcon } from "./ui/icons";
export function Footer() {
  return (
    <footer className="site-footer shell">
      <div className="footer-main">
        <a href="#inicio" aria-label="Gabriel Batista Digital — início">
          <Brand />
        </a>
        <p>
          Pensamento estratégico.
          <br />
          Presença com personalidade.
        </p>
        <nav aria-label="Navegação do rodapé">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="footer-top" href="#inicio">
          DE VOLTA AO TOPO <Arrow size={15} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Gabriel Batista Digital</span>
        <span>FEITO COM INTENÇÃO. ESCRITO EM CÓDIGO.</span>
        <span>
          BRASIL <span className="accent">↗</span> MUNDO
        </span>
      </div>
      <a
        className="floating-whatsapp"
        href={siteConfig.contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com Gabriel Batista Digital pelo WhatsApp"
      >
        <WhatsAppIcon size={21} />
        <span>Vamos conversar</span>
        <Arrow size={13} />
      </a>
    </footer>
  );
}
