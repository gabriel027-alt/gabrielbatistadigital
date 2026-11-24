import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { DiagnosisCopy } from "@/components/DiagnosisQuiz";

/**
 * The homepage in three languages (17/11/2026): Portuguese at "/", English at "/en", Spanish at "/es". Each is a real
 * page with its own address, so campaigns abroad land straight in the visitor's language and search engines see every
 * version (hreflang). Nobody is redirected by browser language. Flags (Brazil, United States, Mexico) are the user's
 * choice for the switcher. The Spanish is Latin American (celular, computadora), the market chosen on 17/11/2026; it
 * stays "es" for search engines, so Spain still finds it. Same rules in every language: no invented clients, numbers, results, deadlines or prices.
 */
export const locales = ["pt", "pt-PT", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const localeInfo: Record<Locale, { path: string; html: string; og: string; name: string }> = {
  pt: { path: "/", html: "pt-BR", og: "pt_BR", name: "Português (Brasil)" },
  "pt-PT": { path: "/pt-pt", html: "pt-PT", og: "pt_PT", name: "Português (Portugal)" },
  en: { path: "/en", html: "en", og: "en_US", name: "English" },
  es: { path: "/es", html: "es", og: "es_LA", name: "Español" },
};
/** hreflang alternates shared by the three pages. */
export const languageAlternates = { "pt-BR": "/", "pt-PT": "/pt-pt", en: "/en", es: "/es", "x-default": "/" };

type Item = { title: string; text: string };
export type HomeCopy = {
  metaTitle: string; metaDescription: string; ogImageAlt: string;
  skip: string; navLabel: string; nav: { work: string; services: string; about: string; talk: string }; talkCursor: string;
  langLabel: string; contactMessage: string;
  heroAlt: string; offer: { label: string; before: string; after: string; line2: string }; tagline: string;
  /** Interaction hint under the offer (docs/DESIGN-SYSTEM.md, "dica de interação"): "role" on computers, "deslize" on phones. */
  scrollHint: { desktop: string; phone: string };
  /** Guide that comes back whenever the visitor stops (22/11/2026): down the page, or sideways over the phone project row. */
  scrollGuide: { desktop: string; phone: string; side: string };
  /** The call right after "Como funciona" (22/11/2026): step 01 is the conversation, so the button starts it. */
  stepsCta: { label: string; note: string };
  /** "Não sabe por onde começar?" (22/11/2026): two questions and where Gabriel would start; a suggestion, never a verdict. */
  diagnosis: Omit<DiagnosisCopy, "fallback">;
  /** Questions a business owner asks before writing (22/11/2026). Answers from Gabriel's own choices: no price, no
   *  deadline, photos and texts case by case, hosting on Vercel with an optional own domain, optional monthly plan. */
  faq: { title: string; items: { q: string; a: string }[] };
  /** Direction A (21/11/2026): the promise is the hero's title, with who it is for and two calls; the name is the signature. */
  hero: { title: string; sub: string; projects: string; talk: string; talkShort: string };
  hook: { label: string; first: [string, string]; lead: string; click: [string, string]; clickLabel: string; tail: string; cursor: string };
  palmLabel: string; palmTitle: string; palmText: string;
  projects: string; workProof: string; workNote: string; specFont: string; specColors: string; sectors: Record<string, string>;
  /** What each project does for the business (22/11/2026): written from what the site really shows, never a result. */
  benefits: Record<string, string>;
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
  metaTitle: "Gabriel Batista | Sites para clínicas, escritórios e negócios de alto ticket",
  metaDescription: "Design e desenvolvimento de sites com marca própria para clínicas, escritórios e negócios de alto ticket, do primeiro contato à conversa com o cliente.",
  ogImageAlt: "Gabriel Batista: sites para clínicas, escritórios e negócios de alto ticket",
  skip: "Pular para o conteúdo", navLabel: "Navegação do portfólio",
  nav: { work: "Projetos", services: "Serviços", about: "Sobre", talk: "Conversar" }, talkCursor: "Vamos conversar",
  langLabel: "Idioma", contactMessage: "Olá, Gabriel! Vi seu portfólio e quero conversar sobre um site para o meu negócio.",
  heroAlt: "Retrato frontal de Gabriel Batista com luz vermelha",
  offer: { label: "Design & desenvolvimento web", before: "Des", after: "gn &", line2: "desenvolvimento web" },
  tagline: "Sites com a identidade da sua marca, para negócios escolhidos pela confiança.",
  scrollHint: { desktop: "Role para ver como eu crio", phone: "Deslize para ver como eu crio" },
  scrollGuide: { desktop: "Role para continuar", phone: "Deslize para continuar", side: "Deslize para o lado" },
  stepsCta: { label: "Começar pela conversa", note: "Abre uma conversa no WhatsApp" },
  diagnosis: {"title":"Não sabe por onde começar?","intro":"Duas perguntas, e eu digo por onde eu começaria no seu caso.","stepOf":"{n} de {total}","q1":"Qual é o seu negócio?","businesses":[{"id":"clinica","label":"Clínica ou consultório","msg":"Tenho uma clínica ou consultório."},{"id":"advocacia","label":"Escritório de advocacia","msg":"Tenho um escritório de advocacia."},{"id":"outro","label":"Outro negócio","msg":"Tenho um negócio."}],"q2":"Como está hoje?","situations":[{"id":"sem-site","label":"Ainda não tenho site","start":"Um site com a identidade do seu negócio","why":"É a base: o lugar onde o cliente entende o que você faz e encontra o próximo passo. Google e anúncios vêm depois, levando gente até ele.","msg":"Ainda não tenho site."},{"id":"nao-parece","label":"Tenho site, mas ele não parece com o meu negócio","start":"Um site novo, a partir das suas fotos e da sua marca","why":"Quem pesquisa antes de chamar decide pela primeira impressão. O site novo mostra o negócio que o cliente vai encontrar.","msg":"Tenho site, mas ele não parece com o meu negócio."},{"id":"pouca-gente","label":"Tenho site, mas pouca gente chega até ele","start":"Google Meu Negócio e campanhas no Google e no Instagram","why":"Primeiro, o perfil completo para quem busca por perto; depois, campanhas que levam quem procura o seu serviço até o site. Na conversa eu olho o site atual também.","msg":"Tenho site, mas pouca gente chega até ele."},{"id":"mesmas-duvidas","label":"Recebo contatos, mas perco tempo com as mesmas dúvidas","start":"Automação no WhatsApp","why":"Uma primeira resposta automática tira as dúvidas mais comuns e encaminha o cliente para o próximo passo, e chega até você só o que precisa de você.","msg":"Recebo contatos, mas perco tempo com as mesmas dúvidas."},{"id":"outra","label":"É outra coisa: um painel, um CRM, uma integração","start":"Sob medida","why":"Me conte o problema, e eu digo se e como posso resolver.","msg":"Preciso de algo sob medida, como um painel, um CRM ou uma integração."}],"resultLabel":"Por onde eu começaria","confirm":"É uma sugestão: na conversa a gente confirma o que faz sentido para o seu caso.","talk":"Conversar sobre isso","note":"Abre uma conversa no WhatsApp, já com as suas respostas.","restart":"Refazer","back":"Voltar","greeting":"Olá, Gabriel! Respondi as duas perguntas do seu site.","closing":"Podemos conversar?"},
  faq: {"title":"Perguntas frequentes","items":[{"q":"Quanto custa um site?","a":"Depende do que o seu negócio precisa: quantas páginas, quais partes e se entram serviços como Google Meu Negócio, anúncios ou automação no WhatsApp. Na primeira conversa eu entendo o seu caso e passo uma faixa de investimento; a proposta detalha o valor de cada parte."},{"q":"Quanto tempo leva?","a":"Depende do tamanho do site e do material que já existe. O prazo é combinado na proposta, antes de começar."},{"q":"Preciso ter fotos e textos prontos?","a":"Não necessariamente. Dá para usar as fotos que você já tem ou produzir novas, e isso é combinado caso a caso. Os textos são escritos junto com você, a partir da conversa sobre o seu negócio."},{"q":"Onde o site fica hospedado? Posso usar o meu domínio?","a":"O site fica hospedado na Vercel. Ele pode usar o endereço da própria Vercel ou um domínio seu, como um .com.br registrado no Registro.br, se for o seu desejo. Eu faço a configuração."},{"q":"E depois que o site vai ao ar?","a":"Para manutenção e ajustes depois da publicação, há um plano mensal opcional, combinado na proposta."},{"q":"Funciona bem no celular?","a":"Sim. Cada página é desenhada e conferida no celular e no computador antes de ir ao ar."}]},
  hero: { title: "Sites com a identidade da sua marca.", sub: "Para clínicas, escritórios e negócios escolhidos pela confiança.", projects: "Ver projetos", talk: "Conversar no WhatsApp", talkShort: "Conversar" },
  hook: { label: "Do primeiro olhar ao próximo clique, e dele até a sua agenda.", first: ["Do pr", "meiro olhar"], lead: "ao próximo ", click: ["cl", "que"], clickLabel: "clique", tail: "e dele até a sua agenda.", cursor: "Começar um projeto" },
  palmLabel: "A mão aberta de Gabriel, com a palma para cima, segura o ponto vermelho da marca.",
  palmTitle: "Feito à mão, do primeiro traço ao último clique.", palmText: "Sem modelo pronto: cada site nasce da sua própria marca.",
  projects: "Projetos", workProof: "Nenhum se parece com o outro: cada marca tem as cores das próprias fotos.", workNote: "Clique num projeto para ver o filme.", specFont: "Fonte", specColors: "Cores medidas nas fotos",
  sectors: { fio: "Transplante capilar", nitida: "Cirurgia refrativa", cerne: "Implantes e reabilitação oral", talhao: "Advocacia do agro", paddock: "Seminovos com o laudo aberto", arrimo: "Advocacia previdenciária", lume: "Psicologia", forma: "Odontologia estética", sutil: "Cirurgia plástica", toca: "Hospital veterinário", brisa: "Hotel boutique", almeida: "Família e sucessões", aura: "Harmonização facial", orla: "Residências" },
  benefits: { fio: "Mostra num mapa da cabeça onde incomoda e diz com franqueza que nem todo caso é cirurgia.", nitida: "Mostra o que a avaliação examina e diz com clareza que nem todo olho pode operar.", cerne: "Fala do que o paciente quer voltar a comer, não do dente, e leva à avaliação sem pressa.", lume: "A paciente se reconhece na rotina mostrada antes de marcar a primeira conversa.", arrimo: "Mostra, passo a passo, o caminho de um pedido negado até uma nova análise.", paddock: "Abre o laudo de cada carro antes do preço, para a compra começar pela confiança.", talhao: "Cada talhão do mapa acende uma situação do produtor e leva à conversa certa.", sutil: "Mostra a recuperação dia a dia, para a paciente decidir com informação.", brisa: "Leva o hóspede da baía até a suíte pela rolagem, antes da reserva.", aura: "Explica o que muda e o que se preserva no rosto, antes da avaliação.", orla: "Organiza objetivo, investimento e prazo de quem procura um imóvel, antes da visita." },
  servicesNote: "O que eu construo para clínicas, escritórios e negócios de alto valor", servicesTitle: ["Cada negócio tem um jeito próprio de atender.", "Vamos dar forma a ele."],
  services: [
    { title: "Sites & landing pages", text: "O que você oferece, as dúvidas que mais aparecem e o caminho até a primeira conversa, numa página que o cliente entende sem esforço." },
    { title: "Identidade na interface", text: "Cores tiradas das suas próprias fotos e uma tipografia escolhida para a sua marca, para o site não parecer o do concorrente." },
    { title: "Movimento & interação", text: "A rolagem mostra o espaço, o processo ou o produto. Um roteiro curto prepara a primeira conversa." },
    { title: "Design & desenvolvimento", text: "Eu desenho e programo o site, e confiro cada página no celular e no computador." },
  ],
  supportTitle: "Depois do site", supportText: "Para o seu negócio ser encontrado e o cliente chegar até a agenda.",
  support: [
    { title: "Google Meu Negócio & Maps", text: "Deixo o perfil do negócio completo e atualizado, com horários, fotos e caminho, para quem busca por perto." },
    { title: "Google Ads & Instagram", text: "Configuro e acompanho campanhas no Google e no Instagram que levam quem procura o seu serviço até o site." },
    { title: "Automação no WhatsApp", text: "Uma primeira resposta automática tira as dúvidas mais comuns e encaminha o cliente até o agendamento." },
  ],
  customLead: "Sob medida.", customText: "Precisa de algo que não está aqui, como um painel com os números do negócio, um CRM ou uma integração entre sistemas? Me conte o problema, e eu digo se e como posso resolver.",
  stepsTitle: "Como funciona",
  steps: [
    { title: "Conversa", text: "Você conta como o seu negócio atende hoje, quem são os clientes e o que o site precisa resolver." },
    { title: "Proposta", text: "Eu proponho as páginas, o conteúdo e o que mais faz sentido para o seu negócio, com o investimento de cada parte." },
    { title: "Design & programação", text: "Desenho a partir das suas fotos e da sua marca e programo o site. Você acompanha o andamento antes de ir ao ar." },
    { title: "No ar", text: "O site é publicado conferido no celular e no computador, pronto para receber os clientes." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["Uma boa ideia", "precisa funcionar."], aboutText: "Inclusive no celular de quem está procurando por você.",
  aboutIntro: ["Sou Gabriel Batista.", "Eu mesmo desenho e programo, por isso nenhum site sai de um modelo."], aboutClaim: ["Quem desenha", "é quem programa."],
  principles: ["Entender o negócio antes de desenhar a página.", "Dar à marca uma linguagem própria.", "Deixar claro, em cada parte da página, o próximo passo do cliente.", "Conferir a experiência no navegador e no celular."],
  aboutLink: "Conversar sobre o meu site",
  contactTitle: ["O próximo site pode ser", "o do seu negócio."], contactText: "Conte como o seu negócio atende hoje e o que você quer que o site resolva.",
  contactGo: "Vamos conversar", contactWhere: "Abre uma conversa no WhatsApp",
  footerTalk: "Conversar pelo WhatsApp", rights: "© 2026 Gabriel Batista Digital. Todos os direitos reservados.", backTop: "Voltar ao início",
  motion: { pause: "Pausar movimento", resume: "Ativar movimento" },
  media: { interface: "Interface do projeto", watch: "Ver filme completo", explore: "Explorar projeto", watchFull: "Ver filme completo", filmOf: "Filme do projeto", close: "Fechar", noVideo: "Seu navegador não reproduz este vídeo.", talkNote: "Converse com Gabriel pelo WhatsApp." },
  avatarAlt: "Personagem de Gabriel atrás de um notebook, num escritório escuro com um quadro de estratégia: funil, fluxograma e gráfico de crescimento",
};

/**
 * European Portuguese (17/11/2026), for clinics in Portugal: formal address ("a sua clínica", "conte-me"), the words used
 * there (telemóvel, marcação, fotografias, portefólio, browser, "tem de"), "Perfil da Empresa no Google". Gabriel speaks
 * Portuguese, so here he says only that he works from Brazil, remotely.
 */
const ptPT: HomeCopy = {
  metaTitle: "Gabriel Batista | Sites para clínicas, escritórios e negócios premium",
  metaDescription: "Design e desenvolvimento de sites com marca própria para clínicas, escritórios de advogados e outros negócios premium, do primeiro contacto à conversa com o cliente.",
  ogImageAlt: "Gabriel Batista: sites para clínicas, escritórios e negócios premium",
  skip: "Saltar para o conteúdo", navLabel: "Navegação do portefólio",
  nav: { work: "Projetos", services: "Serviços", about: "Sobre", talk: "Conversar" }, talkCursor: "Vamos conversar",
  langLabel: "Idioma", contactMessage: "Olá, Gabriel! Vi o seu portefólio e gostava de falar sobre um site para o meu negócio.",
  heroAlt: "Retrato frontal de Gabriel Batista com luz vermelha",
  offer: { label: "Design & desenvolvimento web", before: "Des", after: "gn &", line2: "desenvolvimento web" },
  tagline: "Sites com a identidade da sua marca, para negócios escolhidos pela confiança.",
  scrollHint: { desktop: "Desça para ver como crio", phone: "Deslize para ver como crio" },
  scrollGuide: { desktop: "Desça para continuar", phone: "Deslize para continuar", side: "Deslize para o lado" },
  stepsCta: { label: "Começar pela conversa", note: "Abre uma conversa no WhatsApp" },
  diagnosis: {"title":"Não sabe por onde começar?","intro":"Duas perguntas, e eu digo-lhe por onde começaria no seu caso.","stepOf":"{n} de {total}","q1":"Qual é o seu negócio?","businesses":[{"id":"clinica","label":"Clínica ou consultório","msg":"Tenho uma clínica ou consultório."},{"id":"advocacia","label":"Escritório de advogados","msg":"Tenho um escritório de advogados."},{"id":"outro","label":"Outro negócio","msg":"Tenho um negócio."}],"q2":"Como está hoje?","situations":[{"id":"sem-site","label":"Ainda não tenho site","start":"Um site com a identidade do seu negócio","why":"É a base: o lugar onde o cliente percebe o que faz e encontra o próximo passo. O Google e os anúncios vêm depois, para levar pessoas até ele.","msg":"Ainda não tenho site."},{"id":"nao-parece","label":"Tenho site, mas não se parece com o meu negócio","start":"Um site novo, a partir das suas fotografias e da sua marca","why":"Quem pesquisa antes de contactar decide pela primeira impressão. O site novo mostra o negócio que o cliente vai encontrar.","msg":"Tenho site, mas não se parece com o meu negócio."},{"id":"pouca-gente","label":"Tenho site, mas pouca gente chega até ele","start":"Perfil da Empresa no Google e campanhas no Google e no Instagram","why":"Primeiro, o perfil completo para quem procura por perto; depois, campanhas que levam quem procura o seu serviço até ao site. Na conversa também olho para o site atual.","msg":"Tenho site, mas pouca gente chega até ele."},{"id":"mesmas-duvidas","label":"Recebo contactos, mas perco tempo com as mesmas dúvidas","start":"Automação no WhatsApp","why":"Uma primeira resposta automática esclarece as dúvidas mais comuns e encaminha o cliente para o próximo passo, e só lhe chega o que precisa mesmo de si.","msg":"Recebo contactos, mas perco tempo com as mesmas dúvidas."},{"id":"outra","label":"É outra coisa: um painel, um CRM, uma integração","start":"À medida","why":"Conte-me o problema e eu digo-lhe se e como o posso resolver.","msg":"Preciso de algo à medida, como um painel, um CRM ou uma integração."}],"resultLabel":"Por onde eu começaria","confirm":"É uma sugestão: na conversa confirmamos o que faz sentido para o seu caso.","talk":"Falar sobre isto","note":"Abre uma conversa no WhatsApp, já com as suas respostas.","restart":"Refazer","back":"Voltar","greeting":"Olá, Gabriel! Respondi às duas perguntas do seu site.","closing":"Podemos falar?"},
  faq: {"title":"Perguntas frequentes","items":[{"q":"Quanto custa um site?","a":"Depende do que o seu negócio precisa: quantas páginas, que partes e se entram serviços como o Perfil da Empresa no Google, anúncios ou automação no WhatsApp. Na primeira conversa percebo o seu caso e indico uma faixa de investimento; a proposta detalha o valor de cada parte."},{"q":"Quanto tempo demora?","a":"Depende da dimensão do site e do material que já existe. O prazo é combinado na proposta, antes de começar."},{"q":"Tenho de ter fotografias e textos prontos?","a":"Não necessariamente. Pode usar as fotografias que já tem ou produzir novas, e isso é combinado caso a caso. Os textos são escritos consigo, a partir da conversa sobre o seu negócio."},{"q":"Onde fica alojado o site? Posso usar o meu domínio?","a":"O site fica alojado na Vercel. Pode usar o endereço da própria Vercel ou um domínio seu, como um .pt, se for esse o seu desejo. Eu trato da configuração."},{"q":"E depois de o site estar no ar?","a":"Para manutenção e ajustes depois da publicação, há um plano mensal opcional, combinado na proposta."},{"q":"Funciona bem no telemóvel?","a":"Sim. Cada página é desenhada e verificada no telemóvel e no computador antes de ir para o ar."}]},
  hero: { title: "Sites com a identidade da sua marca.", sub: "Para clínicas, escritórios e negócios escolhidos pela confiança.", projects: "Ver projetos", talk: "Falar pelo WhatsApp", talkShort: "Falar" },
  hook: { label: "Do primeiro olhar ao próximo clique, e daí até à sua agenda.", first: ["Do pr", "meiro olhar"], lead: "ao próximo ", click: ["cl", "que"], clickLabel: "clique", tail: "e daí até à sua agenda.", cursor: "Começar um projeto" },
  palmLabel: "A mão aberta de Gabriel, com a palma virada para cima, segura o ponto vermelho da marca.",
  palmTitle: "Feito à mão, do primeiro traço ao último clique.", palmText: "Sem modelos prontos: cada site nasce da sua própria marca.",
  projects: "Projetos", workProof: "Nenhum se parece com o outro: cada marca tem as cores das próprias fotografias.", workNote: "Clique num projeto para ver o filme. Marcas brasileiras, com sites em português do Brasil.", specFont: "Tipo de letra", specColors: "Cores medidas nas fotografias",
  sectors: { fio: "Transplante capilar", nitida: "Cirurgia refrativa", cerne: "Implantes e reabilitação oral", talhao: "Direito agrário", paddock: "Usados com relatório aberto", arrimo: "Direito da Segurança Social", lume: "Psicologia", forma: "Medicina dentária estética", sutil: "Cirurgia plástica", toca: "Hospital veterinário", brisa: "Hotel boutique", almeida: "Direito da família e sucessões", aura: "Harmonização facial", orla: "Imobiliário residencial" },
  benefits: { fio: "Mostra num mapa da cabeça onde incomoda e diz com franqueza que nem todo caso é cirurgia.", nitida: "Mostra o que a avaliação examina e diz com clareza que nem todo olho pode ser operado.", cerne: "Fala do que o paciente quer voltar a comer, não do dente, e leva à avaliação sem pressa.", lume: "A paciente revê-se na rotina mostrada antes de marcar a primeira conversa.", arrimo: "Mostra, passo a passo, o caminho de um pedido recusado até uma nova análise.", paddock: "Abre o relatório de cada carro antes do preço, para a compra começar pela confiança.", talhao: "Cada parcela do mapa acende uma situação do produtor e leva à conversa certa.", sutil: "Mostra a recuperação dia a dia, para a paciente decidir com informação.", brisa: "Leva o hóspede da baía até à suíte ao deslizar a página, antes da reserva.", aura: "Explica o que muda e o que se preserva no rosto, antes da avaliação.", orla: "Organiza objetivo, investimento e prazo de quem procura casa, antes da visita." },
  servicesNote: "O que faço para clínicas, escritórios e negócios de alto valor", servicesTitle: ["Cada negócio recebe os clientes à sua maneira.", "Vamos dar-lhe forma."],
  services: [
    { title: "Sites e landing pages", text: "O que oferece, as dúvidas mais frequentes e o caminho até à primeira conversa, numa página que o cliente percebe sem esforço." },
    { title: "Design com identidade própria", text: "Cores retiradas das suas próprias fotografias e um tipo de letra escolhido para a sua marca, para que o site não pareça o da concorrência." },
    { title: "Movimento e interação", text: "O scroll mostra o espaço, o processo ou o produto. Um percurso curto prepara a primeira conversa." },
    { title: "Design e desenvolvimento", text: "Desenho e programo o site e verifico cada página no telemóvel e no computador." },
  ],
  supportTitle: "Depois do site", supportText: "Para o seu negócio ser encontrado e o cliente chegar à marcação.",
  support: [
    { title: "Perfil da Empresa no Google e Maps", text: "Deixo o perfil do negócio completo e atualizado, com horários, fotografias e localização, para quem pesquisa na zona." },
    { title: "Google Ads e Instagram", text: "Configuro e acompanho campanhas no Google e no Instagram que levam quem procura o seu serviço até ao site." },
    { title: "Automação no WhatsApp", text: "Uma primeira resposta automática esclarece as dúvidas mais comuns e encaminha o cliente até à marcação." },
  ],
  customLead: "À medida.", customText: "Precisa de algo que não está aqui, como um painel com os números do negócio, um CRM ou uma integração entre sistemas? Conte-me o problema e eu digo-lhe se e como o posso resolver.",
  stepsTitle: "Como funciona",
  steps: [
    { title: "Conversa", text: "Conte-me como o seu negócio funciona hoje, quem são os clientes e o que o site precisa de resolver." },
    { title: "Proposta", text: "Proponho as páginas, os conteúdos e o que mais fizer sentido para o seu negócio, com o investimento de cada parte." },
    { title: "Design e programação", text: "Desenho a partir das suas fotografias e da sua marca e programo o site. Pode acompanhar o progresso antes de o site ficar online." },
    { title: "Online", text: "O site é publicado depois de verificado no telemóvel e no computador, pronto para receber os clientes." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["Uma boa ideia", "tem de funcionar."], aboutText: "Também no telemóvel de quem está à sua procura.",
  aboutIntro: ["Sou o Gabriel Batista e trabalho a partir do Brasil.", "Sou eu que desenho e programo, por isso nenhum site sai de um modelo."], aboutClaim: ["Quem desenha", "é quem programa."],
  principles: ["Perceber o negócio antes de desenhar a página.", "Dar à marca uma linguagem própria.", "Deixar claro, em cada parte da página, o próximo passo do cliente.", "Verificar a experiência no browser e no telemóvel."],
  aboutLink: "Falar sobre o meu site",
  contactTitle: ["O próximo site pode ser", "o do seu negócio."], contactText: "Diga-me como o seu negócio funciona hoje e o que quer que o site resolva.",
  contactGo: "Vamos conversar", contactWhere: "Abre uma conversa no WhatsApp. Trabalho à distância, a partir do Brasil.",
  footerTalk: "Falar pelo WhatsApp", rights: "© 2026 Gabriel Batista Digital. Todos os direitos reservados.", backTop: "Voltar ao início",
  motion: { pause: "Pausar movimento", resume: "Ativar movimento" },
  media: { interface: "Interface do projeto", watch: "Ver filme completo", explore: "Explorar projeto", watchFull: "Ver filme completo", filmOf: "Filme do projeto", close: "Fechar", noVideo: "O seu navegador não reproduz este vídeo.", talkNote: "Fale com o Gabriel pelo WhatsApp." },
  avatarAlt: "Personagem do Gabriel atrás de um portátil, num escritório escuro com um quadro de estratégia: funil, fluxograma e gráfico de crescimento",
};

const en: HomeCopy = {
  metaTitle: "Gabriel Batista | Websites for clinics, law firms and premium businesses",
  metaDescription: "Website design and development for clinics, law firms and other premium businesses: a brand of its own, from first contact to the first conversation.",
  ogImageAlt: "Gabriel Batista: websites for clinics, law firms and premium businesses",
  skip: "Skip to content", navLabel: "Portfolio navigation",
  nav: { work: "Projects", services: "Services", about: "About", talk: "Let's talk" }, talkCursor: "Let's talk",
  langLabel: "Language", contactMessage: "Hi Gabriel! I saw your portfolio and I'd like to talk about a website for my business.",
  heroAlt: "Front portrait of Gabriel Batista in red light",
  offer: { label: "Web design & development", before: "Web des", after: "gn &", line2: "development" },
  tagline: "Websites with your brand's identity, for businesses people choose on trust.",
  scrollHint: { desktop: "Scroll to see how I build", phone: "Swipe to see how I build" },
  scrollGuide: { desktop: "Scroll to continue", phone: "Swipe to continue", side: "Swipe sideways" },
  stepsCta: { label: "Start with a conversation", note: "Opens a WhatsApp chat, answered in writing" },
  diagnosis: {"title":"Not sure where to start?","intro":"Two questions, and I'll tell you where I would start in your case.","stepOf":"{n} of {total}","q1":"What kind of business do you have?","businesses":[{"id":"clinica","label":"Clinic or practice","msg":"I run a clinic or practice."},{"id":"advocacia","label":"Law firm","msg":"I run a law firm."},{"id":"outro","label":"Another business","msg":"I run a business."}],"q2":"Where are you today?","situations":[{"id":"sem-site","label":"I don't have a website yet","start":"A website with your business's own identity","why":"It's the foundation: where a client understands what you do and finds the next step. Google and ads come later, bringing people to it.","msg":"I don't have a website yet."},{"id":"nao-parece","label":"I have a website, but it doesn't look like my business","start":"A new website, built from your photos and your brand","why":"People who research before getting in touch decide on first impressions. A new site shows the business they will actually find.","msg":"I have a website, but it doesn't look like my business."},{"id":"pouca-gente","label":"I have a website, but few people find it","start":"Google Business Profile and Google and Instagram campaigns","why":"First, a complete profile for people searching nearby; then campaigns that bring people looking for your service to the site. I'll look at your current site in the conversation too.","msg":"I have a website, but few people find it."},{"id":"mesmas-duvidas","label":"I get inquiries, but lose time on the same questions","start":"WhatsApp automation","why":"A first automatic reply answers the most common questions and guides the client to the next step, so only what truly needs you reaches you.","msg":"I get inquiries, but lose time on the same questions."},{"id":"outra","label":"Something else: a dashboard, a CRM, an integration","start":"Custom","why":"Tell me the problem, and I'll tell you whether and how I can solve it.","msg":"I need something custom, like a dashboard, a CRM or an integration."}],"resultLabel":"Where I would start","confirm":"It's a suggestion: in the conversation we confirm what makes sense for your case.","talk":"Talk about this","note":"Opens a WhatsApp chat with your answers, answered in writing.","restart":"Start over","back":"Back","greeting":"Hi Gabriel! I answered the two questions on your site.","closing":"Can we talk?"},
  faq: {"title":"Frequently asked questions","items":[{"q":"How much does a website cost?","a":"It depends on what your business needs: how many pages, which sections, and whether it includes services such as your Google Business Profile, ads or WhatsApp automation. In our first conversation I learn about your case and give you a price range; the proposal breaks down the cost of each part."},{"q":"How long does it take?","a":"It depends on the size of the site and the material you already have. The timeline is agreed in the proposal, before work starts."},{"q":"Do I need photos and copy ready?","a":"Not necessarily. We can use the photos you already have or produce new ones, decided case by case. The copy is written with you, based on our conversation about your business."},{"q":"Where is the site hosted? Can I use my own domain?","a":"The site is hosted on Vercel. It can use Vercel's own address or a domain of yours, if you'd like. I take care of the setup."},{"q":"What happens after launch?","a":"For maintenance and changes after launch, there is an optional monthly plan, agreed in the proposal."},{"q":"Does it work well on phones?","a":"Yes. Every page is designed and checked on phones and computers before it goes live."}]},
  hero: { title: "Websites with your brand's identity.", sub: "For clinics, law firms and businesses people choose on trust.", projects: "See projects", talk: "Talk on WhatsApp", talkShort: "Talk" },
  hook: { label: "From first glance to the next click, and from there to your calendar.", first: ["From f", "rst glance"], lead: "to the next ", click: ["cl", "ck"], clickLabel: "click", tail: "and from there to your calendar.", cursor: "Start a project" },
  palmLabel: "Gabriel's open hand, palm up, holding the brand's red dot.",
  palmTitle: "Handmade, from the first stroke to the last click.", palmText: "No ready-made template: every website is born from your own brand.",
  projects: "Projects", workProof: "No two alike: each brand gets the colors of its own photos.", workNote: "Click a project to watch its film. Brazilian brands: the sites are in Portuguese.", specFont: "Typeface", specColors: "Colors measured from the photos",
  sectors: { fio: "Hair transplant", nitida: "Refractive eye surgery", cerne: "Dental implants and oral rehabilitation", talhao: "Agribusiness law", paddock: "Pre-owned cars with open inspection reports", arrimo: "Social security law", lume: "Psychology", forma: "Cosmetic dentistry", sutil: "Plastic surgery", toca: "Veterinary hospital", brisa: "Boutique hotel", almeida: "Family and estate law", aura: "Facial aesthetics", orla: "Residences" },
  benefits: { fio: "Maps where it bothers on a drawing of the head and says plainly that not every case is surgery.", nitida: "Shows what the assessment checks and says plainly that not every eye can be operated on.", cerne: "Talks about what the patient wants to eat again, not about the tooth, and leads to an unhurried assessment.", lume: "Clients see their own routine on the page before booking a first session.", arrimo: "Shows, step by step, how a denied claim gets back under review.", paddock: "Opens each car's inspection report before the price, so buying starts with trust.", talhao: "Each plot on the map lights up a farmer's situation and leads to the right conversation.", sutil: "Shows recovery day by day, so patients decide with the facts.", brisa: "Takes guests from the bay to the suite as they scroll, before they book.", aura: "Explains what changes and what stays in the face, before the consultation.", orla: "Sorts out the goal, budget and timing of a home search, before the viewing." },
  servicesNote: "What I build for clinics, law firms and premium businesses", servicesTitle: ["Every business has its own way of serving people.", "Let's give it shape."],
  services: [
    { title: "Websites & landing pages", text: "What you offer, the questions clients ask most and the path to a first conversation, on a page they understand without effort." },
    { title: "Brand-led design", text: "Colors taken from your own photos and a typeface chosen for your brand, so the site doesn't look like a competitor's." },
    { title: "Motion & interaction", text: "Scrolling shows the space, the process or the product. A short guided flow prepares the first conversation." },
    { title: "Design & development", text: "I design and code the site myself, and check every page on phone and desktop." },
  ],
  supportTitle: "Beyond the website", supportText: "So your business gets found and clients make it to the calendar.",
  support: [
    { title: "Google Business Profile & Maps", text: "I keep the business profile complete and up to date, with hours, photos and directions, for people searching nearby." },
    { title: "Google Ads & Instagram", text: "I set up and manage Google and Instagram campaigns that bring people looking for your service to the site." },
    { title: "WhatsApp automation", text: "An automatic first reply answers the most common questions and guides the client to booking." },
  ],
  customLead: "Custom.", customText: "Need something that isn't listed here, like a dashboard with your business numbers, a CRM or an integration between systems? Tell me the problem, and I'll tell you whether and how I can solve it.",
  stepsTitle: "How it works",
  steps: [
    { title: "Conversation", text: "You tell me how your business works today, who your clients are and what the website needs to solve." },
    { title: "Proposal", text: "I propose the pages, the content and whatever else makes sense for your business, with the investment for each part." },
    { title: "Design & code", text: "I design from your photos and brand and code the site. You follow the progress before it goes live." },
    { title: "Launch", text: "The site goes live checked on phone and desktop, ready to welcome clients." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["A good idea", "has to work."], aboutText: "Especially on the phone of someone looking for you.",
  aboutIntro: ["I'm Gabriel Batista, based in Brazil.", "I design and code everything myself, so no site comes from a template."], aboutClaim: ["The designer", "is the developer."],
  principles: ["Understand the business before designing the page.", "Give the brand a language of its own.", "Make the client's next step clear in every part of the page.", "Check the experience in the browser and on the phone."],
  aboutLink: "Talk about my website",
  contactTitle: ["The next website could be", "yours."], contactText: "Tell me how your business works today and what you want the website to solve.",
  contactGo: "Let's talk", contactWhere: "Opens a WhatsApp chat. I'm based in Brazil and reply in writing, in English.",
  footerTalk: "Talk on WhatsApp", rights: "© 2026 Gabriel Batista Digital. All rights reserved.", backTop: "Back to top",
  motion: { pause: "Pause motion", resume: "Turn motion on" },
  media: { interface: "Website of the project", watch: "Watch the full film", explore: "Explore project", watchFull: "Watch the full film", filmOf: "Film of the project", close: "Close", noVideo: "Your browser can't play this video.", talkNote: "Talk to Gabriel on WhatsApp." },
  avatarAlt: "Gabriel's character behind a laptop, in a dark office with a strategy board: funnel, flowchart and growth chart",
};

const es: HomeCopy = {
  metaTitle: "Gabriel Batista | Diseño de páginas web para clínicas, despachos y negocios premium",
  metaDescription: "Diseño y desarrollo de páginas web para clínicas, despachos de abogados y otros negocios premium: marca propia, del primer contacto a la primera conversación.",
  ogImageAlt: "Gabriel Batista: páginas web para clínicas, despachos y negocios premium",
  skip: "Saltar al contenido", navLabel: "Navegación del portafolio",
  nav: { work: "Proyectos", services: "Servicios", about: "Sobre mí", talk: "Hablemos" }, talkCursor: "Hablemos",
  langLabel: "Idioma", contactMessage: "¡Hola, Gabriel! Vi tu portafolio y quiero conversar sobre un sitio web para mi negocio.",
  heroAlt: "Retrato frontal de Gabriel Batista con luz roja",
  offer: { label: "Diseño & desarrollo web", before: "D", after: "seño &", line2: "desarrollo web" },
  tagline: "Páginas web con la identidad de tu marca, para negocios que se eligen por confianza.",
  scrollHint: { desktop: "Desplázate para ver cómo creo", phone: "Desliza para ver cómo creo" },
  scrollGuide: { desktop: "Desplázate para continuar", phone: "Desliza para continuar", side: "Desliza hacia el lado" },
  stepsCta: { label: "Empezar por la conversación", note: "Abre una conversación en WhatsApp, respondida por escrito" },
  diagnosis: {"title":"¿No sabes por dónde empezar?","intro":"Dos preguntas, y te digo por dónde empezaría en tu caso.","stepOf":"{n} de {total}","q1":"¿Qué tipo de negocio tienes?","businesses":[{"id":"clinica","label":"Clínica o consultorio","msg":"Tengo una clínica o consultorio."},{"id":"advocacia","label":"Despacho de abogados","msg":"Tengo un despacho de abogados."},{"id":"outro","label":"Otro negocio","msg":"Tengo un negocio."}],"q2":"¿Cómo está hoy?","situations":[{"id":"sem-site","label":"Todavía no tengo sitio web","start":"Un sitio web con la identidad de tu negocio","why":"Es la base: donde el cliente entiende lo que haces y encuentra el siguiente paso. Google y los anuncios vienen después, para llevar gente hasta él.","msg":"Todavía no tengo sitio web."},{"id":"nao-parece","label":"Tengo sitio, pero no se parece a mi negocio","start":"Un sitio nuevo, a partir de tus fotos y tu marca","why":"Quien investiga antes de escribir decide por la primera impresión. El sitio nuevo muestra el negocio que el cliente va a encontrar.","msg":"Tengo sitio, pero no se parece a mi negocio."},{"id":"pouca-gente","label":"Tengo sitio, pero llega poca gente","start":"Perfil de Empresa en Google y campañas en Google e Instagram","why":"Primero, el perfil completo para quien busca cerca; después, campañas que llevan hasta el sitio a quien busca tu servicio. En la conversación también reviso tu sitio actual.","msg":"Tengo sitio, pero llega poca gente."},{"id":"mesmas-duvidas","label":"Recibo contactos, pero pierdo tiempo con las mismas dudas","start":"Automatización en WhatsApp","why":"Una primera respuesta automática resuelve las dudas más comunes y lleva al cliente al siguiente paso, y a ti solo te llega lo que de verdad te necesita.","msg":"Recibo contactos, pero pierdo tiempo con las mismas dudas."},{"id":"outra","label":"Es otra cosa: un panel, un CRM, una integración","start":"A medida","why":"Cuéntame el problema y te digo si puedo resolverlo y cómo.","msg":"Necesito algo a medida, como un panel, un CRM o una integración."}],"resultLabel":"Por dónde empezaría","confirm":"Es una sugerencia: en la conversación confirmamos lo que tiene sentido para tu caso.","talk":"Hablar de esto","note":"Abre una conversación en WhatsApp con tus respuestas, respondida por escrito.","restart":"Empezar de nuevo","back":"Volver","greeting":"¡Hola, Gabriel! Respondí las dos preguntas de tu sitio.","closing":"¿Podemos conversar?"},
  faq: {"title":"Preguntas frecuentes","items":[{"q":"¿Cuánto cuesta un sitio web?","a":"Depende de lo que necesita tu negocio: cuántas páginas, qué secciones y si incluye servicios como tu Perfil de Negocio en Google, anuncios o automatización en WhatsApp. En la primera conversación entiendo tu caso y te doy un rango de inversión; la propuesta detalla el valor de cada parte."},{"q":"¿Cuánto tiempo toma?","a":"Depende del tamaño del sitio y del material que ya tienes. El plazo se acuerda en la propuesta, antes de empezar."},{"q":"¿Necesito tener fotos y textos listos?","a":"No necesariamente. Podemos usar las fotos que ya tienes o producir nuevas, según cada caso. Los textos se escriben contigo, a partir de la conversación sobre tu negocio."},{"q":"¿Dónde se aloja el sitio? ¿Puedo usar mi dominio?","a":"El sitio se aloja en Vercel. Puede usar la dirección de Vercel o un dominio tuyo, si así lo prefieres. Yo me encargo de la configuración."},{"q":"¿Y después de publicar el sitio?","a":"Para mantenimiento y ajustes después de publicar, hay un plan mensual opcional, acordado en la propuesta."},{"q":"¿Funciona bien en el celular?","a":"Sí. Cada página se diseña y se revisa en el celular y en la computadora antes de publicarse."}]},
  hero: { title: "Páginas web con la identidad de tu marca.", sub: "Para clínicas, despachos y negocios que se eligen por confianza.", projects: "Ver proyectos", talk: "Hablar por WhatsApp", talkShort: "Hablar" },
  hook: { label: "De la primera mirada al próximo clic, y de ahí a tu agenda.", first: ["De la pr", "mera mirada"], lead: "al próximo ", click: ["cl", "c"], clickLabel: "clic", tail: "y de ahí a tu agenda.", cursor: "Empezar un proyecto" },
  palmLabel: "La mano abierta de Gabriel, con la palma hacia arriba, sostiene el punto rojo de la marca.",
  palmTitle: "Hecho a mano, del primer trazo al último clic.", palmText: "Sin plantillas: cada sitio nace de tu propia marca.",
  projects: "Proyectos", workProof: "Ninguno se parece a otro: cada marca tiene los colores de sus propias fotos.", workNote: "Haz clic en un proyecto para ver su video. Marcas brasileñas: los sitios están en portugués.", specFont: "Tipografía", specColors: "Colores medidos en las fotos",
  sectors: { fio: "Trasplante capilar", nitida: "Cirugía refractiva", cerne: "Implantes y rehabilitación oral", talhao: "Derecho agrario", paddock: "Seminuevos con el informe abierto", arrimo: "Derecho de la seguridad social", lume: "Psicología", forma: "Odontología estética", sutil: "Cirugía plástica", toca: "Hospital veterinario", brisa: "Hotel boutique", almeida: "Derecho de familia y sucesiones", aura: "Armonización facial", orla: "Residencias" },
  benefits: { fio: "Muestra en un mapa de la cabeza dónde molesta y dice con franqueza que no todo caso es cirugía.", nitida: "Muestra lo que revisa la evaluación y dice con claridad que no todo ojo se puede operar.", cerne: "Habla de lo que el paciente quiere volver a comer, no del diente, y lleva a una evaluación sin prisa.", lume: "La paciente se reconoce en la rutina que ve antes de agendar la primera sesión.", arrimo: "Muestra, paso a paso, el camino de una solicitud negada hasta una nueva revisión.", paddock: "Abre el informe de cada auto antes del precio, para que la compra empiece por la confianza.", talhao: "Cada parcela del mapa enciende una situación del productor y lleva a la conversación correcta.", sutil: "Muestra la recuperación día a día, para que la paciente decida con información.", brisa: "Lleva al huésped de la bahía a la suite al desplazarse, antes de reservar.", aura: "Explica qué cambia y qué se conserva en el rostro, antes de la valoración.", orla: "Ordena objetivo, inversión y plazo de quien busca vivienda, antes de la visita." },
  servicesNote: "Lo que construyo para clínicas, despachos y negocios premium", servicesTitle: ["Cada negocio tiene su propia forma de atender.", "Démosle forma."],
  services: [
    { title: "Páginas web y landing pages", text: "Lo que ofreces, las dudas más frecuentes y el camino hasta la primera conversación, en una página que el cliente entiende sin esfuerzo." },
    { title: "Diseño con identidad propia", text: "Colores tomados de tus propias fotos y una tipografía elegida para tu marca, para que el sitio no parezca el de la competencia." },
    { title: "Movimiento e interacción", text: "El scroll muestra el espacio, el proceso o el producto. Un recorrido corto prepara la primera conversación." },
    { title: "Hecho por una sola persona", text: "Yo mismo diseño y programo el sitio, y reviso cada página en el celular y en la computadora." },
  ],
  supportTitle: "Después del sitio", supportText: "Para que encuentren tu negocio y el cliente llegue a la agenda.",
  support: [
    { title: "Perfil de Empresa en Google y Maps", text: "Dejo el perfil del negocio completo y actualizado, con horarios, fotos y cómo llegar, para quien busca cerca." },
    { title: "Google Ads e Instagram", text: "Configuro y gestiono campañas en Google e Instagram que llevan a quien busca tu servicio hasta el sitio." },
    { title: "Automatización en WhatsApp", text: "Una primera respuesta automática resuelve las dudas más comunes y lleva al cliente hasta la cita." },
  ],
  customLead: "A medida.", customText: "¿Necesitas algo que no está aquí, como un panel con los números del negocio, un CRM o una integración entre sistemas? Cuéntame el problema y te digo si puedo resolverlo y cómo.",
  stepsTitle: "Cómo funciona",
  steps: [
    { title: "Conversación", text: "Me cuentas cómo atiende hoy tu negocio, quiénes son tus clientes y qué tiene que resolver el sitio." },
    { title: "Propuesta", text: "Propongo las páginas, el contenido y lo que tenga más sentido para tu negocio, con la inversión de cada parte." },
    { title: "Diseño y programación", text: "Diseño a partir de tus fotos y tu marca y programo el sitio. Sigues el avance antes de publicarlo." },
    { title: "Lanzamiento", text: "El sitio se publica revisado en el celular y en la computadora, listo para recibir clientes." },
  ],
  aboutAlt: "Gabriel Batista", aboutTitle: ["Una buena idea", "tiene que funcionar."], aboutText: "También en el celular de quien te está buscando.",
  aboutIntro: ["Soy Gabriel Batista, desde Brasil.", "Yo mismo diseño y programo, por eso ningún sitio sale de una plantilla."], aboutClaim: ["Quien diseña", "es quien programa."],
  principles: ["Entender el negocio antes de diseñar la página.", "Darle a la marca un lenguaje propio.", "Dejar claro, en cada parte de la página, el siguiente paso del cliente.", "Revisar la experiencia en el navegador y en el celular."],
  aboutLink: "Hablar sobre mi sitio",
  contactTitle: ["El próximo sitio puede ser", "el de tu negocio."], contactText: "Cuéntame cómo atiende hoy tu negocio y qué quieres que resuelva el sitio.",
  contactGo: "Hablemos", contactWhere: "Abre una conversación en WhatsApp. Estoy en Brasil y respondo por escrito, en español.",
  footerTalk: "Hablar por WhatsApp", rights: "© 2026 Gabriel Batista Digital. Todos los derechos reservados.", backTop: "Volver al inicio",
  motion: { pause: "Pausar movimiento", resume: "Activar movimiento" },
  media: { interface: "Interfaz del proyecto", watch: "Ver el video completo", explore: "Explorar proyecto", watchFull: "Ver el video completo", filmOf: "Video del proyecto", close: "Cerrar", noVideo: "Tu navegador no puede reproducir este video.", talkNote: "Habla con Gabriel por WhatsApp." },
  avatarAlt: "Personaje de Gabriel detrás de una laptop, en una oficina oscura con un pizarrón de estrategia: embudo, diagrama de flujo y gráfico de crecimiento",
};

export const homeCopy: Record<Locale, HomeCopy> = { pt, "pt-PT": ptPT, en, es };
export const contactUrl = (locale: Locale) => buildWhatsAppUrl(homeCopy[locale].contactMessage);
