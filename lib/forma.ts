import type { ModelIconName as FormaIconName } from "@/components/ModelIcon";

/** Forma Odontologia: content of the rebuilt dental model. Fictitious brand; no numbers, registrations or results. */
export type Treatment = { id: string; name: string; icon: FormaIconName; summary: string; forWhom: string; path: string[]; questions: string[] };

export const features: { icon: FormaIconName; title: string; text: string }[] = [
  { icon: "person", title: "Atenção individual", text: "Cada plano parte do que você quer mudar." },
  { icon: "scan", title: "Planejamento digital", text: "Escaneamento e simulação antes de começar." },
  { icon: "document", title: "Orçamento por escrito", text: "Etapas e valores claros para decidir." },
  { icon: "chair", title: "Conforto no atendimento", text: "Um ambiente pensado para você ficar à vontade." },
  { icon: "calendar", title: "Acompanhamento", text: "Retornos e manutenção depois do tratamento." },
];

export const treatments: Treatment[] = [
  {
    id: "implantes", name: "Implantes", icon: "implant",
    summary: "Repõem a raiz do dente que falta. Sobre ela vai a coroa, que devolve a mastigação e o sorriso.",
    forWhom: "Para quem perdeu um ou mais dentes, usa uma prótese que incomoda ou vai precisar extrair um dente.",
    path: ["Avaliação com exame de imagem do osso.", "Planejamento da posição de cada implante.", "Instalação do implante, com anestesia local.", "Tempo de integração ao osso, com dente provisório quando possível.", "Coroa definitiva e consultas de manutenção."],
    questions: ["Tenho osso suficiente ou vou precisar de enxerto?", "Vou ficar sem dente durante o tratamento?", "Como cuido do implante depois?"],
  },
  {
    id: "lentes", name: "Lentes de contato dental", icon: "veneer",
    summary: "Lâminas finas de cerâmica coladas na frente dos dentes para mudar forma, cor e proporção.",
    forWhom: "Para quem quer corrigir dentes pequenos, desgastados, manchados ou com espaços entre eles.",
    path: ["Avaliação, fotos e escaneamento.", "Planejamento digital do sorriso.", "Ensaio na boca para você ver o resultado antes.", "Preparo dos dentes, somente quando o caso pede.", "Cimentação e ajustes finais."],
    questions: ["Vou precisar desgastar meus dentes?", "Posso ver como vai ficar antes de decidir?", "O que pode encurtar a vida útil das lentes?"],
  },
  {
    id: "alinhadores", name: "Alinhadores", icon: "aligner",
    summary: "Placas transparentes, trocadas em sequência, que movimentam os dentes aos poucos.",
    forWhom: "Para quem quer alinhar os dentes sem aparelho fixo, muitas vezes antes de um tratamento estético.",
    path: ["Escaneamento digital da boca.", "Planejamento do movimento de cada dente.", "Trocas de placas, com consultas de acompanhamento.", "Contenção para manter o resultado."],
    questions: ["Meu caso pode ser tratado com alinhadores?", "Quantas horas por dia preciso usar?", "Como funciona a contenção no final?"],
  },
  {
    id: "clareamento", name: "Clareamento", icon: "sparkle",
    summary: "Deixa os dentes naturais mais claros, com acompanhamento para controlar a sensibilidade.",
    forWhom: "Para quem tem dentes saudáveis e quer um sorriso mais claro, sozinho ou antes de outros tratamentos.",
    path: ["Avaliação de cáries, sensibilidade e restaurações.", "Escolha entre consultório, caseiro ou os dois.", "Acompanhamento até a cor combinada."],
    questions: ["Vou sentir sensibilidade?", "Minhas restaurações também vão clarear?", "Quanto tempo o resultado costuma durar?"],
  },
];

/** The signature scene: how a smile is planned before treatment (general practice of digital smile design). */
export const planSteps = [
  { title: "Medir", text: "Fotos e escaneamento registram a proporção entre os dentes, os lábios e o rosto." },
  { title: "Desenhar", text: "Cada dente ganha um contorno, com largura e comprimento em proporção ao seu sorriso." },
  { title: "Ensaiar", text: "Antes de qualquer preparo, o desenho vai para a boca em um ensaio, para você ver e aprovar." },
];

export const firstVisit = [
  { title: "Conversa", text: "Você conta o que quer mudar e o que incomoda hoje." },
  { title: "Exame", text: "A dentista examina a boca e pede imagens quando necessário." },
  { title: "Alternativas", text: "Você vê as opções possíveis, com vantagens e limites de cada uma." },
  { title: "Plano por escrito", text: "Etapas, prazos estimados e orçamento, para decidir com calma." },
];

export const faq = [
  { q: "A avaliação já sai com orçamento?", a: "Sim. Depois do exame, você recebe o plano com as alternativas, as etapas e os valores por escrito." },
  { q: "Implante dói?", a: "O procedimento é feito com anestesia local. Um desconforto nos primeiros dias é comum e costuma ser controlado com a medicação indicada pela dentista." },
  { q: "Lentes estragam os dentes?", a: "Depende do caso. Algumas situações pedem pouco ou nenhum desgaste; outras precisam de preparo. Isso é avaliado e mostrado antes de qualquer decisão." },
  { q: "Posso combinar tratamentos?", a: "Sim. É comum alinhar os dentes antes das lentes, ou clarear antes de uma restauração. O plano mostra a ordem que faz sentido." },
  { q: "Como funciona o pagamento?", a: "As formas de pagamento são apresentadas junto com o orçamento, na avaliação." },
];
