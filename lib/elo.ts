/**
 * Elo, medicina reprodutiva (docs/PROJETOS-ESTATICOS.md): the fourth static brand and the strictest in content.
 * No success rates, no promise of pregnancy, no "make your dream come true", no baby, bump or test pictures. The
 * evaluation defines the path, which can be simpler than IVF. Inclusive: couples of any make-up and people on their
 * own. No CRM/RQE, "specialist" title, numbers or testimonials.
 */
/** Who the patient talks to (persona authorized by the user, 23/11/2026): name and role only. */
export const doctor = { name: "Luísa Andrade", first: "Luísa", role: "médica" };

/** The path (composição-assinatura): five stops; touching one shows what happens there. */
export const stops = [
  { id: "conversa", title: "A primeira conversa", short: "Contar a sua história.", text: "Há quanto tempo vocês tentam, o que já foi feito, os exames que já existem e o que preocupa. Ninguém precisa chegar sabendo o que pedir." },
  { id: "exames", title: "Os exames", short: "Entender o que acontece.", text: "Exames para quem quer engravidar e, no caso de um casal, para os dois. Cada exame pedido tem um motivo, explicado antes." },
  { id: "diagnostico", title: "O diagnóstico", short: "Dar nome ao que está difícil.", text: "Com os resultados, a Luísa explica o que eles mostram e o que não mostram, em palavras claras, sem pressa." },
  { id: "caminhos", title: "As possibilidades", short: "Do mais simples ao mais complexo.", text: "Muitas vezes o caminho é mais simples do que se imagina. Quando é preciso mais, cada opção é explicada com o que envolve, antes de qualquer decisão." },
  { id: "acompanhamento", title: "O acompanhamento", short: "Ninguém fica sozinho no meio.", text: "Cada etapa tem retorno marcado e um canal para as dúvidas que aparecem entre uma consulta e outra." },
];

/** The possibilities, from the simplest; what each one is and for whom it is usually considered, with no rates. */
export const paths = [
  { name: "Acompanhamento do ciclo", text: "Entender a ovulação e o melhor momento, às vezes com ajustes simples. Costuma ser o primeiro passo." },
  { name: "Indução da ovulação", text: "Medicamentos que ajudam a ovulação acontecer de forma mais regular, com acompanhamento por ultrassom." },
  { name: "Inseminação", text: "Os espermatozoides são colocados no útero no momento da ovulação. Indicada em situações específicas." },
  { name: "Fertilização in vitro (FIV)", text: "Óvulos e espermatozoides se encontram no laboratório, e o embrião é transferido para o útero. Indicada quando os caminhos mais simples não são suficientes ou não são indicados." },
  { name: "Congelamento de óvulos", text: "Para quem quer adiar a gravidez e preservar a possibilidade de usar os próprios óvulos depois. Faz sentido conversar sobre ele mais cedo." },
];

export const steps = [
  { title: "Antes da consulta", text: "A recepção marca o horário e pede que você traga os exames que já tem, se tiver." },
  { title: "Na consulta", text: "A Luísa ouve a história de cada um, explica o que pode estar acontecendo e pede os exames que faltam." },
  { title: "Depois dos exames", text: "Uma nova conversa para entender os resultados e montar o plano, por escrito, com o que cada etapa envolve." },
  { title: "O plano em andamento", text: "Cada etapa é acompanhada, com retorno marcado e espaço para as dúvidas." },
];

export const faq = [
  { q: "Quando procurar ajuda?", a: "Uma referência comum é procurar depois de um ano tentando, ou de seis meses a partir dos 35 anos. Mas não é preciso esperar se algo já preocupa: uma conversa ajuda a entender o momento." },
  { q: "Os dois precisam fazer exames?", a: "No caso de um casal, sim, em geral os dois. A causa pode estar em qualquer um, ou nos dois, e saber isso muda o caminho." },
  { q: "A FIV é o único caminho?", a: "Não. Muitas vezes o caminho começa por algo mais simples. A FIV é uma das possibilidades, indicada quando faz sentido para o seu caso." },
  { q: "Posso começar sozinha?", a: "Sim. A consulta é para quem quer ter filhos, em casal ou sozinha, e o caminho é pensado para a sua situação." },
  { q: "Congelar óvulos: com que idade faz sentido?", a: "Depende da idade e de outros fatores, e a conversa costuma valer mais cedo do que se imagina. A Luísa explica o que considerar no seu caso." },
  { q: "Quanto custa?", a: "Depende do caminho indicado. O valor de cada etapa é apresentado por escrito depois da avaliação, antes de qualquer decisão." },
];
