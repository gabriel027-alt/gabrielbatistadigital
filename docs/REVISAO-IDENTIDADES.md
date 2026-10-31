# Revisão de identidade dos modelos

## Problema

A galeria anterior tinha imagens de ambientes e conteúdo de nicho, mas uma presença humana insuficiente e aparência excessivamente uniforme. Esta revisão atua nos 17 modelos adicionados; os três conceitos originais e a hero pessoal de Gabriel permanecem preservados.

## Mudança

- 17 novas fotografias com personagens adultos fictícios em situações específicas de trabalho: escuta jurídica, mapa no campo, consulta, visita a imóvel, engenharia de energia, reunião contábil, facilitação, acolhimento, cozinha, amostras de interiores, segurança, sala de aula e logística.
- A imagem de ambiente anterior passa a compor uma seção editorial com território verbal, manifesto e assinatura próprios. Deixa de ser a única referência visual da marca.
- Camada de marca em `lib/model-brands.ts`: símbolo, monograma, território, promessa editorial, princípios, ícones por serviço, descrições das fotografias e assinatura. Símbolos vetoriais em `BrandGlyph.tsx`.
- Cabeçalhos com símbolo e descritor; faixa de princípios; ícones semânticos em vez de números decorativos; selo discreto e seção editorial.
- Paletas e ajustes de composição específicos por marca em `data-brand`, além das seis direções de base. Algumas seções alternam posição, proporção, recorte e tratamento de imagem.
- Capturas da galeria refeitas a partir das páginas completas em `previews-branded/`, com dimensões reais reservadas e sem reaproveitar as antigas imagens de ambientes como prévia.

## Limites

As cenas representam personagens, empresas e situações fictícias. Não há equipe real, registros profissionais, atendimentos, depoimentos ou clientes anunciados. As identidades são estudos de direção visual, não marcas registradas ou sistemas de identidade completos. Componentes de página continuam compartilhados. Isso não equivale a 17 projetos de cliente com backend, integrações ou operação real.

## Verificação

Lint, build e tipagem estrita. Suíte de 33 testes em Chromium, incluindo carregamento das imagens humanas e editoriais, princípios e símbolos dos serviços, conteúdo, filtros, navegação, teclado, responsividade e acessibilidade automatizada. Capturas em desktop e celular com inspeção visual de direções representativas. Sem validação em Safari/Firefox/Windows ou medição Lighthouse.

## Prévias

Veja `docs/preview/gallery-niches.webp`, `gallery-niches-mobile.webp` e as capturas específicas `brand-patrimonio.webp`, `brand-psicologia.webp`, `brand-agro.webp`, `brand-energia.webp`.
