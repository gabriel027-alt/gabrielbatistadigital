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

## Segunda unidade: momento principal integrado

Autorizada após apresentação da proposta de integração. Escopo: abertura → transição → momento principal, preservando avaliação e contato. Sem novos assets, bibliotecas ou resultados clínicos.

Coreografia: o enquadramento da abertura continua expandindo; ao sair, o palco recua discretamente e a superfície laranja entra. No momento principal, título ocupa a tela primeiro, depois reduz sua escala e libera a composição para um plano fotográfico com perspectiva e três leituras consecutivas: proporção, expressão e planejamento. O scroll avança e reverte os estados. A fotografia é sempre a mesma, sem alterar traços ou criar antes/depois. O efeito de profundidade é perspectiva CSS, não modelo facial 3D nem simulação de tratamento.

Desktop amplo: palco sticky dedicado por aproximadamente 2,6 telas; tempo inicial de leitura, entrada do plano, três estados e encerramento estável. Mobile/telas baixas: fluxo natural, plano fotográfico com entrada curta, todos os textos presentes em sequência; não impor a sequência longa de desktop. Sem JS/movimento reduzido: composição estática completa. Desativação e mudança de preferência precisam reverter posições/opacidades e altura da seção. Não ocultar links dentro dos estados. Capturas e gravações devem examinar cada estado e a reversão.

### Verificação da segunda unidade

Lint e build de produção aprovados. Quatro testes focados aprovados em 21,3s: o novo teste verifica cada estado do capítulo, retorno ao primeiro, desativação manual, mudança de preferência e composição móvel linear, além das verificações anteriores. Inspeção em Chromium confirmou uma nota visível por vez nos estados estáveis e todas visíveis no fallback; axe sem violações nos critérios selecionados e sem overflow entre 360 e 1920px. O recorte fotográfico recebeu sizes compatível com a ampliação para não buscar uma fonte pequena demais.

Vídeos desktop/mobile em preview/aura-immersive/ com avanço e retorno. Capturas dos três estados e da composição móvel estática foram examinadas; quadros da gravação desktop também foram revisados em sequência. Nenhum erro de página nas gravações. A imagem de recepção foi carregada antes das capturas integrais, e o foco de inspeção foi removido para não incluir o skip-link ativado pela auditoria. Sem ensaio em aparelho físico, medição de GPU ou validação comercial. Não há novo modelo 3D, resultado clínico, depoimento ou dependência nesta unidade.

## Terceira unidade: regiões faciais em 3D real

Pedido: remover o quadro persistente e percorrer regiões com alternância de enquadramento, lado do texto e profundidade. Solução implementada: superfície facial canônica do MediaPipe (Apache-2.0), convertida em GLB de 261.836 bytes, 7.257 vértices/14.368 triângulos após duas subdivisões Loop offline (three-subdivide 1.1.5, MIT). Origem fixada e licença em public/models/aura-face/. É geometria genérica, não anatomia da modelo da foto, resultado clínico ou localização de aplicação de produto. Não há deformação de tratamento.

Three.js 0.186.1, MIT, com GLTFLoader; tipos 0.186.0 para desenvolvimento. Renderer imperativo isolado porque o scroll fornece apenas progresso/câmera, sem necessidade de adicionar Fiber/Drei ou reconciliar estado de cena com React. Normais suavizadas, material cobre, iluminação simples, sem texturas pesadas, física ou pós-processamento. GLB preparado offline por GLTFExporter, sem distribuir OBJ como contrato runtime. Render sob demanda, DPR limitado, liberação de recursos e fallback fotográfico em falha de WebGL/contexto/asset. Avaliar performance real, sem prometer fluidez em GPU móvel não testada.

Sequência planejada: visão geral → região malar (texto à esquerda, face à direita) → lábios (texto à direita, face à esquerda) → mandíbula/queixo (retorno de lado e mudança de ângulo) → saída. A câmera muda posição, alvo e projeção, sem esticar a geometria. Textos descrevem o que entra na avaliação, sem técnica invasiva, dose ou prescrição. Mobile preserva fluxo curto com a cena frontal e conteúdo linear; sem JS/movimento reduzido conserva fotografia e os textos. Não apresentar como antes/depois.

### Verificação da terceira unidade — 04/11/2026

Build de produção e lint aprovados. Cinco testes Playwright passaram em 16,1s, cobrindo navegação, acessibilidade axe, larguras 360–1920px, scroll reversível, modo estático/manual/reduzido, conteúdo sem JavaScript e renderização WebGL com retorno à fotografia após perda de contexto. Teste WebGL em Chromium com SwiftShader; não equivale a ensaio de GPU/aparelho físico. Khronos glTF Validator: zero erros e zero avisos (relatório em research/aura-face-validation.json). Câmeras e textos dos três estados foram inspecionados visualmente. Evidências em preview/aura-face-3d/, incluindo avanço/retorno em vídeo e alternativa móvel reduzida.

O modelo é deliberadamente uma escultura facial genérica em cobre, sem promessa de precisão anatômica ou correspondência à modelo da fotografia. A composição abandona o quadro fotográfico persistente no desktop. Abertura fotográfica, avaliação e contato continuam preservados. Não houve deploy nem alteração da homepage.
