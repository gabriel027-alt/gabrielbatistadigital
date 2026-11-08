# Inferência LivePortrait: primeiro trecho de pose

## Implementação do ensaio

A configuração de rede ativa passou à revisão 5, modo unrestricted/enforced. Uma conexão nova ao Hugging Face respondeu; foram baixados os pesos convertidos `Kijai/LivePortrait_safetensors` na revisão `59f30f36d7b791929c25437df7461d5b0e0010b1`. SHA256 e tamanhos em `models-manifest.json`. Não se presume licença separada dos pesos a partir de metadados ausentes: o retorno da API não trazia campo `cardData.license`. O ensaio é de avaliação, sem integração comercial ou publicação no site.

Código do motor: ComfyUI-LivePortraitKJ, commit `4d9dc6205b793ffd0fb319816136d9b8c0dbfdff`. Inferência em CPU/fp32, PyTorch 2.6.0+cpu e torchvision 0.21.0+cpu. O harness usa os módulos e pesos reais do repositório; não há animação por troca de imagens, simples deslocamento de uma fotografia ou interpolação óptica.

Não foi instalada a interface ComfyUI. O script fornece adaptadores mínimos para serviços de hospedagem usados pelos módulos: seleção de CPU, leitura safetensors, progresso e resize. Ele carrega `DownloadAndLoadLivePortraitModels`, `LivePortraitWrapper`, funções de crop e as redes originais. Tudo fica no runtime Python isolado, fora do Next.js.

Foi corrigido um conflito real de dependências: ONNX recente instalava protobuf 7, incompatível com MediaPipe 0.10.21. O ambiente foi ajustado a ONNX 1.17.0/protobuf 4.25.9; `pip check` passou. Versões efetivas em `requirements-lock.txt`.

## Pose dirigida e preservação da cena

- Fonte: imagem-base aprovada com cachos pequenos e AirPods, `exec-11c43e51-0077-477c-9c14-bb754e6ef5c6.png`.
- Movimento: primeiros 90 quadros de `desk_jm3.mp4`, a 30 fps.
- MediaPipe encontra pontos no recorte da cabeça. Os pontos são projetados de volta às coordenadas da imagem original para calcular o crop.
- O crop do vídeo é fixado pelo primeiro quadro. Recentrar/rotacionar o crop de cada quadro poderia remover parte do movimento que desejamos medir.
- Transformação aplicada: rotação relativa `R_d(t) R_d(0)^T R_s` e translação relativa, mantendo expressão e escala da fonte antes do stitching aprendido. Há uma asserção de que a pose do primeiro quadro coincide com a fonte, antes do stitching.
- O modo Kijai chamado `relative_rotation_only` não foi usado: a inspeção anterior mostrou que ele mantém a rotação fonte nessa revisão. A transformação descrita acima é calculada explicitamente pelo harness, sem alterar o checkout do motor.
- Warping e geração do rosto são feitos pelas redes reais. O resultado passa pela máscara original do motor e é recomposto na imagem-base.
- A linha superior do monitor, y=518 no arquivo-fonte, limita a máscara: o monitor continua no primeiro plano. O enquadramento, cenário e seus objetos não são gerados novamente.
- Não foi utilizado o detector InsightFace nem o arquivo `landmark.onnx` para inferência de pontos neste harness; os 478 pontos vêm do modelo MediaPipe incluído no repositório. O arquivo landmark.onnx baixado não implica uso.

## Limites desta evidência

É um trecho de pesquisa, não um loop final e não uma aprovação de semelhança. A expressão-base está congelada antes do stitching; piscadas e atuação da boca não foram transferidas nesta etapa. Stitching e autoencoder podem introduzir diferenças locais de aparência, que precisam ser examinadas. O teste não certifica estilo idêntico ao Juan, fidelidade anatômica, autoria das capas de álbuns, ou qualidade de 11 segundos de animação.

O MP4 usa H.264 baseline e pixels yuv420p, sem áudio, preservando o enquadramento com escala proporcional. Ainda não substitui o rodapé da rota de revisão. A duração, frame count, medições e capturas devem ser lidas no resultado do ensaio, quando disponível.

## Resultado executado

Inferência concluída: 90 quadros a 30 fps, duração medida de 3,000 segundos. Tempo do loop de inferência/composição: 179,18 segundos em CPU. Arquivo H.264 baseline, 1280 × 818, 360.120 bytes, sem áudio. O ensaio inicial de três quadros passou a asserção de pose fonte; o ensaio de 90 quadros também. Não afirmar tempo real.

Ângulos absolutos estimados pelo extrator no trecho de referência: pitch 7,80°–9,85°, yaw -0,97°–1,95°, roll -0,21°–0,70°. São estimativas do modelo em recorte fixo, não medidas físicas de uma cabeça. Esse pequeno intervalo explica o movimento discreto no primeiro trecho; não foi aumentado artificialmente o ganho para simular uma dança intensa.

Foram inspecionados o primeiro quadro e o intermediário, além da comparação ampliada. O cenário e o monitor mantêm a composição; o rosto apresenta as pequenas alterações de reconstrução esperadas de warping/decoding. A semelhança e a naturalidade ainda precisam da avaliação do usuário. Não expandir silenciosamente para o loop final, adicionar chamas ou trocar o rodapé por este teste.

Artefatos: `gabriel-pose-only-3s.mp4`, `comparacao-pose-3s.mp4`, `frame-mid.jpg`, `pose-trace.json`. A comparação traz cabeças ampliadas e rótulos diagnósticos, que não devem entrar no vídeo final do portfólio. Player HTML e pacote de revisão estão em `/workspace/entrega-gbd/avatar-liveportrait-test/`.

Verificação de reprodução: ambos os MP4 abriram e avançaram no player HTML servido em localhost com Chromium/Playwright. Cena completa: 1280 × 818; comparação: 800 × 400, SAR 1:1. Ambos têm 90 quadros e 3,000 segundos; sem erro de decodificação. O acesso direto file:// é bloqueado pela política administrativa do Chromium deste ambiente, portanto a validação usou HTTP local. Isso não garante que o visualizador de anexos do chat reproduza o arquivo; há link de download e pacote HTML para reprodução local.
