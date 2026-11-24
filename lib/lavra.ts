/**
 * Lavra Joalheria (docs/PROJETOS-ESTATICOS.md): the seventh static brand. Bespoke rings and family jewellery, made by
 * hand at the bench. No carats, certificates, gem laboratories, guarantees, prices, delivery times, clients or brand
 * names. Family gold is a conversation, never a promise. The atelier answers, by the user's decision (24/11/2026).
 */

/** What can be made. */
export const pieces = [
  { name: "Alianças", text: "O par desenhado junto, no perfil, na largura e no acabamento que cada mão pede." },
  { name: "Anel de noivado", text: "Uma peça única para o pedido, desenhada a partir de quem vai usar." },
  { name: "Joia de família", text: "Uma aliança antiga, um anel da avó, uma pedra guardada. Avaliamos com você o que dá para aproveitar." },
  { name: "Uma data", text: "Uma peça para marcar um nascimento, um aniversário ou um recomeço." },
];

/** From drawing to piece (composição-assinatura): what you see and decide at each stage. */
export const stages = [
  { id: "desenho", name: "A história e o desenho", photo: "desenho", position: "40% 50%", text: "Você conta para quem é a peça e o que ela precisa lembrar. O desenho nasce dessa conversa, a lápis, e você aprova antes de qualquer metal." },
  { id: "cera", name: "A cera", photo: "cera", position: "35% 70%", zoom: 1.9, text: "A peça é esculpida em cera, no tamanho exato. É o momento de ver o volume e ajustar o que for preciso." },
  { id: "fundicao", name: "A fundição", photo: "cera", position: "66% 70%", zoom: 1.9, text: "A cera dá lugar ao metal. O anel sai bruto, com as marcas do molde, e segue para a bancada." },
  { id: "acabamento", name: "O acabamento", photo: "bancada", position: "62% 50%", text: "Lima, lixa e polimento à mão, até a peça ficar como foi desenhada. Você prova antes do brilho final." },
];

export const faq = [
  { q: "Posso usar o ouro de uma joia antiga?", a: "Muitas vezes, sim. Na conversa, avaliamos a peça com você e explicamos o que dá para aproveitar e o que muda no desenho." },
  { q: "Posso trazer uma referência?", a: "Sim. Uma foto, um desenho ou uma joia que você goste ajudam a começar. O desenho final é feito para quem vai usar." },
  { q: "Vejo a peça antes de ficar pronta?", a: "Sim. Você aprova o desenho, vê a peça em cera e prova antes do acabamento final." },
  { q: "Fazem ajuste de tamanho depois?", a: "Sim. Na entrega, a peça é provada, e o ajuste é combinado no ateliê." },
  { q: "Quanto custa?", a: "Depende do metal, das pedras e do desenho. O valor vem por escrito depois da conversa, antes de começar." },
  { q: "Preciso ir ao ateliê?", a: "A primeira conversa pode ser à distância. Para medir e provar a peça, combinamos a melhor forma com você." },
];
