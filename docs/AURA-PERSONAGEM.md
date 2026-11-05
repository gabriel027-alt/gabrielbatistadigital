# Prova isolada: personagem viva

Brief: uma personagem inteira visualmente coerente, com piscar/respiração discretos, aproximação de câmera e uma transformação regional reversível. Somente zigomático nesta unidade; não expandir para demais áreas antes da inspeção. Rota separada /propostas/aura/personagem, sem substituir Aura.

Fonte: GLB MPFB do TalkingHead, revisão 1563de184c19b310de4b636664d5835e2c74dbba, atribuído CC0 no README. Base independente da fotografia editorial. Não prometer identidade com a modelo nem realismo fotográfico. Preparação Blender 4.3.2 offline, três morphs no corpo (dois de piscar e um de projeção malar). Alteração de design manual, não previsão clínica ou resultado de procedimento. Identificação visível “Simulação ilustrativa”.

Direção: palco único de retrato sem moldura, fundo castanho escuro #201714, texto claro #f2f1eb e acento #ff704d já usados no Aura; luz principal neutra e recorte quente. Tipografia Manrope existente, título em duas linhas, controles discretos. Não adicionar cartões ou indicadores sem função. A área facial deve continuar sendo o protagonista em todos os estados.

Roteiro: apresentação frontal, movimento sutil e olhos vivos → câmera em três quartos e aproximação malar → morph suave com leitura da projeção → retorno ao rosto inteiro. Scroll nativo, sem bloquear navegação; controle manual acessível para comparar estados mantendo a câmera parada. Movimento reduzido e pausa: interromper movimentos automáticos, conservar controle explícito. Mobile: palco curto e controle manual, sem exigir longa rolagem. Sem JS/WebGL: retrato estático da mesma personagem, textos e navegação disponíveis.

Critérios: geometria realmente muda no GLB; olhos piscam; câmera gira e aproxima sem deformar o rosto; morph reverte; pausa interrompe animação contínua; falha de asset/contexto retorna ao retrato; uma instância de canvas; sem overflow; lint/build/Playwright e inspeção renderizada. Não confundir prova técnica com aprovação estética. Meta provisória de asset <5MB, DPR <=1.5, render até 30fps e pausa fora da tela/aba oculta; medidas finais e limitações registradas ao concluir.

## Preparação e limitações do asset

Entrada fixada: https://raw.githubusercontent.com/met4citizen/TalkingHead/1563de184c19b310de4b636664d5835e2c74dbba/avatars/mpfb.glb . SHA256 conferido por download da revisão fixada: 63c645a2a863b9972e9a9c2ed576a1de4c390b8475508e1473e69c87a3ee299c. Fonte e atribuição CC0 em public/models/aura-character/NOTICE.txt; não reutilizados os exemplos com restrição não comercial. Script local scripts/assets/prepare-aura-character.py recebe fonte e destino, sem download implícito.

Pipeline executado: Blender 4.3.2 → glTF Transform CLI 4.5.1 (MIT, instalado somente em /tmp, nenhuma nova dependência da aplicação) → WebP qualidade 85 → resize máximo 1024. Comandos: `gltf-transform webp raw.glb webp.glb --quality 85`; `gltf-transform resize webp.glb character.glb --width 1024 --height 1024`. Saída: 4.576.056 bytes contra 36.815.920 da entrada. Isso é peso do asset, não do carregamento total nem memória de GPU. Origem e estatísticas em provenance.json. A redução de textura limita a qualidade nos closes e precisa ser reconsiderada junto ao asset final.

O morph malar foi preparado offline por deslocamento suave localizado de vértices, com máximo aproximado de 0,0046 unidade do modelo. Não é dado de paciente nem simulação biomecânica. Não se atribui o deslocamento a mililitros, técnica de aplicação ou efeito clínico. Não é o morph cheekPuff reaproveitado como procedimento.

Khronos Validator: zero erros, oito avisos NODE_SKINNED_MESH_NON_ROOT e duas informações de UV não utilizado. Relatório integral em research/aura-character-validation.json. Os avisos são da hierarquia skinned mesh exportada; a animação atua no esqueleto e nos morph targets e precisa ser inspecionada no runtime, não se presume conformidade perfeita do asset. Blender também avisou sobre samplers compartilhados; nenhuma compressão Draco utilizada. Não foram ignorados erros para declarar o modelo aprovado.

A pele e o cabelo da base mantêm aparência de avatar. A prova não valida equivalência com fotografia nem acabamento editorial premium. O retrato estático foi renderizado da mesma personagem em Blender Cycles, não é a fotografia anterior. Renderizações automáticas do browser usam iluminação distinta da imagem estática.

Runtime: Three.js existente, sem instalar TalkingHead/Fiber/Drei. Ambiente RoomEnvironment gerado localmente, sem HDR remoto. Piscar, giro sutil da cabeça e pequeno movimento vertical; câmera percorre frontal/três quartos/retorno. Ritmo máximo de15 quadros/s para movimento sutil (não é taxa medida/garantida). Frame loop suspenso com pausa, movimento reduzido, aba oculta, região fora da tela ou perda de contexto. Interação explícita continua nos modos estáticos. Mobile usa controle manual em palco curto, sem scroll longo.

A inspeção do teste com SwiftShader mostrou renderização contínua muito custosa em 1440×1000: os checks de comparação/reversão avançavam, mas o conjunto excedia 90s antes de concluir a pausa/auditoria. Ajuste implementado: detecção explícita de renderizador por software (SwiftShader/llvmpipe/softpipe) reduz o pixel ratio para 0,5 e limita a animação sutil a 5 quadros/s nesse modo. Renderização padrão conserva DPR<=1,5 e limite 15. Isso é degradação deliberada para manter controles responsivos, não evidência de fluidez em hardware real. A gravação da nuvem usa esse modo reduzido.

## Verificação — 04/11/2026, America/Sao_Paulo

Lint e build de produção aprovados, incluindo TypeScript. Três novos testes Playwright passaram em 57,6s no Chromium/SwiftShader: comparação de pixels com câmera fixa entre morph 0 e 1; retorno ao mesmo frame inicial; pausa estável; avanço/retorno de scroll; axe nos critérios WCAG selecionados; movimento reduzido; larguras 360–1440px sem overflow; perda de contexto; asset bloqueado; conteúdo/navegação sem JavaScript. Os cinco testes anteriores da rota Aura também passaram na execução precedente; não houve alteração da rota principal nesta unidade. A passagem técnica não aprova a estética do modelo.

Sem teste em GPU física/celular real ou certificação de desempenho. Não há resultado de paciente, ganho clínico medido ou validação anatômica. Rota isolada /propostas/aura/personagem; manter /propostas/aura e homepage. Sem deploy.

Evidência visual: preview/aura-character/ contém retrato, comparação com câmera fixa, composição móvel e desktop.mp4. Vídeo exportado H.264/YUV420p com faststart; reprodução acelerada 2,5x a partir de captura original de 153,2s em WebGL por software. A velocidade do vídeo não é medida de fluidez nem a cadência normal de scroll. Captura sem erros de página. Não usar as duas formas digitais como antes/depois de paciente.
