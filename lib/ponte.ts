/**
 * Ponte Escola Bilíngue (docs/PROJETOS-ESTATICOS.md): the eighth static brand. Children of 2 to 10 who live the day
 * in Portuguese and English. Strict care: never a child's face; no exam results, certifications, grades, numbers of
 * students, branded methods, parents' testimonials, fees or promise of fluency. The school office answers, by the
 * user's decision (24/11/2026).
 */

/**
 * The day (composição-assinatura): six moments, each with its square photo (crop point for the 3:2 originals) and
 * the sentence the child hears in Portuguese and in English.
 */
export const day = [
  { id: "chegada", photo: "chegada", position: "28% 70%", label: "A chegada", pt: "Bom dia! Pendura a mochila?", en: "Good morning! Can you hang up your backpack?", text: "A professora recebe cada criança na porta, nas duas línguas." },
  { id: "roda", photo: "roda", position: "50% 50%", label: "A roda", pt: "Vamos sentar em roda.", en: "Let's sit in a circle.", text: "A história do dia é lida em inglês, e as perguntas podem vir em português." },
  { id: "projeto", photo: "projeto", position: "50% 50%", label: "O projeto", pt: "O que você vai colar agora?", en: "What are you going to glue next?", text: "As palavras novas aparecem no meio do que a criança está fazendo." },
  { id: "horta", photo: "horta", position: "40% 50%", label: "A horta", pt: "Quanta água a alface precisa?", en: "How much water does the lettuce need?", text: "Ciência no pátio: plantar, regar e contar o que mudou." },
  { id: "lanche", photo: "lanche", position: "50% 50%", label: "O lanche", pt: "Qual fruta você quer?", en: "Which fruit would you like?", text: "À mesa, pedir, agradecer e escolher também são aula." },
  { id: "saida", photo: "saida", position: "50% 50%", label: "A saída", pt: "Até amanhã!", en: "See you tomorrow!", text: "No portão, a família ouve como foi o dia." },
];

/** What changes in the day at each age. */
export const ages = [
  { range: "2 a 3 anos", text: "O dia é feito de rotina, música e brincadeira. A criança ouve as duas línguas o tempo todo, sem cobrança de falar." },
  { range: "4 a 5 anos", text: "As histórias, os projetos e as primeiras palavras escritas. A criança começa a responder na língua em que foi perguntada." },
  { range: "6 a 10 anos", text: "A alfabetização em português e o inglês nas disciplinas: ciências, artes e projetos acontecem nas duas línguas." },
];

export const visit = [
  { title: "A conversa", text: "Antes de tudo, a secretaria pergunta a idade da criança e o que a família procura." },
  { title: "A escola", text: "Na visita, você conhece as salas, o pátio e a horta, e vê um pouco do dia acontecendo." },
  { title: "Os detalhes", text: "Horários, alimentação, adaptação e valores são apresentados na visita, por escrito." },
];

export const faq = [
  { q: "Meu filho não fala inglês. Pode começar?", a: "Pode. A maioria das crianças chega sem falar inglês. Elas começam ouvindo, no meio das brincadeiras, e respondem quando se sentem seguras." },
  { q: "Em casa só falamos português. Tem problema?", a: "Não. A escola não pede que a família fale inglês. Em casa, vale continuar conversando e lendo em português." },
  { q: "Como é a adaptação?", a: "Gradual, combinada com a família, com horários menores nos primeiros dias e a presença de alguém conhecido quando a criança precisa." },
  { q: "Qual é o horário? Tem período integral?", a: "Os horários e o período integral são apresentados na visita, de acordo com a idade da criança." },
  { q: "Quanto custa?", a: "Os valores são apresentados na visita, por escrito, com o que está incluído em cada opção." },
  { q: "Como é a alimentação?", a: "O lanche é servido na escola, com frutas e comida simples. Restrições e alergias são combinadas com a família antes de começar." },
];
