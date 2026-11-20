/** Pilot. Year, mileage and transmission are illustrative specifications explicitly authorized by the user. */
export const tourFrames = 223;
export const chapters = [
  { id: "farol", progress: 0, from: 1, to: 168, title: "O farol acende.", text: "A luz acompanha o contorno do farol.", still: 120 },
  { id: "lateral", progress: .55, from: 169, to: 208, title: "A roda. A lateral.", text: "O reflexo percorre a roda e a porta.", still: 195 },
  { id: "inteiro", progress: .82, from: 209, to: 223, title: "O desenho inteiro.", text: "O carro aparece por completo no estúdio.", still: 223 },
] as const;
export const cars = [
  { id: "suv-branco", name: "SUV Prata-claro", body: "SUV", year: "2023", km: "28.000 km", gear: "Automático" },
  { id: "sedan-verde", name: "Sedã Verde", body: "Sedã", year: "2022", km: "41.000 km", gear: "Automático" },
  { id: "cupe-prata", name: "Cupê Prata", body: "Cupê", year: "2023", km: "19.000 km", gear: "Automático" },
  { id: "picape-preta", name: "Picape Preta", body: "Picape", year: "2021", km: "52.000 km", gear: "Automático" },
  { id: "suv-azul", name: "SUV Azul-petróleo", body: "SUV", year: "2024", km: "16.000 km", gear: "Automático" },
  { id: "hatch-vinho", name: "Hatch Vinho", body: "Hatch", year: "2022", km: "34.000 km", gear: "Manual" },
];
export const bodies = ["Todos", "SUV", "Sedã", "Cupê", "Picape", "Hatch"];

export const reportItems = [
  { id: "pintura", title: "Pintura medida peça por peça", short: "Pintura", text: "A medição ajuda a identificar diferenças de espessura. O registro faz parte da leitura da carroceria.", photo: "pintura", alt: "Medidor de espessura encostado na pintura do carro" },
  { id: "quilometragem", title: "Quilometragem conferida", short: "Quilometragem", text: "A leitura do diagnóstico é confrontada com os registros disponíveis. A análise vai além do número no painel.", photo: "diagnostico", alt: "Tablet de diagnóstico com gráficos azuis, verdes e roxos" },
  { id: "revisoes", title: "Revisões documentadas", short: "Revisões", text: "O histórico de manutenção entra na ficha junto da inspeção do estado atual, dos pneus e da parte de baixo.", photo: "pneu", alt: "Profundímetro no sulco de um pneu durante a inspeção" },
  { id: "historico", title: "Sem passagem por leilão", short: "Histórico", text: "A consulta ao histórico integra a seleção. Carros com passagem por leilão ficam fora do estoque da Paddock.", photo: "por-baixo", alt: "Inspeção da suspensão com lanterna, com o carro no elevador" },
] as const;
export const checks = reportItems.map(item => item.title);
export const inspections = [
  { id: "pintura", title: "Pintura, peça por peça.", short: "Espessura da pintura", text: "O instrumento ajuda a identificar diferenças de espessura. A medição entra na leitura da carroceria, além da aparência do acabamento.", photo: "pintura", alt: "Medidor de espessura encostado na pintura do carro" },
  { id: "pneu", title: "O desgaste também conta.", short: "Pneus", text: "Os sulcos e o estado dos pneus fazem parte da inspeção da condição atual. O cuidado vai além do brilho da lataria.", photo: "pneu", alt: "Profundímetro no sulco de um pneu durante a inspeção" },
  { id: "baixo", title: "A parte que você não vê.", short: "Por baixo", text: "Com o carro no elevador, a inspeção olha a suspensão e os componentes inferiores. A lanterna mostra o que fica fora da primeira impressão.", photo: "por-baixo", alt: "Inspeção da suspensão com lanterna, com o carro no elevador" },
  { id: "diagnostico", title: "Além do número no painel.", short: "Diagnóstico", text: "A leitura do scanner é analisada junto dos registros de manutenção e das informações disponíveis sobre o carro.", photo: "diagnostico", alt: "Tablet de diagnóstico com gráficos azuis, verdes e roxos" },
] as const;
export const faq = [
  { q: "Posso ver o laudo antes de decidir?", a: "Sim. Abra a ficha do carro no estoque para conhecer os itens conferidos. Na conversa, peça os registros que sustentam cada verificação e esclareça o que ainda quiser entender." },
  { q: "O que faz um carro ficar fora do estoque?", a: "A inspeção e o histórico orientam a compra. Se o carro não passa nos critérios da Paddock, a loja recusa. A proposta é explicar a seleção antes da negociação." },
  { q: "Um laudo significa que o seminovo não terá desgaste?", a: "Não. Um seminovo tem uso e desgaste. A inspeção ajuda a compreender sua condição no momento da avaliação; não é promessa de ausência de manutenção futura." },
  { q: "Vocês avaliam meu usado para troca?", a: "Seu carro passa pelo mesmo roteiro de inspeção: pintura, diagnóstico, histórico e condição atual. A avaliação depende dessa leitura, antes de qualquer proposta." },
  { q: "Como consulto o preço e as condições?", a: "Escolha o carro e prepare a conversa pelo roteiro. A disponibilidade, o preço e as condições precisam ser confirmados antes de qualquer decisão. Preencher o roteiro não reserva o veículo." },
];
