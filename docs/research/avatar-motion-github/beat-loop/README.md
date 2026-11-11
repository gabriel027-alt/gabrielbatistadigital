# Loop de cabeça no tempo (v2)

> **Rejeitado pelo usuário** por ter coreografia exagerada. Substituído por `../reference-loop/`, que ainda reutiliza o cenário e as capas próprias deste script. O corpo descrito abaixo também foi rejeitado e não é mais usado.

## Pedido do usuário

Após a v1 ser rejeitada e serem apontadas as capas de bandas e a cabeça apoiada no monitor, o usuário pediu: boca fechada, sem parecer cantando; balanço de rapper com esquiva de boxeador; cabeça para direita, esquerda, direita, depois esquerda, direita, esquerda, seguindo com um aceno de concordância, em loop infinito e harmônico. Autorizou mudar o cenário.

## Método

`render_beat_loop.py` é uma ferramenta offline, sem peso de modelo, vídeo-guia ou download. Usa `../expression-loop/source-base.png` e `../correction-study/head-mask-1.png`.

- **Movimento autoral:** curvas periódicas, não transferência de um vídeo de referência. A coreografia não deriva do material de Juan Mora.
- **Tempo:** 12 batidas a 90 BPM, 20 quadros por batida, 240 quadros, 8 s, 30 fps.
- **Coreografia, com "direita" sendo a direita da tela:** direita, esquerda, direita, assentar, esquerda, direita, esquerda, assentar, quatro batidas de aceno. Há aceno em todas as batidas, mais forte no fim do ciclo. A esquiva desce ao cruzar o centro, em arco. Giro e inclinação seguem a esquiva com 1 e 2 quadros de atraso.
- **Boca:** a imagem é projetada em um volume aproximado (elipsoide com nariz) e girada. Não há controle de boca, então ela não articula.
- **Corpo:** a imagem-base corta o queixo na borda do monitor. A cabeça foi elevada em 62 px, a mandíbula foi recortada pela linha medida e o queixo foi reconstruído esticando as últimas linhas de pele. Pescoço, gola e ombros são pintados proceduralmente e somem atrás do monitor.
- **Cenário:** a cabeça foi removida linha a linha, pois parede, prateleira e sofá correm na horizontal. As seis capas de bandas foram substituídas por arte abstrata própria, sem texto ou marca de terceiros.

## Limites

O giro é uma aproximação 2,5D, sem nuca, perfil ou reconstrução de cabelo em fios; ângulos maiores que os usados (11° de giro, 5,5° de inclinação, 9° de aceno) exporiam o método. Cabeça, luz e sombras são compostas, e a luz do monitor não é simulada fisicamente. Queixo, pescoço e ombros não vêm de fotografia nem da personagem original. Não há piscadas nem movimento de olhos. A imagem-base gerada mantém uma guitarra de formato conhecido e fones semelhantes a AirPods; isso não foi alterado nesta etapa.

## Verificação

- Emenda no vídeo decodificado (MAE RGB, escala 0–255): fundo fixo 0,041, contra 0,611 com quadro-chave a cada segundo. Na região da cabeça, 1,355 na volta do loop, abaixo da mediana de 1,495 entre quadros consecutivos. Medido no MP4 final com quadro-chave único.
- Arquivo: H.264 Constrained Baseline, 1280×818, 240 quadros, 8,0 s, 564.994 bytes, sem áudio.
- Curvas e faixas de pose em `render-report.json`; poses-chave em `poses.jpg`.
- Isso comprova continuidade técnica. Não comprova naturalidade nem aprovação estética, que dependem do usuário assistir ao vídeo.

## Reproduzir

```bash
python docs/research/avatar-motion-github/beat-loop/render_beat_loop.py --out PASTA --sheet --video
```

Requer Python com numpy, scipy e OpenCV, além de FFmpeg no PATH. Para ajustar a coreografia, mude `SLIP_KEYS`, `NOD_KEYS` e as amplitudes no início do arquivo.
