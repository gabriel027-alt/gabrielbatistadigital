# Encerramento Juan Mora: asset e composição

Pedido: usar REA para orientar a reprodução do encerramento com a identidade de Gabriel. A evidência disponível é o pacote fornecido pelo usuário, não uma inspeção ao vivo do domínio.

## Fatos encontrados diretamente no artefato

- `sources/index.html:352–356`: `video-cont-footer footer` contém `<video muted autoplay loop playsinline>`, com fonte `https://juanmora.co/videos-work/desk_jm3.mp4`. O personagem observado no encerramento é uma gravação reproduzida em loop; esse trecho não fornece malha 3D, rig, keyframes ou arquivos-fonte de animação.
- `sources/style-3.css:71–81`: `.top-glow` é uma camada fixa, 100vw × 100vh, z-index 900, pointer-events none. O brilho é produzido por duas sombras internas: `inset 0 2px 30px #ffb286c4` e `inset 0 2px 130px 8px #ff72437d`.
- `sources/style-3.css:3868–3869`: a versão móvel reduz a segunda sombra para `inset 0 1px 80px 3px #ff72434a`.
- `.section.footer`: ocupa 100vw × 100vh. `.video-cont-footer.footer` é uma camada absoluta, não interativa, sobre o palco.
- `.glow-orange` existe no CSS, mas sua presença no stylesheet não prova que componha o encerramento: não foi encontrada uma instância dessa classe no DOM fornecido. Não atribuir a ela efeitos sem evidência.
- As cópias e nomes são elementos HTML separados do vídeo. Não precisam ser removidos de um vídeo gerado; basta não incluí-los no asset próprio.

## Acesso ao asset

Uma tentativa HTTP HEAD a `https://juanmora.co/videos-work/desk_jm3.mp4` retornou `CONNECT tunnel failed, response 403`, antes de alcançar o site. Isso é uma restrição do túnel de rede deste ambiente, não comprovação de Cloudflare ou proteção do site. Não foi tentado bypass.

O pacote recebido inclui uma gravação da tela, mas não o arquivo original `desk_jm3.mp4`. Até receber esse asset ou acesso permitido, sua duração, FPS, transparência e características de loop não foram medidas. O vídeo não será publicado como trabalho ou personagem de Gabriel.

## Adaptação concreta

A rota `/propostas/portfolio-editorial` recebeu uma camada fixa independente `frameGlow`, com o mesmo mecanismo de sombras internas e ajuste móvel, mudando a cor para vermelho. A camada não intercepta mouse, toque ou teclado. Não há pulsação: a regra de origem encontrada define brilho estático. Isso evita pedir ao gerador de vídeo que invente a aura.

Os personagens anteriores foram rejeitados e não foram reintroduzidos. REA analisa a implementação entregue; não recupera automaticamente o rig ou o projeto de animação que originou um MP4 e não troca a identidade do personagem. A reprodução do estilo e da coreografia com os traços de Gabriel continua pendente, separada da camada de brilho já identificada.

## Execução REA

REA 6.8.0, CLI isolada com Node 24.22.1, análise estática de `custom-interactions.js` e `script-9.js` (Unicorn), sem executar os scripts externos. A primeira análise de dois scripts atingiu o prazo de 60 segundos em `script-9.js`; a evidência parcial foi preservada em `/tmp/rea-footer-evidence.json`. A segunda execução foi delimitada a `custom-interactions.js` e concluída. Evidência resumida e limitações em `rea-summary.json`. A atribuição do vídeo e do brilho acima vem do HTML/CSS fornecido; não deve ser apresentada como descoberta de um motor 3D pelo REA.
