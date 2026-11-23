/**
 * Cerne Implantes (docs/PROJETOS-ESTATICOS.md): reabilitação oral for people of 50+, a static site (no scroll scene).
 * Written as the brand's own site, with no professional name, registration, numbers, testimonials, prices, deadlines
 * or promise of outcome. Clinical statements stay general and always point back to the evaluation.
 */
export const before = [
  { title: "Avaliação completa", text: "Exame da boca, conversa sobre o que você sente e tomografia quando ela é necessária para planejar." },
  { title: "Plano por escrito", text: "Você leva para casa o plano e o orçamento de cada etapa, para ler com calma e conversar com a família." },
  { title: "No seu tempo", text: "Nenhuma decisão precisa ser tomada no dia. As dúvidas podem voltar quantas vezes forem precisas." },
];

/** "Isso acontece com você?": each sign lights up the treatment that usually answers it (to be confirmed in the evaluation). */
export const signs = [
  { id: "solta", sign: "A prótese solta quando você come.", answer: "Prótese fixa sobre implantes", text: "Os dentes ficam presos aos implantes e não saem da boca para limpar. A avaliação mostra se é o seu caso e quantos implantes o plano pede." },
  { id: "comida", sign: "Você deixou de comer o que gosta.", answer: "Implantes, um ou vários", text: "O implante devolve um apoio firme para morder. O plano começa pelo que você quer voltar a comer." },
  { id: "sorriso", sign: "Você cobre a boca para sorrir.", answer: "Implante com coroa de cerâmica", text: "No lugar do dente que falta, uma coroa com cor e forma pensadas para combinar com os seus dentes." },
  { id: "tempo", sign: "Falta um dente há muito tempo.", answer: "Implante, às vezes com enxerto antes", text: "Com o tempo, o osso pode diminuir onde o dente faltava. A tomografia mostra se é preciso reconstruir a base antes." },
  { id: "gengiva", sign: "A prótese machuca a gengiva.", answer: "Troca da removível pela fixa", text: "Para quem usa dentadura ou ponte móvel e quer passar para dentes fixos. O plano diz se é possível e por qual caminho." },
];

/** The menu (composição-assinatura): each treatment says what it gives back. */
export const treatments = [
  { name: "Implante unitário", gives: "Um dente que não se mexe", text: "Um pino de titânio no osso e uma coroa de cerâmica por cima, no lugar de um dente perdido." },
  { name: "Prótese fixa sobre implantes", gives: "Morder sem medo", text: "Uma arcada inteira presa a implantes. Não sai para limpar e não depende de cola para ficar no lugar." },
  { name: "Troca da prótese removível", gives: "Sorrir sem cobrir a boca", text: "Para quem usa dentadura ou ponte móvel. A avaliação mostra se dá para passar para dentes fixos." },
  { name: "Enxerto ósseo", gives: "Base para o implante", text: "Quando o osso diminuiu, o enxerto reconstrói o apoio antes do implante. Nem todo caso precisa." },
];

export const steps = [
  { title: "Avaliação e tomografia", text: "O dentista examina, ouve o que incomoda e pede a tomografia quando ela é necessária para planejar." },
  { title: "Planejamento", text: "Com os exames, o plano mostra quantos implantes, onde e em que ordem, com o orçamento de cada etapa." },
  { title: "Cirurgia", text: "Os implantes são colocados com anestesia local. Em muitos casos, você sai com uma prótese provisória." },
  { title: "Prótese definitiva", text: "Depois da cicatrização, que varia de pessoa para pessoa, os dentes definitivos são feitos e ajustados." },
];

export const team = [
  { role: "Dentista", text: "Faz a avaliação, explica o plano com o modelo na mão e conduz a cirurgia." },
  { role: "Auxiliar", text: "Acompanha cada consulta e cuida do conforto durante os procedimentos." },
  { role: "Recepção", text: "Organiza os horários e tira as dúvidas sobre as etapas e o orçamento." },
];

export const faq = [
  { q: "Dói?", a: "A cirurgia é feita com anestesia local. Depois, é comum sentir algum incômodo por alguns dias, e o dentista explica antes como cuidar e o que tomar." },
  { q: "Tenho idade para implante?", a: "A idade, sozinha, não impede. O que conta é a saúde geral e a do osso, que a avaliação e a tomografia mostram." },
  { q: "Quanto tempo leva?", a: "Depende de quantos implantes, de precisar ou não de enxerto e da cicatrização de cada pessoa. O plano mostra as etapas do seu caso." },
  { q: "Quanto custa?", a: "Depende do plano: quantos implantes, que prótese e se há enxerto. Você recebe o orçamento de cada etapa por escrito, depois da avaliação." },
  { q: "E se eu tiver pouco osso?", a: "Em muitos casos, um enxerto reconstrói a base antes do implante. A tomografia mostra se é preciso." },
  { q: "Fico sem dentes durante o tratamento?", a: "Na maioria dos casos, não: uma prótese provisória cobre o período de cicatrização. A avaliação diz como fica no seu caso." },
];
