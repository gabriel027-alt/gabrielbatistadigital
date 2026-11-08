# Revisão do movimento rejeitado

O usuário rejeitou v1: boca articulando, álbum Iron Maiden deformando e movimentos de cabeça diferentes da referência. Playback, emenda e testes de interface não validavam esses requisitos. A integração existente não foi substituída por estes ensaios.

## Diagnóstico

A expressão relativa e o stitching alteravam a boca. A máscara genérica LivePortrait incluía cenário atrás da cabeça. O rastreador interno do motor não reproduzia fielmente a pose do cartoon de referência. A suavização de entrada/saída e piscadas adicionadas também eram decisões nossas, não coreografia original.

## Ensaios e resultado

1. Recorte rígido com trajetória 2D medida: boca estável, mas aparência de recorte e sem rotação em profundidade. Descartado como final.
2. LivePortrait com expressão zero, sem stitching/piscadas, cenário separado por máscara MobileSAM. Melhorou boca e fundo; cabeça ainda divergente.
3. Calibração local: sete poses (base e ±5 graus por eixo), rastreador MediaPipe independente, inversão do Jacobiano para mapear os ângulos medidos na referência para os controles do motor.
4. Separação do deslocamento de tela: retirado deslocamento neural e aplicado deslocamento medido por similaridade 2D. Prova diagnóstica de três segundos, inferência a cada terceiro quadro repetida em contêiner de 30 fps. Não usar como filme final fluido.

Na prova 4, variação normalizada da abertura dos lábios: 0,00798 contra 0,05876 em v1 (redução de aproximadamente 86%; não é imobilidade matemática). Diferença média máxima no recorte visível de álbum após compressão: 0 contra 0,05036 em v1. Essa medida só cobre o recorte testado, não certifica todo o cenário. O limite da cabeça produz oclusão natural sobre partes do fundo; não é deformação da arte do álbum.

Correlação temporal dos ângulos rastreados com a referência: 0,622 / 0,765 / 0,890 nos eixos XYZ. Ainda insuficiente para declarar movimentos iguais. A medição é aproximada em cartoons de identidades diferentes. Não ampliar para filme final nem anunciar fidelidade com base apenas nesses números. O ensaio não resolve a solicitação completa.

Comparação: referência à esquerda, ensaio à direita. Sem áudio. Sem loop artificial ou novas expressões. O teste ainda tem limitações de borda/oclusão e deve permanecer fora da integração.

## Dependência adicional

MobileSAM, github.com/ChaoningZhang/MobileSAM, commit f706ad9c4eb7f219c00d9050e46328518ffb65d2, Apache-2.0. Problema concreto: separar cabelo/rosto/AirPods do álbum. Alternativa anterior (máscara ampla do motor) incluía fundo; recorte retangular não resolve. Runtime CPU, timm 0.9.16, pesos mobile_sam.pt do repositório (~39 MB), somente ferramenta offline; zero custo de carregamento no site. Pip check aprovado. Popularidade não é critério de qualidade. Não permite recuperar o rig/animação original do vídeo.

Scripts preservam caminhos absolutos deste workspace de pesquisa; precisam de adaptação e dos runtimes/pesos documentados nas etapas anteriores para executar em outro ambiente. Não são dependências da aplicação web. A licença da ferramenta não transfere direitos sobre a referência.

Próximo limite técnico: retargeting a partir de imagem única permanece aproximado. Para equivalência controlável é necessário um personagem com rig 3D e animação de cabeça verificável; REA e ajuste de prompt não recuperam o rig original de um MP4.
