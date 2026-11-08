# Cabeça, olhar e pálpebras coordenados

Pesquisa de 08/11/2026, solicitada após o usuário observar que as íris não acompanham a atuação como na referência. Escopo desta etapa: buscar implementações específicas no GitHub, verificar código/manutenção/licença e preparar dados de atuação. Não foi produzido outro filme final nem substituída a integração rejeitada.

## Diagnóstico revisto

Desativar toda a expressão do LivePortrait para conter a boca também remove a atuação ocular. Posição da íris relativa aos cantos dos olhos, abertura das pálpebras, sobrancelhas e pose da cabeça precisam de canais próprios, com o mesmo relógio. A boca pode permanecer na forma neutra aprovada enquanto os olhos atuam. Sem essa separação, corrigir o movimento da cabeça não resolve a naturalidade.

O recorte comparativo mostra oito instantes da referência e de v1, com os centros de íris estimados marcados em vermelho. Os recortes seguem os olhos; isso remove parte do deslocamento global e permite examinar posição relativa. As duas identidades e proporções são diferentes: a imagem não é um teste de igualdade de pixels nem prova de direção ocular 3D exata. O rastreador foi treinado para rostos humanos; cartoons exigem calibração e revisão visual. Não inferir grau de naturalidade de uma detecção bem-sucedida.

## Fontes verificadas

Commits e SHA256 de cada arquivo consultado em sources-lock.json. Metadados consultados via API GitHub; READMEs e código obtidos em raw.githubusercontent.com. A escolha não foi baseada em estrelas. As buscas por palavras-chave trouxeram muitos projetos sem relação direta; a inspeção abaixo restringe-se ao problema de olhos/cabeça.

### 1. MediaPipe — base recomendada para extrair atuação

https://github.com/google-ai-edge/mediapipe

Código Apache-2.0, repositório ativo na consulta. Em `mediapipe/tasks/web/vision/face_landmarker/face_landmarker.ts`, confirmei constantes das íris e saídas opcionais `outputFaceBlendshapes` e `outputFacialTransformationMatrixes`. Em `mediapipe/tasks/cc/vision/face_landmarker/face_blendshapes_graph.cc`, a lista inclui eyeBlink, eyeLookDown/In/Out/Up, eyeSquint, eyeWide e canais de sobrancelhas separados da boca.

A extração desta etapa usou o runtime Python já instalado 0.10.21 e o task existente no ambiente de pesquisa, não uma instalação do master atual nem o runtime web. Código e pesos são objetos de licença separados; manter a procedência do arquivo de modelo no pacote final. A API fornece estimativas; não reconstrói automaticamente um rig ou a atuação exata do autor.

### 2. three-vrm — base recomendada para aplicar olhar em avatar editável

https://github.com/pixiv/three-vrm

Código MIT; fonte consultada informa pacote 3.5.5; ativo na consulta. `packages/three-vrm-core/src/lookAt/VRMLookAt.ts`, método `lookAt`, transforma a direção do alvo em coordenadas relativas à cabeça pela inversa da orientação mundial. Isso permite manter um alvo no mundo enquanto a cabeça gira, quando esse é o comportamento desejado na referência. `VRMLookAtBoneApplier.ts` aplica yaw/pitch aos ossos leftEye/rightEye com limites internos/externos e verticais. `VRMExpressionManager.ts` separa multiplicadores de blink/lookAt/mouth e respeita overrides de expressões.

Necessita um VRM/rig com olhos e expressões preparados. Não produz o avatar de Gabriel a partir do PNG. Não automatiza, sozinho, todas as correções artísticas das pálpebras nem certifica a aparência humana. Não foi instalado no site ou executado nesta etapa. Para entrega em MP4, pode funcionar somente como ferramenta offline de renderização; não obriga carregar um motor 3D no portfólio.

### 3. TalkingHead — referência concreta de compensação olhos/cabeça

https://github.com/met4citizen/TalkingHead

Código MIT; ativo na consulta. Em `modules/talkinghead.mjs`, bloco `Eye contact`, a rotação da cabeça é convertida em pesos eyesLookUp/Down e eyeLookIn/Out para os dois olhos. README e código também oferecem controles de olhar, valores fixos e animação. Requer GLB com rig compatível e blendshapes específicos. Movimentos idle/contato visual gerados pelo sistema precisam ser desativados ou subordinados à trilha medida se o objetivo for repetir a referência; não ativar aleatoriedade por padrão.

O exemplo `brunette.glb` é identificado no README como CC BY-NC 4.0. Não foi adotado como asset comercial, nem como personagem de Gabriel. A licença MIT da classe não licencia todos os modelos de exemplo. TTS e lipsync não são necessários para este projeto.

### 4. KalidoKit — referência legada, não base nova

https://github.com/yeemachine/kalidokit

MIT, versão npm 1.1.5. O próprio README abre com **officially deprecated**, direcionando soluções para MediaPipe. `src/FaceSolver/calcEyes.ts` contém `pupilPos`, `stabilizeBlink`, `calcEyes` e `calcPupils`; `src/FaceSolver/index.ts` retorna cabeça, olhos, pupila, sobrancelha e boca separados. `docs/script.js` aplica pescoço, blink e pupil-look na mesma atualização de um VRM.

É uma implementação pertinente para estudar, mas os exemplos usam APIs antigas (`blendShapeProxy`, `VRMSchema`, `lookAt.applyer`) incompatíveis com simples cópia para three-vrm 3.5.5. O solver usa ganhos/limiares heurísticos de rosto humano; não copiar os ganhos como calibração do cartoon. Foi instalado isoladamente somente para comparação, com scripts de instalação desativados e lockfile preservado. O entrypoint padrão falhou em Node 24 por import de diretório ESM; o bundle UMD foi executado em contexto VM local. Não foi adicionado à aplicação.

### 5. OpenSeeFace — alternativa de rastreamento

https://github.com/emilianavt/OpenSeeFace

BSD-2-Clause para código/modelos conforme README; dependências possuem suas próprias licenças. README e `tracker.py` confirmam tracking CPU, estado dos olhos, gaze/blink e features de sobrancelhas. É alternativa se os dados de íris do MediaPipe não forem satisfatórios após inspeção. Não foi instalado ou testado no cartoon. Treino com olhos humanos/sintéticos não comprova adequação ao estilo do Juan.

### Não adotar nesta base

https://github.com/cgtinker/BlendArMocap — o README declara **Discontinued**, apesar de o campo archived da API ser false. GPL-3.0, usa MediaPipe e Rigify; serve como referência de transferência para Blender, mas não como nova dependência mantida.

Outras consultas: VTuber_Unity e MeFaMo estão arquivados; FasterLivePortrait não resolve por si só a separação coordenada dos olhos. Interpolação de frames não fornece gaze correto. A pesquisa Rocketbox confirma modelos rigados e blendshapes sob MIT declarada pelo README, mas esses rostos não são Gabriel nem o estilo aprovado; não foram adotados para preencher essa lacuna de identidade.

## Evidência executada

- Extraídos **333/333 quadros**, 30 fps, 11,1 s, crop `[820,320,1240,720]` do `desk_jm3.mp4` já fornecido pelo usuário.
- Preservados a cada timestamp: matriz da cabeça, 14 canais oculares (direção, abertura, squint/wide), cinco de sobrancelhas e saída do solver legado como comparação.
- `reference-coordinated-controls.json` contém estimativas de atuação. Não contém um avatar 3D, um rig recuperado, parâmetros calibrados de identidade nem um filme final.
- `iris-summary.json` registra 111 amostras por vídeo para a comparação de posição de íris relativa aos cantos. Largura mediana por olho: aproximadamente 40 px na referência e 25 px em v1. Isso limita a precisão; não confundir ampliação do crop com novos detalhes.
- As faixas de pupilX/pupilY do solver legado são não constantes, mas não são graus de rotação de um olho real nem uma aprovação de naturalidade.

## Decisão e critério para a próxima prova

Usar Face Landmarker para extrair canais independentes e um rig editável para aplicar a atuação; three-vrm é a opção web estudada em código. TalkingHead é referência de compensação, não obrigação de importar sua pilha de fala. Para renderização offline em Blender, o mesmo contrato de canais pode ser adaptado ao rig correspondente, sem adicionar motor ao site. Blender 4.3.2 está disponível neste ambiente, mas não foi criado/importado um rig de Gabriel nesta etapa.

Antes de renderizar outro loop, a peça pendente é um **modelo 3D de Gabriel no estilo aprovado**, com cabeça/pescoço, olhos giráveis, pálpebras compatíveis, sobrancelhas, boca controlável e oclusões corretas. Nenhum dos repositórios estudados cria automaticamente esse modelo fiel a partir da imagem.

Critérios de aceitação para uma prova curta: boca sem articulação involuntária; cenário inalterado fora de oclusões; trajetória e fase da cabeça comparadas à referência; deslocamento relativo das íris revisado dentro da abertura palpebral; blink no tempo da referência; ausência de conflito entre controle por ossos e blendshapes de direção; continuidade dos dois olhos; rotação/posição e enquadramento estáveis no monitor. A emenda do loop deve preservar continuidade de velocidade, não apenas igualar o primeiro e último quadro. Só ampliar após a avaliação conjunta desses critérios. Não apresentar detecção, licença ou README como validação do resultado artístico.
