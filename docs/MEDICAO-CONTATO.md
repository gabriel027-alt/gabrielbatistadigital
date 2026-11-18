# Medição dos cliques no WhatsApp

Preparado em 18/11/2026, antes das campanhas. **Nenhuma ferramenta de estatística está ligada.** O site não carrega script externo e não grava cookie: só registra o clique dentro da própria página, pronto para a ferramenta que você escolher (`components/ContactTracking.tsx`).

## O que é registrado em cada clique

| Campo | Exemplo | De onde vem |
|---|---|---|
| `place` | `contato`, `menu`, `menu-celular`, `frase-clique`, `sob-medida`, `sobre`, `rodape`, `filme-forma` | marca `data-track-place` em cada link do WhatsApp |
| `language` | `pt-BR`, `pt-PT`, `en`, `es` | idioma da página |
| `page` | `/`, `/pt-pt`, `/en`, `/es` | endereço |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` | `google`, `cpc`, `clinicas-lisboa` | parâmetros do link do anúncio, guardados durante a visita |

O mesmo clique é entregue a quatro destinos, todos opcionais:

1. `window.dataLayer` com `event: "whatsapp_click"`: para Google Tag Manager, GA4 e conversões do Google Ads.
2. `window.gtag("event", "whatsapp_click", …)`: se o gtag.js estiver na página.
3. `window.plausible("WhatsApp click", { props })`: se o Plausible estiver na página.
4. Evento `gb:contact` no `document`: para qualquer outra ferramenta, como o `track()` do Vercel Analytics.

## Como ligar cada opção

### A. Sem cookies e sem banner: Plausible ou Vercel Web Analytics

- **Plausible** (pago à parte): colar o script deles no `<head>` (`app/layout.tsx`) e criar no painel a meta personalizada "WhatsApp click". As propriedades `place`, `language` e `utm_campaign` aparecem em cada clique.
- **Vercel Web Analytics**: ativar no painel da Vercel e instalar `@vercel/analytics`. Os eventos personalizados (`track`) exigem o plano pago. Para enviar o clique: `document.addEventListener("gb:contact", e => track("WhatsApp click", e.detail))`.
- Nenhuma das duas usa cookies, então não precisa de banner de consentimento.

### B. Google Analytics 4 e conversão do Google Ads

- Criar um contêiner no Google Tag Manager e colar o código dele em `app/layout.tsx`.
- No GTM, criar um acionador "Evento personalizado" com o nome `whatsapp_click` e usar esse acionador na tag de conversão do Google Ads e num evento do GA4.
- Esse caminho usa cookies. Para visitantes de Portugal e da Europa (RGPD), e como boa prática no Brasil (LGPD), é preciso um **banner de consentimento** e o modo de consentimento do Google. As tags só podem disparar depois do aceite.

## Nos anúncios

Use links com UTM, por exemplo:
`https://gabrielbatistadigital.com.br/pt-pt?utm_source=google&utm_medium=cpc&utm_campaign=clinicas-portugal`

O Google Ads acrescenta o `gclid` sozinho quando a marcação automática está ligada.

## Limites

- O registro conta o **clique** que abre o WhatsApp. Ele não sabe se a mensagem foi enviada nem se virou cliente.
- Bloqueadores de anúncio podem impedir as ferramentas de receber o clique.
- Teste: `tests/e2e/editorial-portfolio.spec.ts`, em "A click on WhatsApp is recorded…". Ele confirma que nada externo é carregado e que nenhum cookie é gravado.
