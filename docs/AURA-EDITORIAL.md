# Aura — harmonização facial / direção editorial

Brief consolidado em 4 de novembro de 2026. Substitui a direção estética anterior em /propostas/aura; não altera homepage ou conceitos preservados. O usuário pediu apresentação acabada sem rótulos de fictício/demonstração. Não há resultados, depoimentos ou profissionais autorizados: não inserir provas falsas, antes/depois simulado ou canal de atendimento de clínica inventado. Contato comercial identificado como Gabriel.

## Fontes e identidade

O acesso à categoria beauty do Awwwards retornou 403 do proxy. Não foi feita inspeção de premiados nesta sessão; “nível Awwwards” é objetivo criativo, não uma certificação. Base verificável: efeitos Codrops escolhidos pelo usuário, código consultado e APIs oficiais GSAP. Nenhum asset de site premiado foi copiado. Retrato editorial gerado para esta composição, sem alegação de paciente ou resultado. Não é retrato de profissional. Ambiente local reaproveitado como mídia de identidade, sem endereço ou nome de unidade real.

Paleta proposta: espresso #201714, branco mineral #f2f1eb, laranja #ff704d. Uma família Manrope existente, título de peso médio e escala ampla. Fotografia dominante, navegação discreta, contraste quente e variação real de composição. Paleta da marca Gabriel não alterada.

## Coreografia antes do código

| Cena | Função | Estados e referência | Retorno/fallback |
| --- | --- | --- | --- |
| Retrato / abertura | Identificar harmonização facial e expressão individual | Letras se organizam (princípio Codrops 4); com scroll o enquadramento da foto se expande, título se afasta e aparece uma frase de continuidade. Desktop: palco sticky por aproximadamente 2 telas. Não deformar rosto. | Timeline reversível; sem movimento, retrato estático e oferta acessível. Mobile: fluxo mais curto sem palco longo. |
| O rosto inteiro | Ligar transformação ao conjunto e não a um detalhe isolado | Fundo laranja, duas linhas de título se organizam em perspectiva (Codrops 6/7); texto se revela por palavras (referência 25/27). Intervalo de leitura estável depois da transição. | Palavras completas e sem transparência se não houver JS ou houver movimento reduzido. |
| Avaliação | Explicar objetivo, possibilidades/limites e decisão | Mudança de densidade para imagem e disclosures; expansão nativa com teclado. Ritmo mais calmo para leitura. | Conteúdo em HTML e detalhes nativos. |
| Contato | Encerrar com autoria e destino verdadeiro | Assinatura Aura e contato de Gabriel, sem falsas reservas de consulta. | Link acessível sem terminar uma animação. |

## Dependência

GSAP 3.15.1 fixado; README oficial e declarações TypeScript consultados. Usa ScrollTrigger para timelines reversíveis, matchMedia, contexto e limpeza. Manifesto npm declara licença padrão “no charge” da GreenSock (não MIT), sem dependências runtime. Página integral de licença não foi acessada nesta rede; referência oficial: https://gsap.com/standard-license . Não criar ferramenta concorrente/revenda da biblioteca. Download via npm com scripts desativados. Não usa motor proprietário do ZIP, Lenis, física ou cena 3D para cumprir lista de tecnologias.

## Critérios de aceitação

Inspecionar primeiro abertura e transição; expandir seção de avaliação somente com composição coerente. Registrar vídeo real de scroll para frente e para trás, capturas desktop/mobile, contraste, overflow, mudanças de preferência de movimento, desativação manual, disclosure por teclado, fallback sem JS e desmontagem por navegação. Não considerar máscaras/perspectiva CSS como 3D de modelo. Não anunciar validação iOS/GPU real nem eficácia comercial. Resultado estético permanece para avaliação do usuário.

## Evidência obtida

- Build de produção, incluindo TypeScript, e lint aprovados. Três testes focados passaram em 9,6s: navegação/disclosures/axe/overflow, reversão de scroll e controles de movimento dinâmicos, e alternativa sem JS.
- Capturas examinadas em desktop e celular emulado; imagem de recepção carregada antes das capturas finais. A imagem-guia foi comparada com a implementação; a referência do mockup não é aprovação do usuário e o enquadramento se transforma na versão animada.
- Gravações do navegador com scroll progressivo e retorno em desktop 1440×900 e celular emulado 390×844, em preview/aura-editorial/. Frames da gravação foram examinados em sequência; vídeos são evidência da execução, não benchmark de GPU. Capturas integrais registram movimento reduzido, enquanto start/peak/restored registram movimento normal.
- Inspeção ad hoc de navegação Aura → Gabriel → voltar: uma raiz animada ativa e nenhum erro de execução. As duas gravações também não registraram erros de página.
- Retrato WebP: aproximadamente 156 KiB no disco. Isso não é medida do carregamento total nem certificação de Core Web Vitals. Não foram executados Lighthouse, teste em aparelho físico ou validação comercial.

O momento principal usa enquadramento e tipografia; não há modelo WebGL, antes/depois de paciente, depoimento ou profissional fabricado. A interface não exibe rótulo de demonstração/fictício. A autoria e o contato comercial de Gabriel permanecem explícitos. A homepage e os conceitos anteriores não foram substituídos.
