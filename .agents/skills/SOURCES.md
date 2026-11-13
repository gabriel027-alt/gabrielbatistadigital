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
