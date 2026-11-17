# "O próximo clique": a mão de Gabriel

## Resultado (14/11/2026)

A cena usa **uma mão só, a de Gabriel**, aberta com a palma para cima, com a manga da jaqueta preta cobrindo o pulso e sem pulseira. O arquivo de origem é `mao-palma-manga.png`. Foi gerado pelo usuário no ChatGPT e escolhido por ele.

O arquivo publicado é `public/images/editorial/mao-palma-braco.webp`, com 5800 × 2701 px. Ele foi preparado assim:
- ampliado com o Real-ESRGAN, na mistura de 65% IA e 35% original (a mesma do retrato);
- com o creme do fundo levado ao papel do site (#faf6ef);
- recortado com alfa suave pela distância ao fundo, com os buracos da silhueta preenchidos;
- com a manga continuada além da foto, 45% à direita e 20% abaixo. A continuação segue a direção do próprio braço (inclinação medida de 0,44) e espelha a textura do tecido. Assim o braço sai pela borda da tela, e não termina num corte reto, que foi a reclamação do usuário.

No CSS, a caixa `.palm` continua com as proporções da foto original (4000 × 2251). A imagem estendida transborda dela (`width: 145%`), então as frações abaixo valem para a mão, não para o arquivo.

Ao trocar a imagem, refaça o recorte e confira estas posições:
- o centro da palma, em 56% × 43% da foto (`.palmDot`, `.palmShadow`, `.palmGlow`);
- a borda direita do polegar, em 57% (`EditorialMotion`).

Mude também o nome do arquivo, porque o otimizador de imagens do Next guarda a versão antiga em cache.

## Caminhos descartados

São registros, não direções. Não os reintroduza sem pedido do usuário.

- **Duas mãos pintadas a óleo**, no gesto da criação, inspiradas na Shopify Editions Winter '26. O arquivo é `maos-original.webp`. O usuário aprovou a ideia, mas depois achou que a pintura não se ligava ao "g." nem ao avatar 3D do rodapé: eram quatro linguagens visuais na mesma página.
- **Uma pintura do "g." em mármore** sobre um pedestal. Seria a terceira vez que o "g." se monta na página: repetitivo.
- **A mão vindo em direção à câmera**, em escorço, inspirada na capa de *Significant Other*. Nesse gesto o ponto não tem onde pousar, e a capa fica só como referência de pose.
- **A mão com pulseira vermelha.** O usuário preferiu a manga cobrindo o pulso.
