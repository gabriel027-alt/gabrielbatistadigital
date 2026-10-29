"use client";
import { useEffect, useRef, useState } from "react";
import { navigation, siteConfig } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { Brand } from "./ui/shared";
import { Arrow } from "./ui/icons";
export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const media = window.matchMedia("(min-width: 901px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", close);
    media.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", close);
      media.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a
          href="#inicio"
          aria-label="Gabriel Batista Digital — início"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </a>
        <ThemeToggle />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-cta"
            href={siteConfig.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos conversar <Arrow size={15} />
          </a>
          <button
            ref={trigger}
            type="button"
            className="icon-button menu-trigger"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={open ? "menu-lines is-open" : "menu-lines"}>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
      <nav
        className="mobile-menu shell"
        id="mobile-menu"
        aria-label="Navegação móvel"
        hidden={!open}
      >
        {[...navigation, { label: "Contato", href: "#contato" }].map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
            <Arrow />
          </a>
        ))}
        <a
          href={siteConfig.contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          WhatsApp <Arrow />
        </a>
      </nav>
    </header>
  );
}
