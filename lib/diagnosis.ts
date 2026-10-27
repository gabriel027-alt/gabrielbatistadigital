export const questions = [
  {
    title: "Qual é sua prioridade?",
    options: [
      "Apresentar minha marca",
      "Receber contatos para uma oferta",
      "Organizar processos",
      "Melhorar minha presença nas buscas",
    ],
  },
  {
    title: "Você já tem um site?",
    options: [
      "Ainda não",
      "Sim, mas precisa evoluir",
      "Sim, e quero uma nova solução",
    ],
  },
  {
    title: "Em que momento está o projeto?",
    options: [
      "Estou explorando possibilidades",
      "Quero planejar o próximo passo",
      "Tenho uma demanda definida",
    ],
  },
] as const;
export function getRecommendation(priority: number, existingSite: number) {
  if (priority === 3)
    return {
      title: "SEO Local",
      text: "Podemos começar entendendo como sua marca aparece nas buscas e quais informações precisam ganhar clareza.",
    };
  if (priority === 2)
    return {
      title: "Sistemas & Integrações",
      text: "O primeiro passo é mapear seu processo e descobrir onde uma solução sob medida pode reduzir atritos.",
    };
  if (priority === 1)
    return {
      title: "Landing Page",
      text: "Uma página focada em uma oferta pode organizar a mensagem e tornar o caminho até o contato mais claro.",
    };
  if (existingSite === 1)
    return {
      title: "Evolução da presença digital",
      text: "Vale começar por um diagnóstico da experiência atual para definir o que preservar e o que precisa evoluir.",
    };
  return {
    title: "Site Institucional",
    text: "Uma presença própria pode traduzir sua identidade e apresentar seu negócio com clareza em qualquer tela.",
  };
}
export function diagnosisMessage(answers: number[]) {
  return [
    "Olá, fiz o diagnóstico no site da Gabriel Batista Digital.",
    ...questions.map(
      (question, i) =>
        `${question.title} ${question.options[answers[i]] ?? "Não informado"}`,
    ),
    `Orientação inicial: ${getRecommendation(answers[0], answers[1]).title}.`,
    "Quero conversar sobre os próximos passos.",
  ].join("\n");
}
