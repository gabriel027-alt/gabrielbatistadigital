# Casa Brisa: tour contínuo da órbita à suíte (11/11/2026)

## Pedido

O usuário quer uma câmera que sai da órbita do satélite e chega à fachada da empresa, entra, passa pela recepção e apresenta os demais ambientes. É um tour completo, quadro a quadro conforme o scroll, sem cortes. Nicho escolhido: hotel boutique.

A marca é a Casa Brisa, que já existe na galeria. As fotos atuais (`public/images/models/hotelaria.webp` e `people/hotelaria.webp`) definem o lugar:
- casa branca com telhado de barro e arcos;
- pátio com piscina, palmeiras e varandas de madeira;
- luminárias de palha e vasos de terracota;
- balcão de madeira na recepção;
- mar ao fundo.

## Como será feito

- **Vídeo:** não há gerador de vídeo nem Blender neste ambiente. O usuário gera os trechos numa ferramenta de vídeo com IA (Veo, Kling, Runway ou Sora), no modo imagem para vídeo.
- **Continuidade:** cada trecho começa no último quadro do anterior. Depois de cada trecho, extraio o último quadro (`ffmpeg -sseof`) e devolvo como imagem inicial do próximo.
- **Montagem:** junto os trechos, extraio os quadros, comprimo em WebP e desenho num canvas controlado pelo scroll, como nas páginas de produto da Apple. A volta do scroll leva a câmera de volta à órbita.
- **Peso:**
  - desktop com cerca de 360 quadros de 1280×720;
  - celular com versão menor, recortada no centro;
  - carregamento progressivo, com os primeiros quadros antes e o resto em segundo plano.
- **Sem animação, com movimento reduzido ou sem JS:** uma foto de cada ambiente, em sequência, com os mesmos textos.
- **Órbita e cidade geradas, não reais.** Imagem de satélite real tem licença restrita e apontaria um endereço verdadeiro.

## O que foi feito (11/11/2026)

O roteiro abaixo foi o plano inicial. O resultado mudou em três pontos:
- **Abertura:** o usuário rejeitou a curvatura da Terra. O tour começa no alto, sobre a baía e as oliveiras, sem órbita. A subida do Gemini foi cortada no quadro 880 e invertida.
- **Origem:** os trechos foram gerados pelo usuário no Gemini (Veo), na mesma conversa, a partir do último quadro.
- **Pontes:** dois cortes foram costurados aqui.
  - **Porta:** aproximação da fachada ×4 e o interior entrando em escala, com fusão de 16 quadros.
  - **Voo:** panorâmica com dissolução de 24 quadros entre a subida invertida e o mestre.

**Mestre:** `Downloads/casa-brisa-tour/MESTRE-COMPLETO.mp4`, com 1121 quadros, 24 fps e 1280×720. Fica fora do repositório.

**Publicado:** um quadro a cada dois, ou seja, 561 quadros em WebP.
- `public/videos/casa-brisa/d/`: 1280×720, qualidade 60, 18,5 MB.
- `public/videos/casa-brisa/m/`: recorte central de 432×720, qualidade 58, 7,0 MB, usado em telas verticais.
- Fotos por capítulo em `public/images/casa-brisa/`.

| Capítulo | Quadros publicados | Texto |
| --- | --- | --- |
| Chegada | 1–187 | A chegada começa de longe. |
| Entrada | 188–245 | A porta já está aberta. |
| Recepção | 246–342 | Na recepção, sem pressa. |
| Suíte | 343–442 | Suítes que se abrem para a luz. |
| Jardim | 443–502 | O jardim entra pela janela. |
| Casa | 503–561 | Ficar mais um pouco. |

**Carregamento:** de grosso a fino. Primeiro um quadro a cada 32, depois a cada 16, 8, 4, 2 e 1, com seis pedidos de cada vez. Enquanto isso, o canvas desenha o quadro carregado mais próximo.

## Roteiro inicial da câmera (histórico)

| Trecho | De → para | Texto que acompanha no site |
| --- | --- | --- |
| 1 | Órbita da Terra → costa tropical, atravessando nuvens | A chegada começa de longe. |
| 2 | Voo baixo sobre o mar → vila costeira → fachada da Casa Brisa | Uma casa branca entre o mar e as palmeiras. |
| 3 | Fachada → portas de madeira abrindo → recepção | Na recepção, o ritmo já é outro. |
| 4 | Recepção → arco → pátio com piscina | O pátio é o centro da casa. |
| 5 | Pátio → escada de madeira → varanda → suíte | Suítes que se abrem para a luz. |
| 6 | Suíte → varanda da suíte → mar ao entardecer (fim) | Ficar mais um pouco. (botão de reserva) |

## Regras para gerar cada trecho

- **Formato:** 16:9, a maior resolução disponível (ideal 1920×1080), 24 ou 30 quadros por segundo, de 6 a 8 segundos.
- **Movimento:** câmera sempre avançando, velocidade constante, sem cortes, sem trocar de lente e sem girar de repente.
- **Luz e estilo:** a mesma em todos, fim de tarde dourado, sem mudança de clima, e a mesma arquitetura das fotos de referência.
- **Pessoas:** nenhuma cruzando rápido na frente da câmera, porque isso gera distorções. Recepcionista e hóspedes, se aparecerem, ficam parados ou se movem devagar.
- **Proibido:** texto, placa com nome, logotipo e marca d'água.
- **Encadeamento:** a partir do trecho 2, a imagem inicial é o último quadro que eu devolver do trecho anterior.
- **Enquadramento:** manter o centro do quadro limpo e importante, porque no celular a imagem é recortada ao meio.
