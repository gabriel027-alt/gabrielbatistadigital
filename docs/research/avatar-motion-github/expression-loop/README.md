# Loop próprio: expressão e piscadas

## Continuação autorizada

Após a entrega do teste de pose de três segundos, o usuário pediu para continuar. Foi preparado um ensaio de expressão e fechamento dos olhos; o loop completo segue a mesma imagem-base, sem redesenhar cenário ou personagem. Integração limitada à rota `/propostas/portfolio-editorial`, mantendo homepage e catálogo.

## Método

Motor/arquitetura e pesos são os mesmos da etapa `inference-3s`. Head pose é extraída do vídeo `desk_jm3.mp4` com crop fixo. O loop usa os 333 quadros do arquivo original, a 30 fps, duração de 11,1 segundos.

A rotação e a translação são relativas ao primeiro quadro. Escala e keypoints canônicos da identidade são preservados. A expressão usa diferenças relativas do vídeo, com ganho 0,65 e suavização gaussiana temporal de sigma 0,65 quadro; os ângulos usam sigma 0,8. Esses parâmetros são decisões deste ensaio, não configurações certificadas pelo autor do modelo.

Foram adicionadas duas piscadas, centradas em 2,8 s e 7,3 s. Não afirmar que essas piscadas foram copiadas exatamente do Juan. O fechamento é calculado pela rede de retargeting de olhos do LivePortrait, usando proporções medidas por landmarks de 203 pontos na imagem-fonte. A curva da piscada dura 0,23 s e o ganho é 0,9. A rede de landmarks usa o arquivo `landmark.onnx` do pacote LivePortrait; não foi instalado nem usado o detector InsightFace.

Para fechar o ciclo sem dissolver imagens, o movimento é ponderado na entrada por 0,4 s e na saída por 0,7 s com smoothstep. O vetor de rotação relativa é reconduzido a zero; expressão e translação retornam à base. A emenda precisa ser medida nos frames resultantes. Isto modifica a saída da coreografia, não é reprodução quadro a quadro integral do vídeo original.

Mantêm-se máscara do motor, composição sobre a imagem-base e oclusão pelo monitor em y=518. Não há movimento de câmera, reconstrução do quarto nem chamas nos olhos nesta versão.

## CPU e precisão

O decoder SPADE roda sob autocast BF16 para aproveitar suporte AVX512-BF16 da CPU; as outras etapas e a saída permanecem float32. A comparação do primeiro quadro contra o ensaio FP32, na região da cabeça, teve MAE RGB de 0,5215 em escala 0–255 e SSIM médio 0,99365. A comparação usou os JPEGs diagnósticos e não representa uma medição dos tensores brutos. Não é pontuação de semelhança com a pessoa ou aprovação visual.

O trecho de 90 quadros foi renderizado antes de ampliar. Foram examinados o quadro intermediário de expressão e o fechamento de olhos no quadro 86. O fechamento aparece nos olhos mantendo rosto, cabelo e AirPods próximos da base; continua sujeito à avaliação estética do usuário.

## Licenças e procedência

A API do modelo oficial `KlingTeam/LivePortrait`, revisão `82a4fa6735ca58432b6ce39301b4b9ee066dea47`, declara licença MIT. A API do pacote convertido Kijai não possui campo próprio de licença; seu README atribui os pesos convertidos ao projeto LivePortrait. O código Kijai mantém licença MIT. Isso atualiza a lacuna documental anterior sem estender a licença a modelos externos não utilizados. Não foram utilizados modelos de detecção InsightFace.

## Integração de revisão

`EditorialAvatarLoop` mantém poster estático sem JavaScript e só atribui o src do vídeo ao chegar ao rodapé, quando movimento e economia de dados permitem. Pausa fora da tela, em aba oculta, ao abrir diálogo de filme e pelo controle global de movimento. Erro de mídia mantém poster. `prefers-reduced-motion` e saveData evitam download do loop. O brilho vermelho permanece na camada CSS separada da mídia.

`/propostas/portfolio-editorial/previa` oferece player manual do loop e download. A gravação antiga da página é identificada como anterior ao novo encerramento até a atualização de captura. A integração é revisável, sem deploy ou alteração da homepage principal.

## Resultado e conferência

Renderização completa concluída em CPU: 333 quadros, 30 fps, 11,1 segundos, cerca de 487 segundos de processamento do ensaio. Arquivo final: H.264 baseline, 1280 × 818, 1.121.196 bytes, sem áudio. A emenda nos frames brutos teve MAE e erro máximo iguais a zero. Após compressão, a diferença entre primeiro/último quadro decodificado foi MAE RGB 0,697 no quadro e 1,693 no recorte da cabeça, em escala 0–255; não anunciar que os frames comprimidos são idênticos.

Um rastreador MediaPipe independente foi aplicado a cada terceiro quadro: 111 detecções na referência e 111 no resultado. As amplitudes estimadas sugerem movimento mais contido no avatar, especialmente no eixo x (intervalo 2,17° no resultado contra 4,65° na referência). São estimativas entre personagens diferentes, não medidas físicas, prova de correlação temporal perfeita ou reprodução idêntica. Dados em `tracking-comparison.json`. A direção aprovada nesta versão mantém movimentos sutis; não aumentar artificialmente o ganho sem avaliar o resultado.

No navegador Chromium, desktop 1440 × 900 e móvel 390 × 844 reproduziram duas voltas naturais cada, sem eventos stalled ou error. O vídeo ficou mudo e continuou reproduzindo. O rodapé ocupou a altura de cada viewport, sem transbordamento horizontal. Evidência em `docs/preview/editorial-avatar/browser-checks.json` e capturas na mesma pasta.

Foram corrigidos dois problemas encontrados durante a inspeção: o hash direto para o rodapé não era aplicado após a inicialização do Lenis; e a altura móvel de 90svh deixava uma faixa da seção anterior visível. O hash é tratado após carregar fontes/atualizar geometria, com cancelamento no cleanup; o palco móvel passou a 100svh. O retorno ao início também foi afastado do controle fixo de pausa.

O player de revisão fornece o loop atualizado separadamente. A gravação geral anterior da página permanece identificada como anterior ao novo encerramento, evitando apresentá-la como registro atualizado da integração.

Validação final após corrigir hash, altura e controles: build e lint passaram; 13 testes Playwright passaram, incluindo retorno ao início por clique, link direto no desktop/móvel, reprodução cíclica, pausa fora da tela, poster sem JS/movimento reduzido/saveData e falha de mídia. As capturas finais foram atualizadas. O link de retorno não intercepta nem é encoberto pelo botão de pausa (`final-framing.json`: overlap=false em ambos os tamanhos). O navegador usado foi Chromium neste ambiente, não Safari/iPhone físico.

## Rejeição posterior do usuário

A versão foi rejeitada por boca articulando, álbum movendo e cabeça com coreografia diferente. Testes de playback/emenda não validam fidelidade. Diagnóstico e ensaios corretivos, ainda sem equivalência suficiente para substituir a integração, em `../correction-study/README.md`.
