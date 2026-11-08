# Primeiro teste: detecção e pontos faciais

Executado em CPU com MediaPipe 0.10.21, usando o modelo `face_landmarker_v2_with_blendshapes.task` já incluído no checkout ComfyUI-LivePortraitKJ, commit `4d9dc6205b793ffd0fb319816136d9b8c0dbfdff`. Não usa InsightFace. O teste chama a API oficial MediaPipe diretamente; ainda não instancia o cropper completo do Kijai, que também precisa de `landmark.onnx` externo.

## Resultado medido

- Avatar de Gabriel em cena completa: nenhum rosto detectado.
- Avatar no recorte manual `[650,245,920,540]`: 478 pontos encontrados.
- Referência completa: detecção em 0 dos 90 quadros iniciais.
- Referência no recorte manual `[820,320,1240,720]`: detecção em 90 dos 90 quadros, a 30 fps, três segundos.
- Confianças mínimas configuradas para detecção, presença e tracking: 0,5. Não confundir esses limites com escores medidos de semelhança.
- A API foi usada em modo IMAGE por quadro: 90 detecções não certificam rastreamento temporal estável ou a qualidade de uma animação.
- Imagens diagnósticas examinadas mostram pontos sobre olhos, nariz, boca e contorno dos rostos esperados. Pontos faciais não incluem cachos e AirPods; esses elementos ainda exigem avaliação de deformação no vídeo renderizado.

Esses números validam somente o pré-requisito de localização de rosto. Não há MP4 de Gabriel animado, transferência de pose, preservação de identidade ou aprovação estética neste teste. A imagem-base não foi modificada; os recortes com pontos são somente diagnósticos.

## Bloqueio de inferência

O nó Kijai `DownloadAndLoadLivePortraitModels` usa `Kijai/LivePortrait_safetensors` no Hugging Face. O HEAD ao peso `appearance_feature_extractor.safetensors` retornou `CONNECT tunnel failed, response 403`. O status de ambiente confirma rede restrita e domínio Hugging Face fora da lista permitida. Pesos de extração, deformação, geração, stitching e landmark não foram baixados. Não se tentou rota alternativa para contornar o bloqueio.

É necessária liberação de `huggingface.co` nas configurações de rede deste ambiente para consultar os pesos e, se o download redirecionar, do domínio CDN indicado pela resposta. Não há GPU NVIDIA configurada; o pré-teste foi em CPU. Uma renderização em CPU deve ser medida, sem alegar tempo real ou prometer duração.

## Detalhe de código relevante antes de executar

Na revisão Kijai consultada, `relative_rotation_only` não deve ser usado apenas pelo nome: `liveportrait/live_portrait_pipeline.py`, linhas 156–160, mantém `R_new = R_s`. O ramo `relative` também transfere diferenças de expressão. Para um teste estritamente de pose relativa, revisar/ajustar a seleção da transformação antes de renderizar; não afirmar que desativar eye/lip retargeting por si só congela toda expressão. Ainda não foi aplicada uma modificação no motor.

## Reprodução

`probe_landmarks.py --source <imagem-base> --driving <desk_jm3.mp4> --model <face_landmarker_v2_with_blendshapes.task> --output <pasta-nova>`

Ambiente isolado: `/workspace/library-files/tool-runtimes/avatar-motion/.venv`. Arquivo de versões efetivas, logs e traços dos 90 quadros em `/workspace/library-files/tool-runtimes/avatar-motion/test-3s/`. O modelo e código vieram do repositório indicado; não estão incluídos no site nem no runtime Next.js. Nenhuma publicação ou instalação global foi realizada.
