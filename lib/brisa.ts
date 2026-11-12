/**
 * Casa Brisa (hotel boutique): content of the rebuilt model.
 * The tour runs over MESTRE-COMPLETO (1121 source frames, every second frame published: 561).
 * Chapter ranges are in published frames (1..561).
 */
export const tourFrames = 561;

export const chapters = [
  { id: "chegada", from: 1, to: 187, title: "A chegada começa de longe.", text: "Entre a baía e o campo, uma casa branca de telhado de barro." , still: "chegada" },
  { id: "entrada", from: 188, to: 245, title: "A porta já está aberta.", text: "Luzes acesas, pedra fria nos pés, o ritmo começa a mudar.", still: "fachada" },
  { id: "recepcao", from: 246, to: 342, title: "Na recepção, sem pressa.", text: "Alguém espera por você com a chave e um copo d'água.", still: "recepcao" },
  { id: "suite", from: 343, to: 442, title: "Suítes que se abrem para a luz.", text: "Linho, madeira e uma janela inteira para o jardim.", still: "suite" },
  { id: "jardim", from: 443, to: 502, title: "O jardim entra pela janela.", text: "Oliveiras, palmeiras e o fim de tarde sobre o campo.", still: "janela" },
  { id: "casa", from: 503, to: 561, title: "Ficar mais um pouco.", text: "A piscina, a casa inteira e o sol se pondo atrás dos montes.", still: "casa" },
] as const;

export const stays = [
  { title: "Suíte Jardim", text: "Abre para as oliveiras e o gramado. Cama de casal, banheiro privativo e janela de madeira.", still: "suite" },
  { title: "Suíte Pátio", text: "Mais reservada, voltada para o pátio interno e a luz da manhã.", still: "janela" },
  { title: "Casa inteira", text: "Todas as suítes, a sala, a cozinha e a piscina só para o seu grupo.", still: "casa" },
] as const;

export const bookingSteps = [
  { title: "Escolha a estadia", text: "Suíte ou casa inteira, as datas e quantas pessoas vêm." },
  { title: "Confirmação", text: "A equipe confirma a disponibilidade e as condições antes de qualquer pagamento." },
  { title: "Chegada", text: "Você recebe as orientações de acesso e o horário de entrada." },
];

export const faq = [
  { q: "Quais são os horários de entrada e saída?", a: "Os horários são informados na confirmação da reserva. Quando há disponibilidade, a equipe ajusta a entrada ou a saída." },
  { q: "Posso reservar a casa inteira?", a: "Sim. A casa inteira inclui todas as suítes, as áreas comuns e a piscina só para o seu grupo." },
  { q: "O café da manhã está incluído?", a: "As condições de cada estadia, incluindo as refeições, aparecem antes da confirmação." },
  { q: "Como chego até a casa?", a: "Depois da reserva, você recebe o endereço e as orientações de acesso." },
];
