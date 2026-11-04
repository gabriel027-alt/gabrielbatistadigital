# Pesquisa de skills e bases 3D para protótipos

4 de novembro de 2026. Pesquisa documental realizada, sem instalar dependências ou alterar o site. Objetivo: selecionar candidatos para experiências de clínicas de estética e apresentações de projetos de clientes; não declarar uma landing comercialmente validada por existir um repositório.

## Skills

### Já instalada: web-3d-asset-pipeline

Fonte: OpenAI Plugins, skill local em .agent/skills/web-3d-asset-pipeline. SKILL e referências de R3F/assets consultados. Adequada para preparar GLB/glTF, compressão, texturas e verificações no runtime. O próprio documento exclui escolha de engine e código de cena. É complementar, não resolve composição, iluminação artística ou copy. Não adicionar física ou colisões por serem mencionadas numa skill destinada originalmente a jogos.

### Candidata: CloudAI-X/threejs-skills

https://github.com/CloudAI-X/threejs-skills — licença MIT lida. README e skills threejs-react-three-fiber e threejs-performance examinados. Coleção comunitária, não oficial do Three.js ou da OpenAI. Contém 13 temas, incluindo luz, materiais, loaders, interação e performance. O README declara alvo three r186, R3F 9.8 e Drei 10.7; essas são declarações do autor, não resultados reproduzidos nesta pesquisa. O Three.js HEAD consultado já declara 0.187.0, logo não misturar APIs sem conferir versões.

Pontos úteis examinados: frameloop sob demanda, invalidação, descarte de recursos, contagem de memória versus bytes, limitações de helpers em WebGPU e fallback. Recomendação: considerar apenas os módulos pertinentes quando a cena for definida, após leitura completa e conferência com APIs oficiais. Não instalar a coleção inteira nem executar npx sugerido pelo README nesta fase.

### Já instalada: gsap

SKILL local consultado. É referência destinada a HyperFrames; não é um motor 3D nem demonstra que GSAP esteja no site. Útil para timelines quando a interação exigir; não adotar automaticamente para qualquer movimento.

## Repositórios técnicos examinados

| Fonte | Evidência consultada | Uso possível | Decisão e limite |
| --- | --- | --- | --- |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | readme.md, package do workspace fiber, LICENSE MIT | Cenas personalizadas em React | Candidato principal se precisarmos controlar cena. Manifesto consultado declara fiber 9.8.1, React >=19 <19.4; React 19.3.1 do projeto cabe nesse intervalo. Compatibilidade declarada não substitui build e runtime. |
| [Drei](https://github.com/pmndrs/drei) | README, package.json, LICENSE MIT | Loaders, ambiente, controles e helpers | Complemento seletivo. Manifesto exige Fiber ^9 e React ^19. Evitar importar helpers e efeitos sem necessidade. |
| [Three.js](https://github.com/mrdoob/three.js) | README, package.json, LICENSE MIT | Base de renderização | Dependência da solução R3F, não outra camada de framework para instalar em paralelo. Versão de desenvolvimento não é recomendação automática de versão publicada. |
| [model-viewer](https://github.com/google/model-viewer) | README, package do componente, LICENSE Apache-2.0 | Exibir e manipular um modelo GLB/glTF com menos código de cena | Alternativa para um único objeto, após verificar poster, controles e acessibilidade. Acessibilidade e integração Next ainda não testadas. |
| [glTF Transform](https://github.com/donmccurdy/glTF-Transform) | README, package.json, LICENSE.md MIT | Inspeção e otimização de assets | Ferramenta de preparação, não componente de página. Comparar tamanho, aparência e tempo de decodificação antes/depois. |
| [glTF Validator](https://github.com/KhronosGroup/glTF-Validator) | README e LICENSE Apache-2.0 | Verificar conformidade do arquivo glTF/GLB | Recomendado para o pipeline. Validade de formato não certifica estética, tamanho adequado ou desempenho. |
| [react-three-next](https://github.com/pmndrs/react-three-next) | README, package.json, LICENSE MIT | Referência de canvas persistente e views | Não adotar como base: Next ^14, React ^18, Fiber ^8 e Three ^0.160 no manifesto consultado. Alegação de Lighthouse 100 no README não é evidência para nosso projeto. |
| [glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) | README | Modelos para testar recursos e materiais | Licenças variam por modelo; ler README e créditos do asset escolhido. Não assumir licença única nem adequação médica. |

O endereço spline-design/react-spline consultado retornou 404 para os três caminhos tentados. Não foi validado nesta pesquisa; isso não prova que o produto Spline esteja indisponível. Não o recomendar com informações presumidas.

## Outras fontes de assets

O README de glTF Sample Assets aponta Poly Haven, Sketchfab, Kenney e Smithsonian. São pistas para uma próxima busca, não catálogos auditados nesta sessão. Poly Haven é descrito ali como fonte de HDRIs/texturas/modelos CC0, mas confirmar diretamente os termos do recurso escolhido. Licença de biblioteca não concede direito sobre modelo, fotografia, marca ou pessoa.

## Aplicação ao nicho — propostas, não descobertas comerciais

1. **Apresentação do protótipo da cliente:** mostrar a própria interface em um dispositivo 3D manipulável, com captura 2D equivalente e acesso direto ao site. Útil como demonstração do trabalho de Gabriel; não pressupõe que o site da clínica precise de WebGL.
2. **Ambiente da clínica:** exploração de um espaço real pode apresentar a unidade, desde que haja asset fiel/autorizado e alternativa em fotos. Uma foto panorâmica ou vídeo pode cumprir melhor a função; comparar antes de escolher 3D.
3. **Produto de cuidados:** visualizador de embalagem real, quando houver produto relevante e material autorizado. model-viewer pode bastar.
4. **Modelo anatômico ou procedimento:** não é a primeira recomendação. Exige fontes e revisão profissional para precisão; não usar modelo genérico como representação de resultado de tratamento.

Para o primeiro experimento técnico, recomendo avaliar apresentação de interface em dispositivo, por ser reversível, mensurável e não envolver simulação clínica. Isso ainda não define a direção artística nem autoriza substituir o retrato da hero.

## Critérios para aceitar um protótipo

- Propósito: identificar que informação ou ação melhora. Sem benefício demonstrável, manter imagem/vídeo/HTML.
- Conteúdo: títulos, links e CTA no HTML; a oferta funciona mesmo sem canvas.
- Falhas: fallback estático para WebGL indisponível, falha de asset e erro de carregamento. Reservar dimensões para evitar saltos.
- Interação: controles equivalentes por teclado quando houver função interativa, toque sem bloquear rolagem, foco visível, pausa e movimento reduzido. Teste automatizado não basta.
- Asset: licença e créditos documentados, relatório do Validator analisado, escala/pivô/texturas conferidos e otimização comparada visualmente.
- Execução: carregamento tardio quando adequado, limitar DPR após medir, evitar render contínuo de cena parada, liberar recursos ao desmontar e interromper trabalho fora da tela quando possível.
- Desempenho: registrar bytes transferidos, carregamento, estabilidade e tempo de frame com dispositivo/navegador identificados. Comparar com versão estática. Valores-alvo são definidos antes da implementação e não apresentados como resultados medidos.
- Verificação: build, tipagem e testes pertinentes; capturas nos dois temas e em desktop/mobile; ensaio em celular real antes de afirmar fluidez móvel. Navegador emulado na nuvem não comprova comportamento de GPU real.
- Comercial: não há evidência nesta pesquisa de aumento de conversão por 3D em estética. A percepção do público e o impacto comercial precisam de validação própria.

## Estado da seleção

Há bases candidatas e licenças examinadas. Não executei demos, benchmark, análise de vulnerabilidades, auditoria completa de manutenção ou testes de integração. A existência de HEAD remoto e um README não demonstra manutenção ativa; histórico de releases, issues e vulnerabilidades deve ser conferido para a versão candidata antes de instalar. Não encontrei nesta amostra um protótipo completo de clínica em 3D que possa ser chamado de validado em todos esses critérios.

Manifesto de arquivos consultados e heads observados: research/3d-source-manifest.json. Os arquivos foram lidos em URLs móveis HEAD; hashes registram o conteúdo obtido e os heads foram verificados separadamente. Antes de incorporar código, fixar uma revisão e conferir novamente licença e APIs.
