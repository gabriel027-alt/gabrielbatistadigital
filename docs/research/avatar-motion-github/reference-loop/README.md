# Loop do rodapé conduzido pela referência (v11)

> A v11 corrige a vesguice notada pelo usuário: os canais de íris de cada olho discordavam em até 1,6 px, em íris de cerca de 7 px de raio. Agora um só olhar, a média dos dois, é aplicado aos dois olhos, parado por 37 quadros e com saltos rápidos, limitado a ±1,7 px e ±0,6 px (`GAZE_*`). A tabela abaixo fica superada nesse ponto: íris não seguem mais cada canal. O sombreado usa só formas amplas da malha, o que retira um brilho assimétrico sob um dos olhos.

> A v9 foi aprovada, com ressalva sobre os olhos. A análise quadro a quadro mostrou íris corretas e defeito só na piscada: cílios serrilhados pelos degraus de pixel e pálpebra de cor chapada. A v10 usa curvas ajustadas à abertura e pele reconstruída ao redor do olho (classe `Eye`).

> A v8 acrescentou gola e ombros desenhados por código e foi rejeitada por parecer irreal (`SHOW_GARMENT = False`). A pedido do usuário, a v9 mantém a v7 aprovada e só abre o pescoço em curva até o monitor, em pele, sem roupa (`TRAP_FROM_ROW`, `TRAP_REACH`). `base-para-gpt.png` fica disponível caso ele queira mais corpo.

> A v4 foi aprovada pelo usuário. A v5 retira a animação das sobrancelhas e acrescenta vapor no café (classe `Steam`, com ciclos inteiros para fechar o loop). A v6, com mandíbula alargada e sombra escura, foi rejeitada. A v7 mantém o contorno original e só fecha o queixo (`LIFT` de 14 px, `build_head`, `build_neck`), substituindo o trecho abaixo que dizia que a cabeça ficava na posição da imagem-base. A tabela de canais abaixo vale para todas, exceto pelas sobrancelhas. O som agora é o player do Spotify, descrito em `docs/RECONSTRUCAO-PORTFOLIO-EDITORIAL.md`; `make_groove.py` fica só como registro.

## Pedido do usuário

O usuário rejeitou a coreografia autoral da v2 (`../beat-loop/`) e enviou uma gravação de tela do rodapé do site de Juan Mora, de 40,9 s e com música de fundo, pedindo esse movimento. Depois também rejeitou o corpo reconstruído da v3: como na referência, deve aparecer só a cabeça atrás do monitor. A elevação da cabeça, o queixo refeito, o pescoço e os ombros foram retirados. Pediu ainda uma opção de música no site.

## O que a medição mostrou

`extract_motion.py` compara cada quadro com um quadro-chave fixo, usando só pontos da cabeça, e calcula a média de 3 ciclos.

- Ciclo de 334 quadros (11,13 s), obtido pela semelhança das próprias imagens.
- **O movimento é principalmente deslizamento:** cerca de ±8 px na horizontal a 0,72 Hz e ±11 px na vertical a 1,53 Hz (aproximadamente 92 BPM), em gravação de 1910 px de largura. A oscilação lateral acontece na metade da frequência do aceno.
- Repetição entre o primeiro e o último ciclo: x 0,98 e y 0,95. Essa parte da medida é confiável.
- Inclinação (±0,6° bruta) e paralaxe de giro (menos de 1°) são pequenas, com repetição de apenas 0,47 a 0,75. Essas estimativas são frágeis.

O arquivo `motion-channels.json` contém apenas números. Nenhum pixel da gravação foi versionado ou entra no site.

## Método de render

`render_reference_loop.py` é offline, sem pesos de modelo nem downloads. De `../beat-loop/` reaproveita só o cenário: fundo sem a cabeça e capas próprias.

| Canal | Origem |
| --- | --- |
| Posição x, y | Medida na gravação, quadro a quadro, escalada para o tamanho da cabeça aqui (0,83) |
| Giro e aceno | Proporcionais à mesma trajetória: até 2,8° e 2,6° (decisão nossa, maior que o medido, para a profundidade ser percebida) |
| Inclinação | Medida na gravação, ganho 1,5× (decisão nossa) |
| Íris e sobrancelhas | Canais de `../volume-light/rig-input.json`, com ganho decidido aqui |
| Piscadas | Autorais, em 2,9 s e 8,1 s: os canais guardados não têm piscadas |
| Boca | Sem controle: fica sempre fechada |

A cabeça fica na posição da imagem-base, cortada pela borda do monitor. Abaixo da borda, a última linha limpa da imagem é repetida, para o aceno não revelar corte. A profundidade facial vem dos 478 pontos medidos na imagem aprovada.

## Limites

Continua sendo aproximação 2,5D de uma imagem única, não um modelo 3D real: não há nuca, perfil ou cabelo em fios. O sincronismo de olhos e sobrancelhas com a cabeça é fraco: correlação de 0,29 no alinhamento dos dados guardados. O rosto não reproduz a expressão da boca, os óculos nem o design do personagem da referência.

## Verificação

Medições feitas no MP4 final, com o mesmo tipo de rastreamento da referência: ver `render-report.json` e os valores registrados em `docs/RECONSTRUCAO-PORTFOLIO-EDITORIAL.md`. A verificação comprova a trajetória, não a naturalidade nem a aprovação estética.

Durante a revisão, a correlação negativa da inclinação (-0,40) revelou um erro de sinal na transformada, presente também na v3. Depois da correção, a inclinação ficou correlacionada positivamente.

## Som opcional

`make_groove.py` gera uma faixa instrumental original (bateria, baixo e guitarra sintetizados), sem samples nem material de terceiros, com duração de 2 ciclos do vídeo e bumbo alinhado à descida do aceno. Faixa de Limp Bizkit ou qualquer música comercial não pode ser hospedada aqui sem licença. O áudio não foi ouvido por quem o gerou: só foram medidos nível (-14 LUFS, pico -0,6 dB após AAC) e emenda. A aprovação depende de o usuário ouvir.

## Procedência

O movimento deriva de um vídeo do site de outro designer, a pedido do usuário. Isso é um risco a avaliar antes de publicar, junto com a composição do rodapé, que também é próxima da referência.
