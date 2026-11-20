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
