/**
 * Vão Arquitetura e Interiores (docs/PROJETOS-ESTATICOS.md): the sixth static brand. Interiors and renovations for
 * people who want to live their own way; the project starts from the routine. No delivered works, clients, awards,
 * publications, CAU, real areas, deadlines or price per square metre. The rooms are the brand's illustrative project.
 */
/** Who answers: the architect, by role. The persona's name was removed on 24/11/2026 (the user's decision, before the
 *  brand sites go public), so no visitor takes it for a real professional. */
export const architect = { role: "arquiteta" };

/** The routine plan (composição-assinatura): one moment of the day in each room, and what the project solves there. */
export const rooms = [
  { id: "cozinha", moment: "O café das 7h", room: "Cozinha", text: "A ilha virada para a luz da manhã e tudo o que o café pede ao alcance da mão, sem atravessar a cozinha." },
  { id: "trabalho", moment: "O trabalho das 9h", room: "Escritório", text: "Um canto com porta, luz de lado e uma marcenaria que guarda o trabalho quando o dia acaba." },
  { id: "sala", moment: "Receber no sábado", room: "Sala", text: "Lugar para sentar sem arrastar cadeiras, e a cozinha aberta para quem cozinha não ficar de fora da conversa." },
  { id: "varanda", moment: "O fim de tarde", room: "Varanda", text: "A luz baixa entra até a sala, e a cortina de linho escolhe quanto." },
  { id: "banho", moment: "O banho das 19h", room: "Banheiro", text: "A bancada na altura de quem usa e uma luz que não ofusca no fim do dia." },
  { id: "quarto", moment: "A leitura das 22h", room: "Quarto", text: "Uma poltrona, a luminária no lugar exato e um armário que fecha sem barulho." },
];

/** The materials board: each sample and why it was chosen. */
export const materials = [
  { name: "Travertino", tone: "#c69f77", text: "No piso e na ilha. Aguenta o uso de todo dia e fica mais bonito com o tempo." },
  { name: "Freijó", tone: "#723806", text: "Nos painéis e na marcenaria. Uma madeira brasileira de veio calmo, que aquece a luz da tarde." },
  { name: "Linho cru", tone: "#ddd0bd", text: "Nas cortinas, no sofá e na cama. Filtra a luz e não pede cuidado especial." },
  { name: "Mostarda", tone: "#9d6420", text: "Uma única cor forte, numa poltrona. É o ponto para onde o olho vai." },
  { name: "Cal", tone: "#efe6d8", text: "Nas paredes. Um fundo mineral e fosco, que deixa a luz desenhar." },
];

export const steps = [
  { title: "A conversa", text: "Você conta como é o seu dia, o que funciona e o que atrapalha na casa de hoje. Ainda não se fala de acabamento." },
  { title: "A visita", text: "A arquiteta conhece o imóvel, mede o que precisa ser medido e observa a luz em cada ambiente." },
  { title: "O estudo", text: "A planta com a rotina desenhada e as primeiras imagens, para você ver a casa antes de decidir." },
  { title: "O projeto", text: "Os desenhos de execução, a marcenaria e a lista de materiais, prontos para orçar com quem vai construir." },
  { title: "A obra", text: "O acompanhamento das etapas combinadas, para o que foi desenhado ser o que fica pronto." },
];

export const faq = [
  { q: "Vocês fazem só um ambiente?", a: "Sim. O projeto pode ser da casa inteira, de uma reforma ou de um ou dois ambientes, como a cozinha e a sala." },
  { q: "Preciso já ter o imóvel?", a: "Não. Dá para começar com a planta do imóvel na planta, ou antes da compra, para entender o que cada opção permite." },
  { q: "O projeto inclui o acompanhamento da obra?", a: "Pode incluir. O que entra no acompanhamento é combinado na proposta, antes de começar." },
  { q: "Posso aproveitar os móveis que já tenho?", a: "Sim. Na visita, a arquiteta vê o que você quer manter, e o projeto parte disso." },
  { q: "Como é cobrado?", a: "Depende do tamanho e do escopo do projeto. A proposta vem por escrito depois da conversa e da visita, antes de qualquer decisão." },
  { q: "Vocês atendem fora da cidade?", a: "A conversa pode ser à distância. Para a visita e a obra, as condições são combinadas na proposta." },
];
