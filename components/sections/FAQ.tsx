import { SectionLabel } from "../ui/shared";
const questions = [
  ["O que preciso ter para começar?", "Um contexto do negócio, o objetivo do projeto e uma ideia de quem vai usar o site. Logo, textos e imagens ajudam, mas a organização do conteúdo pode fazer parte do escopo. A primeira conversa serve para identificar o que já existe e o que precisa ser produzido."],
  ["Vou conseguir atualizar o conteúdo?", "Isso precisa ser definido no início. Um painel de edição, CMS ou fluxo de publicação pode fazer parte da solução, conforme sua frequência de atualização e orçamento. A tecnologia é escolhida a partir desse uso; não presumimos que todo projeto precise da mesma estrutura."],
  ["Domínio, hospedagem e manutenção entram juntos?", "São itens distintos. A proposta deve esclarecer quem registra o domínio, qual ambiente hospeda a aplicação, quais custos são recorrentes e se haverá acompanhamento depois da entrega. Serviços externos e suas cobranças precisam ficar visíveis antes da publicação."],
  ["Um site novo garante resultado no Google?", "Não há garantia de posição ou volume de contatos. Estrutura técnica, conteúdo, concorrência, região e presença em outras plataformas influenciam as buscas. O trabalho de SEO começa por diagnóstico, prioridades e critérios de acompanhamento."],
  ["Como é definido o prazo e o investimento?", "Pelo escopo: quantidade de páginas, conteúdo disponível, interações, integrações e etapas de revisão. Um catálogo, uma landing page e uma aplicação com login têm necessidades diferentes. O diagnóstico evita comparar propostas que entregam coisas distintas."],
  ["Posso explorar os projetos antes de conversar?", "Sim. Você pode navegar pelos projetos selecionados e assistir aos filmes completos, como o da Aura, antes de conversar."],
];
export function FAQ() {
  return <section className="shell section agency-faq" id="duvidas" aria-labelledby="faq-title">
    <div><SectionLabel number="07">ANTES DO PRIMEIRO CONTATO</SectionLabel><h2 id="faq-title">Boas decisões<br /><span className="serif">começam com clareza.</span></h2><p>O que vale alinhar antes de transformar uma ideia em projeto.</p></div>
    <div className="faq-list">{questions.map(([q,a],i)=><details key={q}><summary><span>0{i+1}</span>{q}<i aria-hidden="true" /></summary><p>{a}</p></details>)}</div>
  </section>;
}
