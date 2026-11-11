import type { ModelIconName } from "@/components/ModelIcon";

/**
 * Almeida & Valença Advocacia (família e sucessões): content of the rebuilt legal model.
 * Fictitious firm. Informative tone without promises of results, as legal advertising requires; no OAB numbers, names or cases.
 */
export const doubts = [
  { title: "Qual o prazo para abrir o inventário?", text: "A lei prevê a abertura em até dois meses após o falecimento. O atraso pode gerar multa sobre o imposto, conforme as regras de cada estado." },
  { title: "Quais são os custos envolvidos?", text: "O imposto sobre a herança (ITCMD), as taxas do cartório ou as custas do processo, os registros dos bens e os honorários. Todos são explicados antes de começar." },
  { title: "E se a família não estiver de acordo?", text: "O papel da advogada é buscar um acordo que preserve a relação. Quando não é possível, o inventário segue pela via judicial, com cada etapa explicada." },
];

export const areas: { icon: ModelIconName; title: string; text: string }[] = [
  { icon: "scroll", title: "Inventário", text: "Em cartório, quando há acordo e a lei permite, ou pela via judicial. Do levantamento dos bens ao registro da partilha." },
  { icon: "shield", title: "Planejamento sucessório", text: "Doações, testamento e organização do patrimônio para que a sucessão aconteça como a família decidiu." },
  { icon: "handshake", title: "Partilha e acordos", text: "Negociação entre herdeiros e cônjuges, com propostas claras para dividir bens e responsabilidades." },
  { icon: "document", title: "Testamentos", text: "Orientação sobre os tipos de testamento, o que a lei permite dispor e como garantir que a vontade seja cumprida." },
];

export const values: { icon: ModelIconName; title: string; text: string }[] = [
  { icon: "eye", title: "Discrição", text: "Assuntos de família tratados com reserva, em atendimento individual." },
  { icon: "scale", title: "Transparência", text: "Custos, prazos e riscos explicados por escrito antes de qualquer decisão." },
  { icon: "people", title: "Acompanhamento", text: "Você sabe em que etapa o processo está, sem precisar perguntar." },
];

export const inventorySteps = [
  { title: "Primeira conversa", text: "Entendemos a situação da família e os bens envolvidos." },
  { title: "Documentos e bens", text: "Reunimos certidões, documentos pessoais e comprovantes de cada bem." },
  { title: "Escolha da via", text: "Cartório ou processo judicial, conforme o acordo entre os herdeiros e o que a lei permite." },
  { title: "Imposto e avaliação", text: "Cálculo e pagamento do ITCMD, com a avaliação dos bens." },
  { title: "Partilha e registro", text: "A divisão é formalizada e os bens passam para o nome dos herdeiros." },
];

export const faq = [
  { q: "Todo inventário precisa passar pela Justiça?", a: "Não. Quando os herdeiros estão de acordo e os requisitos legais são atendidos, ele pode ser feito em cartório, com advogado. Nos demais casos, segue pela via judicial." },
  { q: "É possível vender um bem antes de terminar o inventário?", a: "Em alguns casos, sim, com autorização. Cada situação precisa ser analisada antes, para evitar problemas no registro." },
  { q: "Planejar a sucessão em vida evita o inventário?", a: "Depende dos instrumentos escolhidos. O planejamento pode simplificar ou reduzir o que vai a inventário, mas a escolha deve considerar a família e os custos de cada caminho." },
  { q: "O atendimento pode ser online?", a: "Sim. A primeira conversa e o acompanhamento podem ser feitos por videochamada, com envio de documentos digitalizados." },
  { q: "Como são cobrados os honorários?", a: "Os honorários são apresentados por escrito depois da primeira conversa, de acordo com a complexidade do caso." },
];
