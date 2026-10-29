import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import ThemeInitializer from "@/components/ThemeInitializer";
import { siteConfig } from "@/lib/site";
import "./globals.css";
import "./experience.css";
const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Gabriel Batista Digital — Estratégia, design e engenharia web",
    template: "%s | Gabriel Batista Digital",
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.domain,
    siteName: siteConfig.brand,
    title: siteConfig.brand,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brand,
    description: siteConfig.description,
  },
};
export const viewport: Viewport = {
  themeColor: "#111410",
  width: "device-width",
  initialScale: 1,
};
const themeBootstrap = `(function(){var t='dark';try{var s=localStorage.getItem('gbd-theme');t=s==='light'||s==='dark'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){try{t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){}}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#111410':'#f4f3ed'})()`;
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brand,
  url: siteConfig.domain,
  telephone: `+${siteConfig.whatsappNumber}`,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: `+${siteConfig.whatsappNumber}`,
    url: siteConfig.contactUrl,
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={manrope.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
