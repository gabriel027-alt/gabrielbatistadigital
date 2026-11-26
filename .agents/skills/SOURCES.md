# Skills do vídeo

Fontes e commits exatos: `docs/research/video-repositories-lock.json`.

- humanizer: blader/humanizer, pacote raiz sem .git; MIT.
- grill-me e grilling: mattpocock/skills, pastas skills/productivity correspondentes; MIT. grill-me encaminha para grilling.
- scroll-craft: nateherkai/scroll-craft, pacote completo plugins/nateherk-design/skills/scroll-craft; MIT.

Licenças preservadas por pacote. Arquivos upstream não foram reescritos. Nomes de ferramentas de outro agente devem ser traduzidos para as ferramentas realmente disponíveis. Não assumir que Skill, AskUserQuestion ou subagentes estejam autorizados/disponíveis. Instruções do usuário e do ambiente prevalecem.

Consultar docs/ADAPTACAO-REPOSITORIOS-VIDEO.md. Usar leitura explícita quando a descoberta automática não ocorrer. Não carregar todas as skills por padrão; não repetir entrevista respondida nem alterar a direção aprovada para satisfazer heurísticas externas. Scripts e dependências não foram executados/instalados nesta importação.

## Revisão de interface (13/11/2026)

- web-interface-guidelines: vercel-labs/web-interface-guidelines, commit 434b7f91364665f2f733b310ec54809bf8f37937 (05/10/2026), arquivo command.md; MIT (LICENSE ao lado). Cópia fixa: a skill oficial (vercel-labs/agent-skills, web-design-guidelines) baixa as regras ao vivo a cada uso, o que não fazemos. Usar como checklist de revisão; as regras de texto próprias do inglês (Title Case, aspas curvas, voz em inglês) não se aplicam ao português.
- taste-skill (leonxlnx/taste-skill, MIT) foi avaliada e **não** instalada: traz gancho que roda a cada turno, kit de página próprio, paletas sorteadas e proibição de animação ligada ao scroll, o que contraria a direção aprovada. Dela só foram aproveitadas ideias de teste (foto ampliada demais, 320 px, toque de 44 px, sobreposição).

## Tráfego e captação de leads (25/11/2026)

- Oito skills de coreyhaines31/marketingskills: `ads`, `conversion-tracking`, `analytics`, `cro`, `ad-creative`, `copywriting`, `sales-enablement` e `revops`. MIT; commit `8fd2fcade2fd6629026e9dfe6d133b55b36968b9`. Pastas e licenças preservadas, sem instalador nem hooks. Alguns pacotes contêm templates/snippets/scripts passivos: não executados nem validados como runtime.
- `google-ads-audit`: adaptação local de referências MIT de AgriciDaniel/claude-ads, commit `fc3908e786c318776df89a3a098333da377364be`; não é o plugin completo nem seu motor de pontuação.
- `clinic-lead-ops`: skill local para rotear a campanha e a qualificação B2B, respeitando o contexto de Gabriel em `.agents/product-marketing.md`.
- Pesquisa, limites, ferramentas opcionais e uso: `docs/SKILLS-TRAFEGO-LEADS.md`. Arquivos e SHA-256: `docs/research/marketing-skills-lock.json`.
- Acesso direto a Ads/GA4 citado por fonte externa não existe por suposição. Não executar instaladores, enviar mensagens, coletar listas, publicar anúncios, alterar verba ou assinar serviços por esta importação. Preservar as autorizações e o site aprovado. Não repetir a entrevista do orçamento/local já respondida.

### Complemento da transcrição de tráfego

- Acrescentada `attribution` 1.1.10, do mesmo commit MIT de Marketing Skills (`8fd2fcade2fd6629026e9dfe6d133b55b36968b9`), com licença preservada. Total atual: nove skills upstream e duas adaptações locais. `clinic-lead-ops` encaminha interpretação de crédito e divergências para ela.
- Os demais projetos do vídeo foram analisados por metadados/README/licença, sem instalação ou execução. Decisões em `docs/VIDEO-FERRAMENTAS-TRAFEGO.md`; pins e hashes em `docs/research/video-paid-media-review.json`. BSL do Meta Ads MCP, exceções comerciais do Dub e custos do deploy LangChain não são cobertos por dizer “está no GitHub”.
