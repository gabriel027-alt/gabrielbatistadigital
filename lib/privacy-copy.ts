import type { Locale } from "@/lib/i18n";

/**
 * The consent banner and the privacy policy in the four languages (18/11/2026). Written for what the site actually
 * does: no forms or sign-ups; with consent, Google Analytics and Google Ads cookies; the hosting's technical logs;
 * contact only by WhatsApp. A plain-language policy, not legal advice: a lawyer should review it before campaigns.
 */
export type PrivacyCopy = {
  path: string; home: string;
  banner: { text: string; accept: string; reject: string; policy: string };
  footerPrivacy: string; footerCookies: string;
  title: string; updated: string; back: string;
  sections: { title: string; body: string[] }[];
};

const phone = "+55 38 99826-7717";

const pt: PrivacyCopy = {
  path: "/privacidade", home: "/",
  banner: { text: "Uso cookies do Google Analytics e do Google Ads para saber como as visitas chegam e quais anúncios funcionam. Só se você aceitar.", accept: "Aceitar", reject: "Recusar", policy: "Política de privacidade" },
  footerPrivacy: "Privacidade", footerCookies: "Preferências de cookies",
  title: "Política de privacidade", updated: "Atualizada em 18 de novembro de 2026.", back: "Voltar ao início",
  sections: [
    { title: "Quem é o responsável", body: [`Gabriel Batista (Gabriel Batista Digital), que cria este site. Contato pelo WhatsApp ${phone}.`] },
    { title: "O que este site coleta", body: ["O site não tem formulário, cadastro nem área de login.", "Se você aceitar os cookies, o Google Analytics e o Google Ads registram dados de navegação: páginas vistas, país e cidade aproximados, tipo de aparelho e navegador, de onde veio a visita (por exemplo, um anúncio) e os cliques nos botões do WhatsApp. Isso serve para medir as visitas e saber quais anúncios funcionam.", "Se você recusar, nada disso é carregado.", "A hospedagem registra dados técnicos de acesso, como o endereço IP, por segurança e para manter o site no ar."] },
    { title: "WhatsApp", body: ["Ao clicar em um botão do WhatsApp, você sai do site e a conversa segue as regras do WhatsApp. Este site não recebe o conteúdo das mensagens."] },
    { title: "Base legal e compartilhamento", body: ["Os cookies de medição e de anúncios dependem do seu consentimento (LGPD, art. 7º, I; RGPD, art. 6º, 1, a). Os dados são tratados pelo Google, que pode processá-los fora do Brasil e da União Europeia. Nada é vendido."] },
    { title: "Por quanto tempo", body: ["Os dados de medição ficam guardados pelo prazo de retenção configurado no Google Analytics. Os cookies expiram conforme as regras do Google, e você pode apagá-los no seu navegador a qualquer momento."] },
    { title: "Seus direitos", body: [`Você pode retirar o consentimento quando quiser em "Preferências de cookies", no rodapé. Pedidos de acesso, correção ou exclusão de dados podem ser feitos pelo WhatsApp ${phone}.`] },
  ],
};

const ptPT: PrivacyCopy = {
  path: "/pt-pt/privacidade", home: "/pt-pt",
  banner: { text: "Uso cookies do Google Analytics e do Google Ads para perceber como chegam as visitas e que anúncios funcionam. Só se aceitar.", accept: "Aceitar", reject: "Recusar", policy: "Política de privacidade" },
  footerPrivacy: "Privacidade", footerCookies: "Preferências de cookies",
  title: "Política de privacidade", updated: "Atualizada a 18 de novembro de 2026.", back: "Voltar ao início",
  sections: [
    { title: "Quem é o responsável", body: [`Gabriel Batista (Gabriel Batista Digital), que cria este site. Contacto pelo WhatsApp ${phone}.`] },
    { title: "O que este site recolhe", body: ["O site não tem formulários, registos nem área de cliente.", "Se aceitar os cookies, o Google Analytics e o Google Ads registam dados de navegação: páginas vistas, país e cidade aproximados, tipo de dispositivo e browser, a origem da visita (por exemplo, um anúncio) e os cliques nos botões do WhatsApp. Servem para medir as visitas e perceber que anúncios funcionam.", "Se recusar, nada disto é carregado.", "O alojamento regista dados técnicos de acesso, como o endereço IP, por segurança e para manter o site online."] },
    { title: "WhatsApp", body: ["Ao clicar num botão do WhatsApp, sai do site e a conversa segue as regras do WhatsApp. Este site não recebe o conteúdo das mensagens."] },
    { title: "Fundamento e partilha", body: ["Os cookies de medição e de anúncios dependem do seu consentimento (RGPD, art. 6.º, n.º 1, alínea a). Os dados são tratados pela Google, que os pode processar fora da União Europeia. Nada é vendido."] },
    { title: "Durante quanto tempo", body: ["Os dados de medição são guardados pelo prazo de conservação configurado no Google Analytics. Os cookies expiram segundo as regras da Google, e pode apagá-los no seu browser a qualquer momento."] },
    { title: "Os seus direitos", body: [`Pode retirar o consentimento quando quiser em "Preferências de cookies", no rodapé. Pedidos de acesso, retificação ou apagamento podem ser feitos pelo WhatsApp ${phone}. Tem também o direito de apresentar reclamação à CNPD.`] },
  ],
};

const en: PrivacyCopy = {
  path: "/en/privacy", home: "/en",
  banner: { text: "I use Google Analytics and Google Ads cookies to see how visitors arrive and which ads work. Only if you accept.", accept: "Accept", reject: "Decline", policy: "Privacy policy" },
  footerPrivacy: "Privacy", footerCookies: "Cookie preferences",
  title: "Privacy policy", updated: "Updated November 18, 2026.", back: "Back to the home page",
  sections: [
    { title: "Who is responsible", body: [`Gabriel Batista (Gabriel Batista Digital), who builds this site. Contact on WhatsApp at ${phone}.`] },
    { title: "What this site collects", body: ["The site has no forms, sign-ups or log-in.", "If you accept cookies, Google Analytics and Google Ads record browsing data: pages viewed, approximate country and city, device and browser, where the visit came from (for example, an ad) and clicks on the WhatsApp buttons. This measures visits and shows which ads work.", "If you decline, none of this is loaded.", "The hosting provider logs technical access data, such as the IP address, for security and to keep the site running."] },
    { title: "WhatsApp", body: ["When you click a WhatsApp button you leave this site, and the conversation follows WhatsApp's rules. This site does not receive the content of your messages."] },
    { title: "Legal basis and sharing", body: ["Measurement and advertising cookies depend on your consent (GDPR art. 6(1)(a); LGPD art. 7, I). The data is processed by Google, which may process it outside Brazil and the European Union. Nothing is sold."] },
    { title: "How long", body: ["Measurement data is kept for the retention period set in Google Analytics. Cookies expire under Google's rules, and you can delete them in your browser at any time."] },
    { title: "Your rights", body: [`You can withdraw consent at any time under "Cookie preferences" in the footer. Requests to access, correct or delete data can be made on WhatsApp at ${phone}.`] },
  ],
};

const es: PrivacyCopy = {
  path: "/es/privacidad", home: "/es",
  banner: { text: "Uso cookies de Google Analytics y Google Ads para saber cómo llegan las visitas y qué anuncios funcionan. Solo si aceptas.", accept: "Aceptar", reject: "Rechazar", policy: "Política de privacidad" },
  footerPrivacy: "Privacidad", footerCookies: "Preferencias de cookies",
  title: "Política de privacidad", updated: "Actualizada el 18 de noviembre de 2026.", back: "Volver al inicio",
  sections: [
    { title: "Quién es el responsable", body: [`Gabriel Batista (Gabriel Batista Digital), quien crea este sitio. Contacto por WhatsApp al ${phone}.`] },
    { title: "Qué recopila este sitio", body: ["El sitio no tiene formularios, registros ni área de acceso.", "Si aceptas las cookies, Google Analytics y Google Ads registran datos de navegación: páginas vistas, país y ciudad aproximados, tipo de dispositivo y navegador, de dónde vino la visita (por ejemplo, un anuncio) y los clics en los botones de WhatsApp. Sirve para medir las visitas y saber qué anuncios funcionan.", "Si rechazas, nada de esto se carga.", "El alojamiento registra datos técnicos de acceso, como la dirección IP, por seguridad y para mantener el sitio en línea."] },
    { title: "WhatsApp", body: ["Al hacer clic en un botón de WhatsApp sales del sitio, y la conversación sigue las reglas de WhatsApp. Este sitio no recibe el contenido de los mensajes."] },
    { title: "Base legal y transferencia", body: ["Las cookies de medición y de anuncios dependen de tu consentimiento (RGPD, art. 6.1.a; LGPD, art. 7, I). Los datos los trata Google, que puede procesarlos fuera de Brasil y de la Unión Europea. Nada se vende."] },
    { title: "Por cuánto tiempo", body: ["Los datos de medición se guardan durante el plazo de retención configurado en Google Analytics. Las cookies vencen según las reglas de Google, y puedes borrarlas en tu navegador cuando quieras."] },
    { title: "Tus derechos", body: [`Puedes retirar el consentimiento cuando quieras en "Preferencias de cookies", en el pie de página. Las solicitudes de acceso, corrección o eliminación se pueden hacer por WhatsApp al ${phone}.`] },
  ],
};

export const privacyCopy: Record<Locale, PrivacyCopy> = { pt, "pt-PT": ptPT, en, es };
