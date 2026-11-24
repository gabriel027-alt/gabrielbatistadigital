/**
 * Eixo Ortopedia (docs/PROJETOS-ESTATICOS.md): the fifth static brand. Knee, hip and spine for people of 45 to 70 who
 * stopped doing something ordinary. Not every pain is surgery: treatment starts with the simplest step and surgery
 * comes when the assessment indicates it. No recovery times, success rates, X-rays, before/after, CRM/RQE, numbers or
 * testimonials. No doctor's name, by the user's decision (24/11/2026): the reception answers.
 */

/** What got hard: ordinary movements and what the assessment looks at. Never "you have…". */
export const moves = [
  { move: "Subir e descer escada", region: "Joelho e quadril", look: "A avaliação olha a dobra do joelho, a força das coxas e o alinhamento das pernas." },
  { move: "Levantar da cadeira", region: "Quadril, joelho e coluna", look: "A avaliação olha o apoio, a mobilidade do quadril e a força para sair do lugar." },
  { move: "Caminhar mais de meia hora", region: "Quadril, joelho e coluna", look: "A avaliação olha o jeito de pisar e em que ponto da caminhada o incômodo começa." },
  { move: "Dormir de lado", region: "Quadril e coluna", look: "A avaliação olha a lateral do quadril, a lombar e a posição em que a dor aparece." },
  { move: "Agachar", region: "Joelho", look: "A avaliação olha a dobra do joelho, a estabilidade e o que acontece no fim do movimento." },
  { move: "Voltar ao esporte", region: "Joelho, quadril e coluna", look: "A avaliação olha o gesto do seu esporte e o que o corpo aguenta hoje." },
];

/** The treatment staircase (composição-assinatura), from the simplest step; for whom each one usually is. */
export const stairs = [
  { name: "Orientação e fortalecimento", text: "Ajustes na rotina e exercícios orientados, muitas vezes com fisioterapia. É por onde quase todo tratamento começa." },
  { name: "Medicamentos", text: "Para aliviar a dor e a inflamação nas fases de crise, com prazo definido e acompanhamento." },
  { name: "Infiltração", text: "Medicamento aplicado na articulação, quando a dor não cede com os primeiros passos." },
  { name: "Artroscopia", text: "Cirurgia por pequenos cortes, com uma câmera, para tratar lesões dentro da articulação, quando indicada." },
  { name: "Prótese", text: "A troca da articulação desgastada, no joelho ou no quadril, quando o desgaste limita a rotina e os outros caminhos não bastam." },
];

/** The three areas; the axis lights the matching point. */
export const areas = [
  { id: "joelho", name: "Joelho", text: "Dor ao subir escada ou agachar, inchaço, sensação de que o joelho falseia, desgaste da cartilagem e lesões do esporte." },
  { id: "quadril", name: "Quadril", text: "Dor na virilha ou na lateral, rigidez para calçar o sapato, dificuldade para dormir de lado ou para caminhar mais longe." },
  { id: "coluna", name: "Coluna", text: "Dor lombar ou no pescoço, dor que desce pela perna, rigidez ao acordar e dificuldade para ficar muito tempo sentado." },
] as const;

export const steps = [
  { title: "Antes", text: "A recepção marca a avaliação e pede que você traga os exames de imagem que já tiver, se tiver." },
  { title: "Na avaliação", text: "O ortopedista pergunta o que mudou na sua rotina, examina o movimento e olha os exames que já existem." },
  { title: "O plano", text: "Você sai sabendo o que está acontecendo e qual é o primeiro degrau do tratamento, explicado antes de qualquer decisão." },
  { title: "O acompanhamento", text: "Cada etapa tem retorno marcado. Se a cirurgia for indicada, a reabilitação é planejada junto." },
];

export const faq = [
  { q: "Toda dor no joelho termina em cirurgia?", a: "Não. A maior parte dos tratamentos começa por orientação, fortalecimento e fisioterapia. A cirurgia entra quando a avaliação indica e os passos mais simples não bastam." },
  { q: "Quando a prótese é indicada?", a: "Quando o desgaste da articulação limita a rotina e os outros caminhos já não aliviam. A decisão é tomada com você, depois da avaliação e dos exames." },
  { q: "Preciso levar exames?", a: "Se você já tiver radiografias ou ressonâncias, leve. Se não tiver, tudo bem: o ortopedista pede os que forem necessários." },
  { q: "Atende convênio ou reembolso?", a: "A recepção informa como funciona o atendimento pelo seu convênio ou pelo reembolso, antes de marcar." },
  { q: "Quanto tempo leva a recuperação?", a: "Depende do caso e do tratamento escolhido. O plano explica cada etapa antes de qualquer decisão, sem prometer prazos." },
  { q: "Posso continuar no esporte?", a: "Muitas vezes, sim, com ajustes. A avaliação considera o seu esporte e o que o corpo aguenta hoje." },
];
