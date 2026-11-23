/**
 * Nítida, cirurgia refrativa (docs/PROJETOS-ESTATICOS.md): the second static brand. Stricter content care than the
 * others: never "never wear glasses again"; the promise is to reduce or end the dependence on glasses when the exams
 * allow it, and the page says plainly that not every eye can be operated. No guaranteed degree, percentages, exact
 * recovery times, CRM/RQE, numbers, testimonials or before/after.
 */
/** Who the patient talks to (persona authorized by the user, 23/11/2026): name and role only. */
export const doctor = { name: "Beatriz Sallum", first: "Beatriz", role: "oftalmologista" };

export const moments = [
  { title: "Ao acordar", text: "A mão procura o óculos na mesinha antes de você conseguir ver as horas." },
  { title: "No mar e na piscina", text: "Sem óculos, a borda some; com lente de contato, a água preocupa." },
  { title: "No fim do dia", text: "A lente de contato começa a incomodar justamente quando o dia ainda não acabou." },
  { title: "Na chuva e com máscara", text: "A lente embaça, molha e precisa ser limpa a toda hora." },
  { title: "No esporte", text: "Capacete, óculos de proteção, bola no rosto: o óculos sempre atrapalha um pouco." },
];

/** What the evaluation looks at before any indication (general description of common exams). */
export const exams = [
  { title: "O grau", text: "Medido com calma, e comparado com o dos últimos anos para saber se já está estável." },
  { title: "O mapa da córnea", text: "A topografia mostra o formato da córnea, ponto por ponto." },
  { title: "A espessura da córnea", text: "A paquimetria diz quanto de córnea existe para trabalhar com segurança." },
  { title: "O fundo do olho", text: "O exame completo do olho, porque a cirurgia só faz sentido num olho saudável." },
];

export const techniques = [
  { name: "PRK", text: "O laser corrige o grau na superfície da córnea. A recuperação costuma ser um pouco mais lenta, e a técnica preserva mais espessura." },
  { name: "LASIK", text: "O laser corrige o grau sob uma fina camada da córnea, que volta ao lugar. A visão costuma se recuperar mais rápido." },
  { name: "Implante de lente", text: "Uma lente é colocada dentro do olho, sem retirar o cristalino. Uma opção avaliada para graus altos ou córneas finas." },
];

export const steps = [
  { title: "Avaliação e exames", text: "A Beatriz ouve o que incomoda, examina e pede os exames que mostram se o olho é candidato." },
  { title: "Indicação", text: "Com os exames, ela explica se a cirurgia é indicada, qual técnica faz sentido e por quê." },
  { title: "Cirurgia", text: "Feita com anestesia em colírio. Os detalhes do dia e dos cuidados são combinados antes." },
  { title: "Acompanhamento", text: "Retornos para acompanhar a recuperação, que varia de pessoa para pessoa e de técnica para técnica." },
];

export const faq = [
  { q: "Dói?", a: "A cirurgia é feita com anestesia em colírio. Nos dias seguintes pode haver incômodo, ardência ou sensibilidade à luz, e a Beatriz explica antes como cuidar." },
  { q: "Posso operar com qualquer grau?", a: "Não. O grau precisa estar estável e dentro dos limites de cada técnica, e a córnea precisa ter a espessura e o formato adequados. Os exames dizem." },
  { q: "Quanto tempo para voltar à rotina?", a: "Depende da técnica e de cada pessoa. Na avaliação, a Beatriz explica o que esperar no seu caso." },
  { q: "O grau pode voltar?", a: "Pode haver mudança com o tempo, principalmente se o grau ainda não estava estável. Por isso a avaliação olha o histórico do grau antes de indicar." },
  { q: "Uso lente de contato. Posso fazer a avaliação?", a: "Sim. É comum pedir uma pausa no uso da lente antes de alguns exames, porque ela muda o formato da córnea. A clínica orienta quanto tempo." },
  { q: "Quanto custa?", a: "Depende da técnica indicada e dos exames. O valor é apresentado depois da avaliação, antes de qualquer decisão." },
];
