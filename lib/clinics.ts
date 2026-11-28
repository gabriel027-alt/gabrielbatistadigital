import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { FilmId } from "@/lib/project-films";
import { homeCopy } from "@/lib/i18n";
import type { DiagnosisCopy } from "@/components/DiagnosisQuiz";

/**
 * The landing page for clinics (/clinicas, 21/11/2026), built for campaigns: the homepage stays general, this page
 * speaks to one niche. Decisions (user, 21/11/2026): no price on the page (a range is given in the first conversation),
 * no delivery time and no reply-time promise until he defines them. Same rules as the homepage: no invented clients,
 * numbers, results, testimonials or claims about the councils' rules. The projects are the brands made for the
 * portfolio, shown as films.
 */
export const clinicsContact = buildWhatsAppUrl("Olá, Gabriel! Vi a página para clínicas e quero conversar sobre o site da minha clínica.");

/** Each card shows the top of its site (the hero), as the user asked (21/11/2026); the full film opens on click. */
export const clinicProjects: { id: FilmId; name: string; sector: string; image: string }[] = [
  { id: "lume", name: "Lume Psicologia", sector: "Psicologia", image: "/images/projects/brands/lume-hero.webp" },
  { id: "sutil", name: "Sutil Cirurgia Plástica", sector: "Cirurgia plástica", image: "/images/projects/brands/sutil-hero.webp" },
  { id: "forma", name: "Forma Odontologia", sector: "Odontologia estética", image: "/images/projects/brands/forma-hero.webp" },
  { id: "aura", name: "Aura", sector: "Harmonização facial", image: "/images/projects/aura-film-poster.webp" },
];

/**
 * The homepage diagnosis, for clinics (22/11/2026): the business is already known, so only the second question stays,
 * and the words speak of the clinic and the patient.
 */
const forClinics = (text: string) => text.replaceAll("o meu negócio", "a minha clínica").replaceAll("do seu negócio", "da sua clínica").replaceAll("o negócio que o cliente", "a clínica que o paciente").replaceAll("o cliente", "o paciente");
const home = homeCopy.pt.diagnosis;
export const clinicsDiagnosis: DiagnosisCopy = {
  ...home,
  intro: "Uma pergunta, e eu digo por onde eu começaria na sua clínica.",
  situations: home.situations.map(item => ({ ...item, label: forClinics(item.label), start: forClinics(item.start), why: forClinics(item.why), msg: forClinics(item.msg) })),
  greeting: "Olá, Gabriel! Vi a página para clínicas e respondi a pergunta do diagnóstico.",
  fallback: { lead: "Sob medida.", text: "Precisa de algo que não está aqui, como um painel, um CRM ou uma integração entre sistemas? Me conte o problema, e eu digo se e como posso resolver.", href: clinicsContact },
};

export const clinicsCopy = {
  eyebrow: "Sites para clínicas",
  title: "Um site que faz o paciente certo confiar na sua clínica antes da primeira consulta.",
  sub: "Com a identidade da sua clínica, não de um modelo pronto. Para estética, odontologia, cirurgia plástica, psicologia e outras especialidades.",
  talk: "Conversar sobre o site da minha clínica",
  talkShort: "Conversar sobre a minha clínica",
  projects: "Ver projetos de clínicas",
  who: "Eu sou Gabriel Batista. Desenho e programo cada site, e a conversa é direto comigo.",
  projectsTitle: "Clínicas, cada uma com a sua cara.",
  projectsNote: "Clique num projeto para ver o filme do site, do início ao fim.",
  whyTitle: "O que o site da sua clínica precisa fazer",
  why: [
    { title: "Passar confiança antes da consulta", text: "O paciente pesquisa antes de marcar. Um site com as suas fotos, as suas cores e o seu jeito de atender mostra a clínica que ele vai encontrar, e não uma página que parece a do concorrente." },
    { title: "Explicar cada tratamento", text: "O que é, para quem é, o que esperar e as dúvidas que mais aparecem, numa página que o paciente entende sem esforço." },
    { title: "Levar até a conversa", text: "Em cada parte da página fica claro o próximo passo, até o paciente chamar a clínica ou pedir um horário." },
  ],
  includedTitle: "O que entra no site",
  included: [
    { title: "Página da clínica", text: "Tratamentos, dúvidas frequentes e o caminho até o agendamento, no celular e no computador." },
    { title: "Identidade própria", text: "Cores tiradas das fotos da própria clínica e uma tipografia escolhida para a marca." },
    { title: "Movimento com sentido", text: "Uma cena própria mostra o espaço, o tratamento ou a recuperação, como nos projetos acima." },
    { title: "Feito e conferido por mim", text: "Eu desenho e programo o site e confiro cada página antes de ir ao ar." },
  ],
  afterTitle: "Outras formas de cuidar do digital da sua clínica",
  afterNote: "Cada serviço pode ser contratado separadamente. Frequência, aprovações, atendimento de mensagens e produção de fotos e vídeos são definidos na proposta. A verba de anúncios é separada da gestão.",
  after: [
    { title: "Google Meu Negócio & Maps", text: "O perfil da clínica completo e atualizado, com horários, fotos e caminho, para quem busca por perto." },
    { title: "Gestão de Instagram", text: "Planejamento, calendário editorial, criação de posts, legendas e publicação para apresentar a clínica e seus serviços com consistência." },
    { title: "Conteúdo & criativos", text: "Carrosséis, peças para anúncios, edição de vídeos e materiais de divulgação com a linguagem da clínica, em demandas pontuais ou acompanhamento mensal." },
    { title: "Campanhas no Google & Instagram", text: "Configuração e acompanhamento de anúncios, com objetivo, criativos e página de destino definidos conforme o serviço contratado." },
    { title: "Automação no WhatsApp", text: "Uma primeira resposta automática tira as dúvidas mais comuns e encaminha o paciente até o agendamento." },
  ],
  stepsTitle: "Como funciona",
  steps: [
    { title: "Conversa", text: "Você conta como a clínica atende hoje, quem são os pacientes e o que o site precisa resolver." },
    { title: "Proposta", text: "Eu proponho as páginas, o conteúdo e o que mais faz sentido para a clínica, com o investimento de cada parte." },
    { title: "Design & programação", text: "Desenho a partir das fotos e da marca da clínica e programo o site. Você acompanha o andamento antes de ir ao ar." },
    { title: "No ar", text: "O site é publicado conferido no celular e no computador, pronto para receber os pacientes." },
  ],
  priceTitle: "Investimento",
  priceLead: "Um site de uma página começa em R$ 3.000. Cada clínica pede um site diferente, e o valor final depende de:",
  priceFactors: ["quantas páginas e tratamentos o site vai explicar;", "se terá uma cena animada própria, como nos projetos acima;", "fotos e textos: se a clínica já tem ou se é preciso organizar;", "o que vem depois do site, como Google, anúncios e WhatsApp."],
  priceClose: "Na primeira conversa, depois de entender a sua clínica, eu passo o valor por escrito, com cada parte separada.",
  priceCall: "Pedir o valor do site da minha clínica",
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "O site é feito a partir de um modelo?", a: "Não. Eu desenho a partir das fotos e da marca da sua clínica e programo o site. Por isso nenhum projeto se parece com o outro." },
    { q: "Funciona bem no celular?", a: "Sim. Cada página é conferida no celular e no computador antes de ir ao ar." },
    { q: "Eu acompanho o projeto?", a: "Sim. Você acompanha o andamento e vê o site antes de ele ir ao ar." },
    { q: "Quanto custa?", a: "A partir de R$ 3.000 por um site de uma página. O valor final depende das páginas, da cena animada, das fotos e textos e do que vem depois do site, e vem por escrito na proposta." },
    // Gabriel's own answers (22/11/2026): no deadline, material case by case, Vercel with an optional own domain, optional plan.
    { q: "Quanto tempo leva?", a: "Depende do tamanho do site e do material que já existe. O prazo é combinado na proposta, antes de começar." },
    { q: "Preciso ter fotos e textos prontos?", a: "Não necessariamente. Dá para usar as fotos que a clínica já tem ou produzir novas, e isso é combinado caso a caso. Os textos são escritos junto com você." },
    { q: "Onde o site fica hospedado? Posso usar o meu domínio?", a: "O site fica hospedado na Vercel. Ele pode usar o endereço da própria Vercel ou um domínio seu, como um .com.br registrado no Registro.br, se for o seu desejo. Eu faço a configuração." },
    { q: "E depois que o site vai ao ar?", a: "Para manutenção e ajustes depois da publicação, há um plano mensal opcional, combinado na proposta." },
    { q: "Posso contratar a gestão do Instagram sem fazer um site?", a: "Sim. Planejamento, calendário, posts, legendas e publicação podem ser contratados separadamente. Frequência, formatos, aprovações, respostas a mensagens e produção de fotos e vídeos são definidos na proposta." },
    { q: "Você também cuida do Google e dos anúncios?", a: "Sim, se fizer sentido para a clínica: perfil no Google Meu Negócio, campanhas no Google e no Instagram e uma primeira resposta automática no WhatsApp. Tudo entra na proposta, com o investimento de cada parte." },
  ],
  finalTitle: "Vamos conversar sobre a sua clínica.",
  finalText: "Conte como a clínica atende hoje e o que você precisa criar ou melhorar no digital.",
  finalCall: "Conversar no WhatsApp",
  finalNote: "Abre uma conversa no WhatsApp.",
  portfolio: "Ver o portfólio completo",
};
