import { Arrow, ArrowLeft } from "@/components/ui/icons";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nicheModels } from "@/lib/models";
import { ModelInteraction } from "@/components/ModelInteraction";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
export const dynamicParams = false;
export function generateStaticParams() { return nicheModels.map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = nicheModels.find(m => m.slug === slug);
  if (!model) return {};
  return { title: `${model.brand} — Modelo de ${model.niche}`, description: model.intro, robots: { index: false, follow: true }, alternates: { canonical: `/modelos/${slug}` }, openGraph: { title: model.brand, description: model.intro, url: `/modelos/${slug}` } };
}
export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const model = nicheModels.find(m => m.slug === slug);
  if (!model) notFound();
  return <div className={`niche-site niche-${model.style}`}>
    <a className="skip-link" href="#model-main">Pular para o conteúdo</a>
    <div className="model-notice"><Link href="/#modelos"><ArrowLeft size={12} /> Voltar à galeria</Link><span>MODELO AUTORAL · MARCA FICTÍCIA</span></div>
    <header className="model-header"><Link className="model-brand" href={`/modelos/${slug}`}>{model.brand}</Link><nav aria-label="Navegação da demonstração"><a href="#atuacao">{slug === "imoveis" ? "Seleção" : "Conheça"}</a><a href="#caminho">{slug === "psicologia" ? "Como funciona" : "Abordagem"}</a><a href="#interesse">Sobre este modelo <Arrow size={12} /></a></nav></header>
    <main id="model-main">
      <section className="model-hero"><Image className="model-hero-image" src={`/images/models/${slug}.webp`} alt={slug === "agro" ? "Trator em uma paisagem agrícola conceitual" : slug === "imoveis" ? "Residência costeira conceitual com jardim e piscina" : slug === "energia" ? "Painéis fotovoltaicos em cobertura industrial conceitual" : `Ambiente editorial conceitual para ${model.niche.toLowerCase()}`} width={1672} height={941} sizes="100vw" preload /><div className="model-hero-copy"><p className="model-kicker">{model.eyebrow}</p><h1>{model.headline}</h1><p>{model.intro}</p><a className="model-button" href="#atuacao">{model.action}<Arrow size={15} aria-hidden="true" /></a></div><span className="model-hero-caption">{slug === "imoveis" ? "ESTUDO DE RESIDÊNCIA / PAISAGEM COSTEIRA" : "DESIGN & DESENVOLVIMENTO / GABRIEL BATISTA DIGITAL"}</span></section>
      <section id="atuacao" className="model-services"><div className="model-section-intro"><p className="model-kicker">01 / {model.niche}</p><h2>{model.section}</h2><p>{model.context}</p></div><div className="model-service-grid">{model.services.map((service, i) => <article key={service.title}><span className="model-index">0{i + 1}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div></section>
      <section id="caminho" className="model-approach"><div><p className="model-kicker">02 / NOSSA ABORDAGEM</p><h2>{model.approach}</h2><p>{slug === "psicologia" ? "Uma relação de confiança não precisa começar com todas as respostas. Conhecer o processo também faz parte da escolha." : slug === "imoveis" ? "Além da imagem, uma escolha exige contexto, informação e uma visita atenta. O seu modo de viver orienta a conversa." : "Uma proposta consistente explica o caminho, os limites e as responsabilidades. Aqui, cada etapa tem um propósito."}</p></div><ol>{model.steps.map((step, i) => <li key={step}><span>0{i + 1}</span><p>{step}</p></li>)}</ol></section>
      <ModelInteraction model={model} />
      <section className="model-faq"><p className="model-kicker">ANTES DO PRÓXIMO PASSO</p><h2>Uma dúvida importante.</h2><details><summary>{model.question}</summary><p>{model.answer}</p></details><details><summary>Este é o site de uma empresa real?</summary><p>Não. Esta é uma demonstração de design e desenvolvimento da Gabriel Batista Digital. Marca, ambientes e ofertas são fictícios. Não há equipe profissional, registro, atendimento ou empreendimento anunciado por esta marca.</p></details></section>
      <section id="interesse" className="model-contact"><p className="model-kicker">GOSTOU DESTA DIREÇÃO?</p><h2>Uma presença assim.<br />Com a identidade do seu negócio.</h2><p>Converse com Gabriel sobre um projeto próprio para {model.niche.toLowerCase()}, com conteúdo, imagens e funcionalidades definidos para a sua operação.</p><a className="model-button" href={buildWhatsAppUrl(`Olá, Gabriel! Conheci o modelo ${model.brand}, para ${model.niche}, e quero conversar sobre um projeto para meu negócio.`)} target="_blank" rel="noopener noreferrer">Conversar com Gabriel <Arrow size={15} aria-hidden="true" /></a><p className="model-fine">Contato com o desenvolvedor do site, não com uma empresa deste nicho.</p></section>
    </main>
    <footer className="model-footer"><span>{model.brand} · ESTUDO CONCEITUAL</span><Link href="/#modelos">Gabriel Batista Digital <Arrow size={12} /></Link><span>Imagens geradas · Nenhum cliente real representado</span></footer>
  </div>;
}
