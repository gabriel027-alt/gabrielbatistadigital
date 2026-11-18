import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The homepage in three languages (17/11/2026): Portuguese at "/", English at "/en", Spanish at "/es". Each is a real
 * page with its own address, so campaigns abroad land straight in the visitor's language and search engines see every
 * version (hreflang). Nobody is redirected by browser language. Flags (Brazil, United States, Spain) are the user's
 * choice for the switcher. Same rules in every language: no invented clients, numbers, results, deadlines or prices.
 */
export const locales = ["pt", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const localeInfo: Record<Locale, { path: string; html: string; og: string; name: string }> = {
  pt: { path: "/", html: "pt-BR", og: "pt_BR", name: "Português" },
  en: { path: "/en", html: "en", og: "en_US", name: "English" },
  es: { path: "/es", html: "es", og: "es_ES", name: "Español" },
};
/** hreflang alternates shared by the three pages. */
export const languageAlternates = { "pt-BR": "/", en: "/en", es: "/es", "x-default": "/" };

type Item = { title: string; text: string };
export type HomeCopy = {
  metaTitle: string; metaDescription: string; ogImageAlt: string;
  skip: string; navLabel: string; nav: { work: string; services: string; about: string; talk: string }; talkCursor: string;
  langLabel: string; contactMessage: string;
  heroAlt: string; offer: { label: string; before: string; after: string; line2: string }; tagline: string;
  hook: { label: string; first: [string, string]; lead: string; click: [string, string]; clickLabel: string; tail: string; cursor: string };
  palmLabel: string; palmTitle: string; palmText: string;
  projects: string; workNote: string; specFont: string; specColors: string; sectors: Record<string, string>;
  servicesNote: string; servicesTitle: [string, string]; services: Item[];
  supportTitle: string; supportText: string; support: Item[];
  customLead: string; customText: string;
  stepsTitle: string; steps: Item[];
  aboutAlt: string; aboutTitle: [string, string]; aboutText: string; aboutIntro: [string, string]; aboutClaim: [string, string]; principles: string[]; aboutLink: string;
  contactTitle: [string, string]; contactText: string; contactGo: string; contactWhere: string;
  footerTalk: string; rights: string; backTop: string;
  motion: { pause: string; resume: string };
  media: { interface: string; watch: string; explore: string; watchFull: string; filmOf: string; close: string; noVideo: string; talkNote: string };
  avatarAlt: string;
};

const pt: HomeCopy = {
  metaTitle: "Gabriel Batista | Sites para clínicas e negócios de alto ticket",
  metaDescription: "Design e desenvolvimento de sites com marca própria para clínicas e negócios de alto ticket, do primeiro contato ao agendamento.",
  ogImageAlt: "Gabriel Batista: sites para clínicas e negócios de alto ticket",
  skip: "Pular para o conteúdo", navLabel: "Navegação do portfólio",
  nav: { work: "Projetos", services: "Serviços", about: "Sobre", talk: "Conversar" }, talkCursor: "Vamos conversar",
  langLabel: "Idioma", contactMessage: "Olá, Gabriel! Vi seu portfólio e quero conversar sobre um site para a minha clínica.",
  heroAlt: "Retrato frontal de Gabriel Batista com luz vermelha",
  offer: { label: "Design & desenvolvimento web", before: "Des", after: "gn &", line2: "desenvolvimento web" },
  tagline: "Sites para clínicas e negócios de alto ticket",
  hook: { label: "Do primeiro olhar ao próximo clique, e dele até a sua agenda.", first: ["Do pr", "meiro olhar"], lead: "ao próximo ", click: ["cl", "que"], clickLabel: "clique", tail: "e dele até a sua agenda.", cursor: "Começar um projeto" },
  palmLabel: "A mão aberta de Gabriel, com a palma para cima, segura o ponto vermelho da marca.",
  palmTitle: "Feito à mão, do primeiro traço ao último clique.", palmText: "Sem modelo pronto: cada site nasce da marca da sua clínica.",
  projects: "Projetos", workNote: "Clique num projeto para ver o filme.", specFont: "Fonte", specColors: "Cores medidas nas fotos",
  sectors: { forma: "Odontologia estética", sutil: "Cirurgia plástica", toca: "Hospital veterinário", brisa: "Hotel boutique", almeida: "Família e sucessões", aura: "Harmonização facial", orla: "Residências" },
  servicesNote: "O que eu construo", servicesTitle: ["Sua clínica tem um jeito próprio de atender.", "Vamos dar forma a ele."],
  services: [
    { title: "Sites & landing pages", text: "Os tratamentos, as dúvidas que mais aparecem e o caminho até o agendamento, numa página que o paciente entende sem esforço." },
    { title: "Identidade na interface", text: "Cores tiradas das suas próprias fotos e uma tipografia escolhida para a sua marca, para o site não parecer o do concorrente." },
    { title: "Movimento & interação", text: "A rolagem mostra o espaço, o tratamento ou a recuperação. Um roteiro curto prepara a primeira conversa." },
    { title: "Design & desenvolvimento", text: "Eu desenho e programo o site, e confiro cada página no celular e no computador." },
  ],
  supportTitle: "Depois do site", supportText: "Para a clínica ser encontrada e o paciente chegar até a agenda.",
  support: [
    { title: "Google Meu Negócio & Maps", text: "Deixo o perfil da clínica completo e atualizado, com horários, fotos e caminho, para quem busca por perto." },
    { title: "Google Ads & Instagram", text: "Configuro e acompanho campanhas no Google e no Instagram que levam quem procura o tratamento até o site." },
    { title: "Automação no WhatsApp", text: "Uma primeira resposta automática tira as dúvidas mais comuns e encaminha o paciente até o agendamento." },
  ],
  customLead: "Sob medida.", customText: "Precisa de algo que não está aqui, como um painel com os números da clínica, um CRM ou uma integração entre sistemas? Me conte o problema, e eu digo se e como posso resolver.",
  stepsTitle: "Como funciona",
  steps: [
    { title: "Conversa", text: "Você conta como a clínica atende hoje, quem são os pacientes e o que o site precisa resolver." },
    { title: "Proposta", text: "Eu proponho as páginas, o conteúdo e o que mais faz sentido para a clínica, com o investimento de cada parte." },
    { title: "Design & programação", text: "Desenho a partir das fotos e da marca da clínica e programo o site. Você acompanha o andamento antes de ir ao ar." },
    { title: "No ar", text: "O site é publicado conferido no celular e no computador, pronto para receber os pacientes." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["Uma boa ideia", "precisa funcionar."], aboutText: "Inclusive no celular de quem procura a sua clínica.",
  aboutIntro: ["Sou Gabriel Batista.", "Eu mesmo desenho e programo o seu site."], aboutClaim: ["Quem desenha", "é quem programa."],
  principles: ["Entender o negócio antes de desenhar a página.", "Dar à marca uma linguagem própria.", "Deixar claro, em cada parte da página, o próximo passo do paciente.", "Conferir a experiência no navegador e no celular."],
  aboutLink: "Conversar sobre o meu site",
  contactTitle: ["O próximo site pode ser", "o da sua clínica."], contactText: "Conte como a sua clínica atende hoje e o que você quer que o site resolva.",
  contactGo: "Vamos conversar", contactWhere: "Abre uma conversa no WhatsApp",
  footerTalk: "Conversar pelo WhatsApp", rights: "© 2026 Gabriel Batista Digital. Todos os direitos reservados.", backTop: "Voltar ao início",
  motion: { pause: "Pausar movimento", resume: "Ativar movimento" },
  media: { interface: "Interface do projeto", watch: "Ver filme completo", explore: "Explorar projeto", watchFull: "Ver filme completo", filmOf: "Filme do projeto", close: "Fechar", noVideo: "Seu navegador não reproduz este vídeo.", talkNote: "Converse com Gabriel pelo WhatsApp." },
  avatarAlt: "Personagem de Gabriel atrás de um notebook, num escritório escuro com um quadro de estratégia: funil, fluxograma e gráfico de crescimento",
};

const en: HomeCopy = {
  metaTitle: "Gabriel Batista | Websites for clinics and premium practices",
  metaDescription: "Website design and development for dental practices, med spas, plastic surgery and other clinics: a brand of its own, from first contact to booking.",
  ogImageAlt: "Gabriel Batista: websites for clinics and premium practices",
  skip: "Skip to content", navLabel: "Portfolio navigation",
  nav: { work: "Projects", services: "Services", about: "About", talk: "Let's talk" }, talkCursor: "Let's talk",
  langLabel: "Language", contactMessage: "Hi Gabriel! I saw your portfolio and I'd like to talk about a website for my clinic.",
  heroAlt: "Front portrait of Gabriel Batista in red light",
  offer: { label: "Web design & development", before: "Web des", after: "gn &", line2: "development" },
  tagline: "Websites for clinics and premium practices",
  hook: { label: "From first glance to the next click, and from there to your calendar.", first: ["From f", "rst glance"], lead: "to the next ", click: ["cl", "ck"], clickLabel: "click", tail: "and from there to your calendar.", cursor: "Start a project" },
  palmLabel: "Gabriel's open hand, palm up, holding the brand's red dot.",
  palmTitle: "Handmade, from the first stroke to the last click.", palmText: "No ready-made template: every website is born from your clinic's brand.",
  projects: "Projects", workNote: "Click a project to watch its film. Brazilian brands: the sites are in Portuguese.", specFont: "Typeface", specColors: "Colors measured from the photos",
  sectors: { forma: "Cosmetic dentistry", sutil: "Plastic surgery", toca: "Veterinary hospital", brisa: "Boutique hotel", almeida: "Family and estate law", aura: "Facial aesthetics", orla: "Residences" },
  servicesNote: "What I build", servicesTitle: ["Your clinic has its own way of caring for patients.", "Let's give it shape."],
  services: [
    { title: "Websites & landing pages", text: "The treatments, the questions patients ask most and the path to booking, on a page they understand without effort." },
    { title: "Brand-led design", text: "Colors taken from your own photos and a typeface chosen for your brand, so the site doesn't look like a competitor's." },
    { title: "Motion & interaction", text: "Scrolling shows the space, the treatment or the recovery. A short guided flow prepares the first conversation." },
    { title: "Design & development", text: "I design and code the site myself, and check every page on phone and desktop." },
  ],
  supportTitle: "Beyond the website", supportText: "So the clinic gets found and patients make it to the calendar.",
  support: [
    { title: "Google Business Profile & Maps", text: "I keep the clinic's profile complete and up to date, with hours, photos and directions, for people searching nearby." },
    { title: "Google Ads & Instagram", text: "I set up and manage Google and Instagram campaigns that bring people looking for the treatment to the site." },
    { title: "WhatsApp automation", text: "An automatic first reply answers the most common questions and guides the patient to booking." },
  ],
  customLead: "Custom.", customText: "Need something that isn't listed here, like a dashboard with the clinic's numbers, a CRM or an integration between systems? Tell me the problem, and I'll tell you whether and how I can solve it.",
  stepsTitle: "How it works",
  steps: [
    { title: "Conversation", text: "You tell me how the clinic works today, who the patients are and what the website needs to solve." },
    { title: "Proposal", text: "I propose the pages, the content and whatever else makes sense for the clinic, with the investment for each part." },
    { title: "Design & code", text: "I design from the clinic's photos and brand and code the site. You follow the progress before it goes live." },
    { title: "Launch", text: "The site goes live checked on phone and desktop, ready to welcome patients." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["A good idea", "has to work."], aboutText: "Especially on the phone of someone looking for your clinic.",
  aboutIntro: ["I'm Gabriel Batista, based in Brazil.", "I design and code your website myself."], aboutClaim: ["The designer", "is the developer."],
  principles: ["Understand the business before designing the page.", "Give the brand a language of its own.", "Make the patient's next step clear in every part of the page.", "Check the experience in the browser and on the phone."],
  aboutLink: "Talk about my website",
  contactTitle: ["The next website could be", "your clinic's."], contactText: "Tell me how your clinic works today and what you want the website to solve.",
  contactGo: "Let's talk", contactWhere: "Opens a WhatsApp chat. I'm based in Brazil and reply in writing, in English.",
  footerTalk: "Talk on WhatsApp", rights: "© 2026 Gabriel Batista Digital. All rights reserved.", backTop: "Back to top",
  motion: { pause: "Pause motion", resume: "Turn motion on" },
  media: { interface: "Website of the project", watch: "Watch the full film", explore: "Explore project", watchFull: "Watch the full film", filmOf: "Film of the project", close: "Close", noVideo: "Your browser can't play this video.", talkNote: "Talk to Gabriel on WhatsApp." },
  avatarAlt: "Gabriel's character behind a laptop, in a dark office with a strategy board: funnel, flowchart and growth chart",
};

const es: HomeCopy = {
  metaTitle: "Gabriel Batista | Sitios web para clínicas y negocios premium",
  metaDescription: "Diseño y desarrollo web para clínicas dentales, estéticas, de cirugía plástica y otros negocios premium: marca propia, del primer contacto a la cita.",
  ogImageAlt: "Gabriel Batista: sitios web para clínicas y negocios premium",
  skip: "Saltar al contenido", navLabel: "Navegación del portafolio",
  nav: { work: "Proyectos", services: "Servicios", about: "Sobre mí", talk: "Hablemos" }, talkCursor: "Hablemos",
  langLabel: "Idioma", contactMessage: "¡Hola, Gabriel! Vi tu portafolio y quiero conversar sobre un sitio web para mi clínica.",
  heroAlt: "Retrato frontal de Gabriel Batista con luz roja",
  offer: { label: "Diseño & desarrollo web", before: "D", after: "seño &", line2: "desarrollo web" },
  tagline: "Sitios web para clínicas y negocios premium",
  hook: { label: "De la primera mirada al próximo clic, y de ahí a tu agenda.", first: ["De la pr", "mera mirada"], lead: "al próximo ", click: ["cl", "c"], clickLabel: "clic", tail: "y de ahí a tu agenda.", cursor: "Empezar un proyecto" },
  palmLabel: "La mano abierta de Gabriel, con la palma hacia arriba, sostiene el punto rojo de la marca.",
  palmTitle: "Hecho a mano, del primer trazo al último clic.", palmText: "Sin plantillas: cada sitio nace de la marca de tu clínica.",
  projects: "Proyectos", workNote: "Haz clic en un proyecto para ver su video. Marcas brasileñas: los sitios están en portugués.", specFont: "Tipografía", specColors: "Colores medidos en las fotos",
  sectors: { forma: "Odontología estética", sutil: "Cirugía plástica", toca: "Hospital veterinario", brisa: "Hotel boutique", almeida: "Familia y sucesiones", aura: "Armonización facial", orla: "Residencias" },
  servicesNote: "Lo que construyo", servicesTitle: ["Tu clínica tiene su propia forma de atender.", "Démosle forma."],
  services: [
    { title: "Sitios & landing pages", text: "Los tratamientos, las dudas más frecuentes y el camino hasta la cita, en una página que el paciente entiende sin esfuerzo." },
    { title: "Diseño con identidad propia", text: "Colores tomados de tus propias fotos y una tipografía elegida para tu marca, para que el sitio no parezca el de la competencia." },
    { title: "Movimiento & interacción", text: "El scroll muestra el espacio, el tratamiento o la recuperación. Un recorrido corto prepara la primera conversación." },
    { title: "Diseño & desarrollo", text: "Yo mismo diseño y programo el sitio, y reviso cada página en el celular y en la computadora." },
  ],
  supportTitle: "Después del sitio", supportText: "Para que encuentren la clínica y el paciente llegue a la agenda.",
  support: [
    { title: "Perfil de Empresa de Google & Maps", text: "Dejo el perfil de la clínica completo y actualizado, con horarios, fotos y cómo llegar, para quien busca cerca." },
    { title: "Google Ads & Instagram", text: "Configuro y sigo campañas en Google e Instagram que llevan a quien busca el tratamiento hasta el sitio." },
    { title: "Automatización en WhatsApp", text: "Una primera respuesta automática resuelve las dudas más comunes y lleva al paciente hasta la cita." },
  ],
  customLead: "A medida.", customText: "¿Necesitas algo que no está aquí, como un panel con los números de la clínica, un CRM o una integración entre sistemas? Cuéntame el problema y te digo si puedo resolverlo y cómo.",
  stepsTitle: "Cómo funciona",
  steps: [
    { title: "Conversación", text: "Me cuentas cómo atiende hoy la clínica, quiénes son los pacientes y qué tiene que resolver el sitio." },
    { title: "Propuesta", text: "Propongo las páginas, el contenido y lo que más tenga sentido para la clínica, con la inversión de cada parte." },
    { title: "Diseño & programación", text: "Diseño a partir de las fotos y la marca de la clínica y programo el sitio. Sigues el avance antes de publicarlo." },
    { title: "Lanzamiento", text: "El sitio se publica revisado en el celular y en la computadora, listo para recibir pacientes." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["Una buena idea", "tiene que funcionar."], aboutText: "También en el celular de quien busca tu clínica.",
  aboutIntro: ["Soy Gabriel Batista, desde Brasil.", "Yo mismo diseño y programo tu sitio."], aboutClaim: ["Quien diseña", "es quien programa."],
  principles: ["Entender el negocio antes de diseñar la página.", "Darle a la marca un lenguaje propio.", "Dejar claro, en cada parte de la página, el siguiente paso del paciente.", "Revisar la experiencia en el navegador y en el celular."],
  aboutLink: "Hablar sobre mi sitio",
  contactTitle: ["El próximo sitio puede ser", "el de tu clínica."], contactText: "Cuéntame cómo atiende hoy tu clínica y qué quieres que resuelva el sitio.",
  contactGo: "Hablemos", contactWhere: "Abre una conversación en WhatsApp. Estoy en Brasil y respondo por escrito, en español.",
  footerTalk: "Hablar por WhatsApp", rights: "© 2026 Gabriel Batista Digital. Todos los derechos reservados.", backTop: "Volver al inicio",
  motion: { pause: "Pausar movimiento", resume: "Activar movimiento" },
  media: { interface: "Interfaz del proyecto", watch: "Ver el video completo", explore: "Explorar proyecto", watchFull: "Ver el video completo", filmOf: "Video del proyecto", close: "Cerrar", noVideo: "Tu navegador no puede reproducir este video.", talkNote: "Habla con Gabriel por WhatsApp." },
  avatarAlt: "Personaje de Gabriel detrás de una laptop, en una oficina oscura con un pizarrón de estrategia: embudo, diagrama de flujo y gráfico de crecimiento",
};

export const homeCopy: Record<Locale, HomeCopy> = { pt, en, es };
export const contactUrl = (locale: Locale) => buildWhatsAppUrl(homeCopy[locale].contactMessage);
