# Pesquisa: personagem viva e transformação facial por scroll

Consulta em 04/11/2026 (America/Sao_Paulo). Pesquisa de fontes primárias via raw.githubusercontent.com; API de busca GitHub bloqueada pelo proxy (403). Esta é uma seleção verificada, não levantamento exaustivo. Nenhuma dependência instalada e nenhuma cena substituída nesta pesquisa.

## Candidatos

- MPFB2: https://github.com/makehumancommunity/mpfb2 . README, LICENSE.md, serviços targetservice.py/rigservice.py/humanservice.py lidos. Gerador humano para Blender >=4.2; targets são deslocamentos de vértices armazenados como shape keys. Código GPLv3; assets incluídos CC0; licença distingue expressamente saídas. Assets comunitários adicionais exigem checagem individual. Ferramenta de autoria, não personagem editorial final pronta.
- TalkingHead: https://github.com/met4citizen/TalkingHead . README, LICENSE e guia blender/MPFB/MPFB.md lidos. Código MIT; GLB, rig Mixamo compatível e blendshapes ARKit/Oculus. Permite expressões, olhar, movimentos e controle direto de blendshapes. Licença do código não cobre uniformemente os avatares de exemplo. brunette.glb: CC BY-NC; mpfb.glb: CC0 conforme atribuição do README. Não incluir fala/TTS, desnecessários para este projeto.
- Microsoft Rocketbox: https://github.com/microsoft/Microsoft-Rocketbox . README e LICENSE.md MIT lidos. Biblioteca anuncia 115 personagens rigados e atualização ARKit/FACS. Origem FBX/texturas, precisa preparar GLB e adaptar rig se usado com TalkingHead. Imagens consultadas mostram estética de avatar de VR, não retrato editorial fotográfico. Não aprovado como visual final.
- ReadyPlayerMe Visage: https://github.com/ReadyPlayerMe/visage . README e licença MIT lidos. Visualizador, não gerador da personagem nem de transformações por região. Não resolve a lacuna do asset.
- DECA: https://github.com/yfeng95/DECA . README restringe código/modelo a pesquisa científica não comercial. Excluído do caminho comercial sem outra licença.

## Verificação concreta

GLB de exemplo https://raw.githubusercontent.com/met4citizen/TalkingHead/main/avatars/mpfb.glb baixado apenas em /tmp. Inspeção estrutural do chunk JSON: 36.815.920 bytes, 8 meshes, 1 skin, 8 materiais, 7 imagens, 0 clips de animação. Possui 66 nomes de morph targets de expressão/visemas. Não há controles explícitos de modelagem estética regional (ex.: projeção malar, volume labial, projeção de mento, perfil nasal). jawForward/cheekPuff são expressões/movimentos, não equivalentes clínicos. Inspeção estrutural, não validação de exportação nem ensaio de desempenho. Capturas oficiais MPFB/Rocketbox examinadas; nenhum render próprio da personagem foi aprovado.

## Decisão de direção

Melhor base de autoria nesta seleção: MPFB + Blender; manter Three.js/GSAP existentes para câmera/scroll. TalkingHead é referência para vida/expressões, sem necessidade de instalar a biblioteca inteira. Criar shape keys específicas por região, preservando topologia e identidade. Atenção: guia de exportação TalkingHead recomenda Bake modelling shapekeys; seguir literalmente apagaria os controles de transformação de que precisamos. Preservar/exportar os targets regionais deliberadamente e verificar no GLB.

Não foi encontrado nesta seleção um asset pronto que reúna aparência da personagem atual, acabamento editorial fotográfico e todos os morphs regionais com licença comercial adequada. Não prometer que MPFB sozinho garante esse acabamento.

Próxima unidade concreta: prova isolada de uma personagem, com piscar, leve movimento da cabeça e um único target malar controlado pelo scroll; enquadramentos frontal/3 quartos/perfil e textura de pele avaliados antes de integração. Só depois expandir lábios, queixo, mandíbula, nariz e câmera final. Modelo digital deve ser identificado como simulação ilustrativa, não caso clínico ou previsão de resultado.
