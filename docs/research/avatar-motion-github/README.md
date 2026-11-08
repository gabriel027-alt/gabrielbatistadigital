# Transferência de movimento para o avatar de Gabriel

## Objetivo e limites

Imagem de referência: `exec-11c43e51-0077-477c-9c14-bb754e6ef5c6.png`, rosto em avatar, cachos pequenos, AirPods brancos, cenário vermelho. Movimento: `desk_jm3.mp4`, 11,1 s, 30 fps, avatar pequeno atrás do monitor. O usuário rejeitou a interpretação livre feita pelo Flow. Precisamos dirigir pose e expressão a partir do vídeo, preservando aparência e cenário.

Foram lidos READMEs, licenças e trechos de configuração/código diretamente do GitHub bruto. A API GitHub retornou erro de túnel; não foi verificado commit corrente, atividade recente ou estado dos issues. Inventário de conteúdos e SHA256 em `sources.json`. Fontes completas estão fora do app em `/workspace/library-files/research/avatar-motion-github/`. Não foi instalado runtime de inferência nem baixado peso de modelo.

## Primeiro candidato: LivePortrait com ComfyUI-LivePortraitKJ

Fontes: https://github.com/KlingTeam/LivePortrait e https://github.com/kijai/ComfyUI-LivePortraitKJ

O projeto base implementa animação dirigida por imagem/vídeo, movimento relativo, controle regional e recomposição do recorte na imagem original. Confirmado em `src/config/argument_config.py`: `flag_relative_motion`, `flag_pasteback`, `animation_region` (pose/exp/lip/eyes/all), `driving_multiplier`. A licença base é MIT para o código e alerta explicitamente que os modelos de detecção InsightFace são para pesquisa não comercial.

A integração Kijai fornece nós ComfyUI para image-to-video, vid2vid, suavização, detectores alternativos e carregamento de pesos convertidos. O README informa MediaPipe como alternativa para evitar o detector InsightFace; também documenta face-alignment/blazeface_back_camera para rostos pequenos. O arquivo `nodes.py` confirma controles como `relative_motion_mode`, `relative_rotation_only` e `expression_friendly_multiplier`. Não presumir que opções de uma implementação tenham exatamente o mesmo nome na outra.

Licença do código Kijai: MIT. O autor declara cobertura MIT/Apache-2.0 para o caminho MediaPipe, mas a seleção e procedência dos pesos concretos continuam precisando ser conferidas antes da entrega comercial. Não instalar o detector padrão InsightFace automaticamente. `requirements.txt` inclui onnxruntime-gpu, mediapipe, onnx2torch, OpenCV, pykalman e numpy<=1.26.4; além do ComfyUI/PyTorch. Instalar em ambiente isolado, não no Next.js.

**Hipótese de adequação:** é o teste inicial mais proporcional, pois a câmera e o ambiente ficam parados e a atuação relevante é facial. Não há teste deste avatar nem garantia de tracking em Memoji; a detecção em ambos os desenhos é a primeira condição a verificar.

## Alternativa de execução: FasterLivePortrait

Fonte: https://github.com/warmshao/FasterLivePortrait

README e licença consultados. Código MIT; modelos têm suas próprias licenças. Oferece execução ONNX/TensorRT, opção MediaPipe e pacote Windows. O README relata 30+ fps em RTX 3090 com TensorRT; isso não é benchmark realizado aqui, não garante tempo real em outra máquina e não significa melhor semelhança. O autor informa CPU extremamente lenta. É alternativa de implantação se houver GPU NVIDIA e o teste LivePortrait funcionar; não é outro modelo que resolva automaticamente falhas do rosto.

## Reserva: Wan2.2-Animate-14B

Fonte: https://github.com/Wan-Video/Wan2.2

README confirma entrada de imagem + vídeo e modos animation/replacement; inclui pipeline Diffusers com `pose_video` e `face_video`. Código/modelos principais apresentados sob Apache-2.0. O guia de pré-processamento exige modelos adicionais de detecção/pose, alerta para deformações e pede inspeção dos resultados intermediários. O corpo oculto atrás do monitor pode ser inadequado para essa preparação de pose; isso precisa de teste.

É uma cadeia de 14 bilhões de parâmetros com pré-processamento adicional e demanda elevada de recursos. Não aplicar a ela requisitos de memória de outros modelos Wan citados no mesmo README. O guia oferece FLUX.1-Kontext-dev como componente opcional; a licença Apache do Wan não cobre automaticamente esse componente e todos os pesos auxiliares. Não habilitar `--use_flux` por cópia automática do exemplo. Não é nossa primeira escolha para um pequeno movimento facial numa cena fixa.

## Não priorizados

- https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait: README confirma edição de expressões e sequenciamento; não foi confirmada licença em um arquivo LICENSE no caminho consultado. Não classificar ausência nesse caminho como prova de inexistência de licença no repositório.
- https://github.com/Tencent/MimicMotion: voltado a movimento corporal por pose; README relata 16 GB de VRAM para demonstração e caminho de 8 GB com decoder no CPU. Menos apropriado para cabeça pequena e corpo oculto, sem necessidade de recriar toda a cena.

## Teste proposto antes de expandir

1. Detectar e revisar visualmente o rosto no avatar-fonte e no vídeo do Juan. Isolar a região da cabeça para análise; ampliar pixels não recupera detalhe ausente.
2. Transferir apenas pose relativa em um trecho de 3 segundos, com detector alternativo ao InsightFace. Recompôr na imagem-base, mantendo cenário, monitor e AirPods.
3. Avaliar aparência em frames e movimento em MP4: cabelo, mandíbula, olhos, oclusão na borda do monitor, fones, saltos e deformações. Comparar sincronização com o trecho de origem. Se detecção ou semelhança falhar, não ampliar para 11 segundos.
4. Só então testar transferência de expressão. Não aumentar o ganho para disfarçar tracking ruim. Se a cadeia continuar falhando em avatares, seguir para rig de avatar editável, sem declarar que REA ou LivePortrait recupera um rig a partir do MP4.
5. Tratar brilho periférico no CSS já identificado e finalizar a emenda de loop separadamente. A origem estar em loop não prova emenda perfeita do novo vídeo.

## Estado de execução

Pesquisa documental e inspeção de trechos de código concluídas. Neste ambiente não foram encontrados `nvidia-smi`, dispositivos `/dev/nvidia*`, PyTorch, OpenCV ou ONNX Runtime instalados. Isso não prova inviabilidade em CPU ou na máquina Windows do usuário; significa que ainda não há runtime pronto nem resultado de inferência para apresentar. Código aberto não implica GPU gratuita nem disponibilidade garantida de demos online. Nenhuma compra, instalação global ou alteração da aplicação foi realizada nesta pesquisa.
