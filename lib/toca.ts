/**
 * Toca Hospital Veterinário: content of the model. Every text that depends on the animal has a dog and a cat version;
 * the Cão / Gato switch shows one of them. No registration numbers, testimonials, case counts or 24-hour claims.
 */
export type Species = "cao" | "gato";

export const heroText: Record<Species, string> = {
  cao: "Consulta, exames, cirurgia e internação, com tempo para o seu cão se sentir seguro antes de qualquer procedimento.",
  gato: "Espera longe dos cães e manejo calmo para o seu gato, da consulta à internação.",
};

export const features = [
  { icon: "heart", title: "Manejo calmo", text: "Contenção suave e tempo para o animal se acalmar." },
  { icon: "home", title: "Espera separada", text: "Os gatos aguardam longe dos cães." },
  { icon: "document", title: "Plano explicado", text: "Exames e custos apresentados antes de começar." },
  { icon: "scan", title: "Exames no hospital", text: "Ultrassom e imagem aqui mesmo, quando indicados." },
  { icon: "calendar", title: "Retornos marcados", text: "Acompanhamento depois de cirurgias e internações." },
] as const;

export const specialties = [
  { id: "clinica", name: "Clínica e prevenção", text: "Consultas de rotina, vacinas, check-ups e o acompanhamento de doenças crônicas." },
  { id: "cirurgia", name: "Cirurgia", text: "Castração, cirurgias de tecidos moles e ortopedia, com exames antes e retornos depois." },
  { id: "imagem", name: "Exames de imagem", text: "Ultrassom e raio-x para chegar ao diagnóstico sem trocar de lugar." },
  { id: "internacao", name: "Internação", text: "Baias separadas para cães e gatos, com a equipe por perto e boletins para o tutor." },
  { id: "odontologia", name: "Odontologia", text: "Limpeza, extrações e o cuidado com a boca, que costuma ficar esquecido." },
] as const;

export const lifeStages: Record<Species, { title: string; text: string }[]> = {
  cao: [
    { title: "Filhote", text: "Vacinas, vermifugação e a primeira conversa sobre alimentação e castração." },
    { title: "Adulto", text: "Consultas de rotina, dentes, peso e exames conforme a avaliação." },
    { title: "Idoso", text: "Acompanhamento mais frequente de articulações, coração, rins e visão." },
  ],
  gato: [
    { title: "Filhote", text: "Vacinas, vermifugação, castração e o costume com a caixa de transporte." },
    { title: "Adulto", text: "Peso, dentes e hidratação, em consultas num ambiente calmo." },
    { title: "Idoso", text: "Atenção a rins, tireoide e mobilidade, com visitas mais frequentes." },
  ],
};

export const firstVisit = [
  { title: "Chegar", text: "Cães e gatos esperam em áreas separadas." },
  { title: "Conhecer", text: "A veterinária ouve a história do animal e a sua." },
  { title: "Examinar", text: "No chão, na mesa baixa ou no colo, onde ele ficar mais tranquilo." },
  { title: "Explicar", text: "Você sai com o plano, os exames indicados e os valores." },
] as const;

export const faq = [
  { q: "Preciso agendar ou posso ir direto?", a: "As consultas são agendadas. Numa urgência, fale com a equipe antes de sair de casa para receber orientação sobre a chegada." },
  { q: "Como levo o meu gato com menos estresse?", a: "Deixe a caixa de transporte aberta em casa alguns dias antes, cubra-a com uma manta no caminho e avise na chegada: ele aguarda na área separada." },
  { q: "Os exames são feitos no mesmo dia?", a: "Quando indicados e possíveis, sim. O plano explica cada exame antes de ser feito." },
  { q: "Posso visitar o meu animal internado?", a: "As visitas são combinadas com a equipe, conforme o estado de saúde do animal." },
  { q: "Como sei quanto vai custar?", a: "Consulta, exames e procedimentos aparecem no plano, antes de começar, para você decidir." },
] as const;

export const rooms = [
  { id: "recepcao", number: "01", name: "Recepção", image: "recepcao", alt: "Recepção com bancos de madeira, caminha mostarda e prateleiras para caixas de transporte",
    text: { cao: "Bancos de madeira, uma caminha e espaço para chegar sem pressa.", gato: "Prateleiras altas para as caixas de transporte, do lado oposto ao dos cães." } },
  { id: "exames", number: "02", name: "Exames", image: "exames", alt: "Cão deitado num tapete macio sobre a mesa baixa, ao lado do aparelho de ultrassom",
    text: { cao: "Ultrassom e exames num tapete macio, numa mesa baixa.", gato: "Exames com contenção suave e o mínimo de barulho." } },
  { id: "internacao", number: "03", name: "Internação", image: "internacao", alt: "Gato descansando sobre uma manta numa baia de madeira e vidro",
    text: { cao: "Baias de madeira e vidro, com a equipe por perto.", gato: "Baias silenciosas, com mantas e a equipe por perto." } },
] as const;
