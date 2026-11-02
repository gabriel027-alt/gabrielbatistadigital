# Revisão integral da página principal

## Referência e limites

A referência fornecida é o HTML de jorgewebpro.com. Foi possível analisar a hierarquia, a sequência comercial, o cabeçalho, as chamadas e os grupos de projetos. A requisição ao CSS externo retornou HTTP 403; os assets e comportamentos externos não foram confirmados visualmente. A implementação usa composição própria, fotografia aprovada e assets já pertencentes ao projeto. Não foram copiados números de clientes, depoimentos, textos comerciais, marca ou fotografias do autor da referência.

## Estrutura atual

Abertura azul com navegação flutuante, tipografia em escala maior e fotografia única. Proposição comercial breve; seleção de seis projetos em grade assimétrica; catálogo expansível com os 20 projetos; soluções; processo em quatro etapas; apresentação pessoal; perguntas; contato.

O catálogo substitui a sequência de galerias e demonstrações repetidas na página principal. A seleção é identificada uma vez como estudos autorais. As páginas de estudo preservam sua identificação própria; não há alegação de clientes contratantes.

Arquivos principais: components/SignatureHome.tsx, components/SelectedWork.tsx, app/signature.css e app/page.tsx. Os componentes anteriores permanecem no repositório como histórico, mas Hero, ProjectSpotlight, NicheGallery, Portfolio e ExperienceLab não são montados na página principal. Não reintroduzir suas estruturas ao atualizar.

## Movimento e uso

Scroll nativo, deslocamento proporcional das janelas de projeto e da composição; hover/foco percorrem parte da interface. A pausa mantém a posição das janelas; movimento reduzido remove transformações. Catálogo usa details/summary nativo, disponível sem JavaScript. Os filtros precisam de JavaScript. A fotografia pessoal não foi editada nem substituída. Não há vídeo gerado, giro ou troca de faces.

## Revisão

Capturas em docs/preview/signature-*.webp. A verificação visual é feita no Chromium; testes incluem temas, teclado, ausência de overflow em seis larguras, contato, catálogo, imagem sem JavaScript, pausa e acessibilidade. As 20 rotas permanecem. Safari e dispositivos físicos não foram verificados. Nenhum deploy é executado nesta revisão.

Verificações locais concluídas: lint sem erros, build das 27 páginas, typecheck e 32 testes Playwright aprovados. Os testes da antiga sequência de poses, carrossel e vitrine foram substituídos por verificações da estrutura atual; os testes das 20 páginas de projetos e das interações de serviço e contato foram preservados.
