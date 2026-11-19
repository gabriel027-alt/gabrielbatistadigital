/**
 * Lume Psicologia (docs/NOVOS-PROJETOS-REGISTROS.md): direct-response register. Content only describes the work;
 * no name, CRP, numbers, testimonials or promise of cure (CFP code of ethics).
 */

/** The psychologist's name, by the user's decision (19/11/2026): a brand persona, never with a CRP number. */
export const psychologist = { name: "Helena Prado", first: "Helena", role: "Psicóloga clínica" };

/** The demands that weigh on the headline in the hero and fall away with the scroll. Positions are % of the title box. */
export const weights = [
  { text: "Dar conta de tudo", top: 4, left: 2, turn: -3 },
  { text: "Ser forte o tempo todo", top: 20, left: 44, turn: 2.5 },
  { text: "Não decepcionar ninguém", top: 40, left: 6, turn: -1.5 },
  { text: "Responder na hora", top: 58, left: 48, turn: 3 },
  { text: "Cuidar de todo mundo", top: 74, left: 14, turn: -2 },
  { text: "Não parar nunca", top: 2, left: 64, turn: -4 },
];

/** How therapy works, read along a week with one hour that is hers. Practice described, no promise of outcome. */
export const howItWorks = [
  { title: "A primeira conversa", text: "Você conta o que está pesando e tira as dúvidas sobre o processo. Ela serve para as duas decidirem se faz sentido seguir juntas." },
  { title: "Uma hora por semana", text: "As sessões costumam durar cerca de 50 minutos, no mesmo dia e horário, presencial ou online, como for melhor para a sua rotina." },
  { title: "O que você fala fica aqui", text: "O sigilo é um dever da psicóloga, previsto no Código de Ética Profissional do Psicólogo. Você escolhe o que e quando contar." },
  { title: "No seu ritmo", text: "Não existe prazo fixo. A frequência e os objetivos são conversados e revistos juntas ao longo do caminho." },
];
export const week = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export const faq = [
  { q: "Terapia online funciona do mesmo jeito?", a: "A escuta e o cuidado são os mesmos. Você só precisa de um lugar reservado, onde possa falar à vontade, e de uma conexão estável. Muitas mulheres preferem o online por caber melhor na rotina." },
  { q: "Como é a primeira conversa?", a: "É um encontro para você contar, do seu jeito, o que te trouxe até aqui e perguntar o que quiser sobre o processo. Não é preciso preparar nada nem saber dar nome ao que sente." },
  { q: "Preciso estar muito mal para começar?", a: "Não. Muita gente procura terapia porque quer entender o próprio cansaço, organizar a vida ou parar de se cobrar tanto. Você não precisa esperar chegar ao limite." },
  { q: "O que eu falar fica só entre nós?", a: "Sim. O sigilo é um dever profissional da psicóloga. As raras situações em que a lei e o Código de Ética preveem exceções são explicadas na primeira conversa." },
  { q: "Quanto tempo dura a terapia?", a: "Depende de cada pessoa e do que ela busca. O processo é revisto juntas de tempos em tempos, e você pode falar sobre isso sempre que quiser." },
];

/** "Talvez você esteja aqui porque…": the visitor marks what sounds like her. */
export const signs = [
  "Você vive cansada, mesmo depois de dormir.",
  "Sente culpa quando para ou faz algo só por você.",
  "A cabeça não desliga quando você deita.",
  "Diz sim quando queria dizer não.",
  "Chora sem conseguir explicar o motivo.",
  "Sente que se perdeu no meio de tantos papéis.",
];
