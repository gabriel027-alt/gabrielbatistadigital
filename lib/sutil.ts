/**
 * Sutil Cirurgia Plástica: content of the model. Informative language only: no promised results,
 * no professional registration numbers, no testimonials, no before/after.
 */
export const recovery = [
  { day: 1, label: "Dia 1", title: "O dia da cirurgia", text: "Você vai para casa ou fica internada conforme o procedimento, sempre com acompanhante e orientações por escrito." },
  { day: 7, label: "Semana 1", title: "A fase de mais cuidado", text: "Repouso relativo, curativos e a primeira revisão com a equipe." },
  { day: 21, label: "Semanas 2 a 4", title: "De volta à rotina leve", text: "As atividades leves voltam aos poucos, com malha ou sutiã cirúrgico quando indicado." },
  { day: 45, label: "Primeiro mês", title: "Exercícios em etapas", text: "A cirurgiã libera os exercícios conforme a avaliação de cada retorno." },
  { day: 90, label: "Três meses", title: "Até a alta", text: "O inchaço continua a diminuir, e as revisões seguem até a alta." },
] as const;

export const features = [
  { icon: "person", title: "Consulta sem pressa", text: "Tempo para examinar e responder às suas perguntas." },
  { icon: "document", title: "Plano por escrito", text: "Etapas, cuidados e orçamento, para ler em casa." },
  { icon: "shield", title: "Exames antes da data", text: "A cirurgia só é marcada depois dos exames e da avaliação." },
  { icon: "calendar", title: "Retornos acompanhados", text: "Revisões marcadas até a alta." },
  { icon: "handshake", title: "Decisão no seu tempo", text: "Nenhuma cirurgia é marcada na primeira consulta." },
] as const;

export const surgeries = [
  { id: "mama", name: "Mama", summary: "Aumento, redução, levantamento ou troca de implantes, planejados conforme o seu corpo e o que você deseja.", forWhom: "Para quem quer mudar volume, forma ou posição das mamas.", path: ["Consulta e exame", "Exames pré-operatórios", "Escolha de técnica e tamanho junto com a cirurgiã", "Cirurgia e retornos"] },
  { id: "abdome", name: "Abdome", summary: "Abdominoplastia e correção da parede abdominal, procurada depois de gestações ou de grande perda de peso.", forWhom: "Para excesso de pele, flacidez ou afastamento da musculatura.", path: ["Avaliação da pele e da musculatura", "Exames e preparo", "Cirurgia", "Uso de cinta e retornos"] },
  { id: "contorno", name: "Contorno corporal", summary: "Lipoaspiração e técnicas de contorno para regiões que não respondem a dieta e exercício.", forWhom: "Para gordura localizada, com peso estável.", path: ["Avaliação das regiões", "Exames e preparo", "Cirurgia", "Malha, drenagem quando indicada e retornos"] },
  { id: "face", name: "Face", summary: "Cirurgias de pálpebras, face e pescoço, planejadas para manter a sua expressão.", forWhom: "Para excesso de pele nas pálpebras ou flacidez no rosto e no pescoço.", path: ["Conversa sobre o que incomoda", "Exame e exames pré-operatórios", "Cirurgia", "Cuidados com o inchaço e retornos"] },
] as const;

export const firstConsult = [
  { title: "Ouvir", text: "Você conta o que deseja mudar e por quê." },
  { title: "Examinar", text: "A cirurgiã examina e diz o que é possível e o que não é indicado." },
  { title: "Planejar", text: "Técnica, exames, recuperação e orçamento, por escrito." },
  { title: "Decidir", text: "Você leva o plano para casa e decide com calma." },
] as const;

export const faq = [
  { q: "A primeira consulta já define a cirurgia?", a: "Não. Na consulta, a cirurgiã avalia e explica as alternativas. A decisão é sua, depois de ler o plano com calma." },
  { q: "Quais exames são pedidos antes?", a: "Depende da cirurgia e da sua saúde. Os exames são pedidos na consulta e revisados antes de qualquer data ser marcada." },
  { q: "Onde a cirurgia é feita?", a: "Em hospital com estrutura para o procedimento, informado no plano por escrito." },
  { q: "Quando posso voltar ao trabalho e aos exercícios?", a: "Cada cirurgia tem o seu cronograma. A seção de recuperação mostra fases aproximadas, e o prazo do seu caso é explicado na consulta." },
  { q: "É possível parcelar?", a: "As formas de pagamento aparecem no orçamento entregue na consulta." },
] as const;

export const recoveryDays = 90;
/** Position of a day on the ruler (0..1), square-root scaled so the first weeks get room. */
export const rulerPosition = (day: number) => Math.sqrt((day - 1) / (recoveryDays - 1));
