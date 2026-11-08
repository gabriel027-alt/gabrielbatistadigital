# Prova de rig facial parcial

## Escopo

Continuação autorizada após a busca de sistemas coordenados de cabeça/olhar. Foi criado um arquivo **editável no Blender**, com aparência projetada da imagem aprovada e profundidade estimada, olhos 3D separados, controles de pálpebras e sobrancelhas. A prova renderizada tem **3 segundos / 90 quadros reais / 30 fps**, 1280×818, H.264 baseline, YUV420p, sem áudio. A comparação mostra Juan à esquerda e o ensaio à direita. Não há fechamento artificial de loop neste trecho. A aplicação e o vídeo de revisão anteriormente integrado não foram alterados.

Isso é uma malha frontal parcial: **não é um avatar completo reconstruído**, não recupera o rig original do Juan e não garante equivalência de movimento. Ainda necessita avaliação estética. Não ampliar para o filme inteiro com base só nos testes técnicos.

## Construção e fontes

- Imagem aprovada: a mesma preservada em `../expression-loop/source-base.png`. Não foi regenerado o rosto/cabelo nem adotado personagem de outro autor.
- MediaPipe Face Landmarker 0.10.21 já instalado, com o mesmo task do ambiente de pesquisa: 468 pontos faciais com profundidade estimada e dez pontos de íris. Delaunay nos pontos e na extensão amostrada do contorno segmentado; cerca de 1.713 vértices / 3.329 triângulos. A profundidade fora da face, em cabelo/orelhas, é extrapolada. Não há modelagem volumétrica dos cachos nem vistas laterais recuperadas.
- A segmentação MobileSAM da etapa anterior recorta a aparência aprovada. Pequenos furos internos foram preenchidos para a textura alpha. O cenário é uma placa fixa preparada uma vez. O monitor original fica como oclusor à frente. A ligação do pescoço tem base fixa e topo vinculado à cabeça por Hook.
- Olhos: esferas com textura da própria imagem projetada na pose neutra e rotação independente. Não são círculos deslocados no MP4. A iluminação/reflexos estão gravados na textura; não equivalem a olhos com material e iluminação física totalmente reconstruídos.
- Pálpebras: shape keys locais na malha; sobrancelhas: shape keys locais distintas. Nenhum controle de fala/jaw/visema. A boca mantém a geometria da imagem-base e apenas acompanha a transformação global da cabeça.

A implementação usa **Blender 4.3.2 offline** e dados MediaPipe. Os padrões de separação de canais e coordenação foram consultados nos repositórios documentados em `../coordinated-gaze/README.md`; não foram executados three-vrm ou TalkingHead para esta renderização. Não foi necessário adicionar motor ou dependência à aplicação Next.js.

Fonte oficial adicional de coordenadas: https://github.com/google-ai-edge/mediapipe/blob/29d3038de5e0532868b2e982ce3d5b5c9757c8f7/docs/solutions/face_mesh.md — seção **Metric 3D Space**. A matriz facial já usa o espaço métrico de câmera, com orientação para -Z. Isso é distinto dos eixos dos landmarks normalizados da imagem. Uma inversão indevida em dois eixos foi encontrada por rastreamento independente e corrigida antes deste MP4; a prova anterior não foi entregue como resultado final.

Blender é software GPL, e a licença do software não transforma automaticamente a imagem ou o MP4 autoral em código GPL. Manter procedência/licenças dos motores e do task de rastreamento já descritos nas etapas anteriores. Nenhum modelo 3D de exemplo de outro personagem foi incorporado.

## Atuação

Os 333 quadros da referência alimentam a cena editável. Foram renderizados os primeiros 90.

- Cabeça: rotação relativa à matriz inicial da referência, com eixos corrigidos. O deslocamento usa o centro de pontos estáveis e escala medida entre os cantos externos dos olhos das duas identidades; não foi atribuído ganho arbitrário para disfarçar tracking.
- Olhos: deslocamento de íris em coordenadas locais dos cantos oculares, relativo ao primeiro quadro, normalizado pela largura do olho e convertido em alvo projetado. A rotação do globo é resolvida após descontar a orientação/posição atual da cabeça: direção mundial do alvo → inversa da rotação da cabeça → quaternion do olho. Assim não se soma novamente a rotação da cabeça ao deslocamento de íris. Os cantos dos olhos ficam fixos nos controles de pálpebras. Sem atuação aleatória.
- Pálpebras: razão entre abertura medida e abertura inicial. Sobrancelhas: deslocamento vertical normalizado em relação ao olho. São estimativas de tracking em cartoon; ainda não são parâmetros artisticamente calibrados de um modelo completo.
- Todos os canais usam o mesmo frame e timestamp. Não foram acrescentadas piscadas, fala, chamas ou curvas sinusoidais independentes.

## Verificação

- `rig-verification.json`: texturas empacotadas; olhos são objetos giráveis; vértices da boca examinados tiveram deslocamento **zero** nos controles de pálpebras/sobrancelhas. Isso não significa que pixels da boca sejam invariantes quando a cabeça gira.
- `composition-verification.json`: nenhum quadro repetido foi inserido deliberadamente; diferença bruta máxima **zero** no recorte visível do álbum Iron Maiden verificado. A checagem cobre esse recorte; oclusão legítima pelo movimento da cabeça continua permitida.
- `independent-check.json`: MediaPipe a cada terceiro quadro, 30 amostras dos primeiros três segundos. Correlação temporal com a referência nos ângulos XYZ: aproximadamente **0,884 / 0,751 / 0,915**. As amplitudes são aproximadamente **3,21° / 1,45° / 1,87°**, contra **2,65° / 1,77° / 1,60°** na referência. Identidades/estilos diferentes e profundidade aproximada limitam essa medição; não declarar movimentos idênticos ou naturalidade validada.
- Variação da razão rastreada de abertura labial: 0,00567 contra 0,05876 em v1. Pode incluir projeção/ruído do detector; a ausência de articulação é verificada nos controles da malha.
- `gaze-projection-check.json`: a projeção do ponto de textura de cada íris no rig ficou a menos de 0,00014 pixel do alvo matemático medido, em 90 quadros. Isso verifica conversão de coordenadas e hierarquia, **não** igualdade dos pixels renderizados ou naturalidade.
- `iris-correlation.json`: no rastreador de íris aplicado ao MP4, correlações XY de aproximadamente 0,779 / 0,700 no olho direito e 0,823 / 0,456 no esquerdo. O componente vertical esquerdo ainda diverge e requer calibração artística da geometria/textura/pálpebra; não considerar a atuação ocular finalizada. A resolução pequena e o detector para humanos também limitam essa leitura. A correção matemática de alvo não deve ser confundida com aprovação do resultado visual.
- `browser-checks.json`: comparação e enquadramento completo reproduziram em Chromium, 1440×900 e 390×844, duração 3 s, sem erro de mídia ou overflow. O teste usou servidor local; a política do navegador gerenciado bloqueou `file://`. Isso não certifica reprodução no dispositivo pessoal do usuário nem aprova a animação esteticamente.

## Uso do arquivo

`gabriel-partial-rig.blend` contém texturas empacotadas e os controles animados, sem depender do ambiente Python para abrir. Câmera fixa; timeline 1–333. O MP4 corresponde a 1–90. Renderizar F12 ou entrar na câmera para revisar; os controles da cabeça e dos olhos são objetos nomeados, e pálpebras/sobrancelhas são shape keys da malha parcial. Não exportar este arquivo como se fosse um VRM humanoide completo.

Os scripts de preparação usam caminhos absolutos deste workspace e dependências existentes; precisam de adaptação para outra máquina. O arquivo Blender e os vídeos são os artefatos portáteis de revisão. A etapa não inclui cabelo volumétrico, perfil, novas vistas, boca falante, chamas nos olhos, rock licenciado, loop final ou integração no portfólio.
