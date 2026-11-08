# Estudo de volume, movimento e luz

## Motivo e estado

O usuário rejeitou a prova anterior: a cabeça parecia pular, sem a dimensão e os reflexos da referência. A auditoria confirmou duas limitações da base anterior: posição forçada pelo centro facial em imagem e material de aparência emissiva/preiluminada. A malha frontal rasa não equivalia a uma cabeça anatômica iluminada.

Foi preparado outro estudo de três segundos. **Não é uma réplica final aprovada**, nem recuperação do rig, da câmera ou das luzes originais. A aparência/perfil ainda são inferidos e a avaliação estética continua pendente. A homepage, a rota editorial e os vinte projetos não foram alterados ou publicados.

## Alterações

- Base de cabeça e pescoço da malha MPFB CC0 já disponível, com cerca de 4.543 vértices e 8.650 polígonos. A disposição frontal das feições foi ajustada por correspondências de landmarks/RBF à imagem aprovada. Mantida profundidade anatômica da base, com extensão de couro cabeludo para a silhueta do cabelo. Não são fios individuais reconstruídos. Perfil não observado continua sendo uma inferência da base, não o perfil verdadeiro de Gabriel.
- Aparência da imagem aprovada usada como referência/texture projection. Estimativa limitada de albedo por ajuste robusto de iluminação difusa de segunda ordem em harmônicas esféricas sobre normais de pele. Isso não recupera perfeitamente iluminação e reflexos gravados na imagem.
- Material de pele Principled BSDF, roughness 0,60, resposta especular moderada e sem autoemissão; couro cabeludo mais fosco. Luz de área principal quente à direita, preenchimento frio de monitor à esquerda e recorte vermelho suave. Posição/potência das luzes são fixas; não são flashes animados ou glow de tela aplicado ao rosto.
- Câmera em perspectiva. Posição e rotação vêm da mesma sequência métrica MediaPipe. Alinhamento canônico para a base nativa, normalização do enquadramento pela distância entre cantos oculares e preservação da variação fracionária de profundidade. Sem impor ao rosto um centroide 2D. A câmera virtual é calibrada como aproximação; não confundir com os parâmetros originais do autor.
- Olhos com controles independentes por interseção raio/esfera, pálpebras/sobrancelhas por canais separados. A boca não recebe fala/jaw; foi coberta a abertura neutra da base anatômica com a textura labial aprovada, presa à cabeça. A projeção/oclusão dos lábios ainda varia com o ângulo e não equivale a pixels invariantes.
- Cenário fotográfico e monitor seguem fixos. O monitor é oclusor frontal; pescoço contínuo se estende por trás dele. Sem animação aleatória, ganho arbitrário de giro, novas piscadas inventadas, áudio ou chamas.

## Fontes e licença

Base: https://github.com/met4citizen/TalkingHead/blob/1563de184c19b310de4b636664d5835e2c74dbba/avatars/mpfb.glb — atribuição CC0 específica no README da revisão, também preservada em `public/models/aura-character/NOTICE.txt`. Reutilizada somente a geometria anatômica neutra da versão já preparada no projeto; roupas, cabelo ponytail e persona de exemplo não foram adotados. A imagem frontal continua sendo a personagem aprovada do usuário.

Face Geometry: https://github.com/google-ai-edge/mediapipe/blob/03322747e96377e6ee40b51f038b4c108add7774/mediapipe/modules/face_geometry/data/canonical_face_model.obj — Apache-2.0, SHA256 `8bac80443397e113f41a8b565ea72c59390bc031d9defab289dba7bc0c54e618`, usado para alinhamento/calibração. Licença incluída. Runtime de tracking existente MediaPipe 0.10.21. Blender 4.3.2, Eevee em CPU/software; nenhuma dependência adicionada ao site.

O método solvePnP foi auditado a partir do padrão usado no OpenSeeFace, mas sua rotação discordou da inclinação aparente do cartoon. **Não foi usada na atuação final.** O baixo erro de reprojeção desse teste não comprova orientação correta. A atuação usa uma única sequência métrica do Face Landmarker, não mistura os dois rastreadores.

O projeto compphoto/Intrinsic foi consultado para remoção de iluminação, mas sua licença restringe uso acadêmico. Não foi instalado, executado ou incorporado. A preparação de textura desta etapa usa o ajuste matemático limitado descrito acima, não aquele software/modelo.

## Evidência e limites

- 90 quadros renderizados de fato, 30 fps, 1280×818, H.264 baseline/YUV420p, sem áudio. Renderização com 32 amostras, aproximadamente 451 s em CPU. Sem interpolação de frames ou emenda de loop.
- `study-checks.json`: volume de profundidade em repouso de aproximadamente 2,34 unidades; câmera PERSP; três luzes fixas; pele com autoemissão RGB zero; nenhuma animação de escala; deslocamento por shape keys zero na região labial examinada. Esses controles não certificam naturalidade ou semelhança.
- `composition-verification.json`: diferença bruta máxima zero no recorte visível de álbum examinado; `crop-boundary-check.json`: diferença zero nos três pixels externos da região renderizada, sem evidência de movimento cortado nessa borda.
- `browser-checks.json`: comparação e vídeo completo reproduziram em Chromium nos tamanhos 1440×900 e 390×844, sem erro de mídia ou overflow. Isso não certifica todos os dispositivos.
- `independent-check.json`: 30 amostras por MediaPipe nos primeiros três segundos. Correlação XYZ com a referência aproximadamente 0,829 / 0,858 / 0,853; amplitudes 2,41° / 1,07° / 1,18°, contra 2,65° / 1,77° / 1,60° na referência. **Ainda existem diferenças de amplitude e leitura do movimento; não declarar igualdade.** Estilos/identidades/profundidades e iluminação afetam a estimativa.
- Abertura labial rastreada variou 0,0321; isso não é evidência de fala, mas impede alegar aparência labial invariável. Refração/reflexos oculares ainda não foram reconstruídos como no original; a textura ocular mantém elementos pré-iluminados.

A nova base remove limitações estruturais do ensaio anterior, mas ainda necessita ajuste artístico de semelhança, material e movimento. Não confundir a presença de geometria/luzes ou testes aprovados com acabamento final de agência/Awwwards.

## Arquivos

`gabriel-volume-light.blend`: texturas empacotadas, pose na timeline 1–333, primeiro quadro selecionado; render padrão 32 amostras. `gabriel-volume-light-3s.mp4`: primeiros 90 quadros. `comparacao-3s.mp4`: referência à esquerda, novo estudo à direita.

Os scripts usam caminhos absolutos do ambiente e entradas existentes do projeto; exigem adaptação para execução fora dele. O Blender e os vídeos são artefatos portáteis. Os frames completos temporários não foram incorporados ao site.
