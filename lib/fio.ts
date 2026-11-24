/**
 * Fio, transplante capilar (docs/PROJETOS-ESTATICOS.md): the third static brand, for men of 28 to 50. Stricter content
 * care, as Nítida: no "hair back for good", density, graft counts, result times or before/after. The evaluation says
 * whether there is enough donor area and whether surgery is indicated; sometimes clinical treatment comes first or
 * instead. No CRM/RQE, "specialist" title, testimonials or numbers.
 */
/** Who the patient talks to (persona authorized by the user, 23/11/2026): name and role only. */
export const doctor = { name: "Daniel Arruda", first: "Daniel", role: "médico" };

/** The head seen from above (front at the top). Each zone lights up and says what is usually looked at there. */
export const zones = [
  { id: "entradas", label: "Entradas", short: "O recuo nas têmporas.", text: "A avaliação olha quanto as têmporas recuaram, se o recuo ainda avança e como desenhar uma linha que combine com o seu rosto e a sua idade.",
    path: "M70 62 C78 46 92 38 104 36 L104 62 C92 64 82 68 74 76 Z M190 62 C182 46 168 38 156 36 L156 62 C168 64 178 68 186 76 Z" },
  { id: "frontal", label: "Linha frontal", short: "A frente que subiu.", text: "É a moldura do rosto. A avaliação mede a altura atual da linha e a área doadora disponível antes de propor qualquer desenho.",
    path: "M104 36 C120 32 140 32 156 36 L156 62 C140 58 120 58 104 62 Z" },
  { id: "meio", label: "Meio", short: "O cabelo que afinou.", text: "Quando o cabelo afina no meio, nem sempre a resposta é cirurgia: muitas vezes o tratamento clínico vem antes, para estabilizar a queda.",
    path: "M74 76 C82 68 92 64 104 62 C120 58 140 58 156 62 C168 64 178 68 186 76 C192 100 192 128 186 150 L74 150 C68 128 68 100 74 76 Z" },
  { id: "coroa", label: "Coroa", short: "O topo de trás, que só aparece em foto.", text: "A coroa costuma avançar por mais tempo. A avaliação considera se a queda está estável e se a área doadora dá para a frente e para a coroa.",
    path: "M74 150 L186 150 C184 186 160 214 130 214 C100 214 76 186 74 150 Z" },
];

export const before = [
  { title: "A área doadora", text: "A nuca e as laterais têm fios suficientes para levar até onde falta? É ela que define o que dá para fazer." },
  { title: "A queda está estável?", text: "Se o cabelo ainda está caindo rápido, o transplante pode esperar enquanto um tratamento clínico segura a queda." },
  { title: "Há causa a tratar?", text: "Algumas quedas têm causa clínica. Quando é o caso, ela é tratada antes de pensar em cirurgia." },
];

export const steps = [
  { title: "Avaliação", text: "O Daniel examina o couro cabeludo e a área doadora, ouve o que incomoda e diz se o transplante é indicado agora." },
  { title: "Planejamento", text: "Quando é indicado, ele desenha com você a nova linha e explica a área que será tratada." },
  { title: "Procedimento", text: "Feito com anestesia local, pela técnica FUE: os fios são retirados um a um da área doadora e implantados onde faltam." },
  { title: "Acompanhamento", text: "Retornos para acompanhar a cicatrização e o crescimento, que acontece aos poucos e varia de pessoa para pessoa." },
];

export const after = [
  { title: "Os primeiros dias", text: "Orientações de lavagem, sono e o que evitar são entregues por escrito antes do procedimento." },
  { title: "O cabelo novo", text: "É comum os fios transplantados caírem antes de crescer de novo. O tempo de cada etapa é explicado na avaliação." },
  { title: "O tratamento junto", text: "Em muitos casos, o tratamento clínico continua depois, para proteger o cabelo que você já tem." },
];

export const faq = [
  { q: "Dói?", a: "O procedimento é feito com anestesia local. Depois, é comum um incômodo leve por alguns dias, e o Daniel explica antes como cuidar." },
  { q: "Fica natural?", a: "Depende do desenho da linha, da direção dos fios e da área doadora. Na avaliação, o Daniel explica o que dá para fazer no seu caso e o que não dá." },
  { q: "Quanto tempo até ver o resultado?", a: "O crescimento acontece aos poucos e varia de pessoa para pessoa. O tempo de cada etapa é explicado na avaliação." },
  { q: "Preciso raspar a cabeça?", a: "Depende da área e da técnica. Em muitos casos, raspa-se só a área doadora. Isso é combinado no planejamento." },
  { q: "Posso fazer se ainda estou perdendo cabelo?", a: "A avaliação olha se a queda está estável. Se não estiver, o caminho pode ser tratar primeiro e operar depois, ou nem operar." },
  { q: "Quanto custa?", a: "Depende da área a ser tratada. O valor é apresentado depois da avaliação, antes de qualquer decisão." },
];
