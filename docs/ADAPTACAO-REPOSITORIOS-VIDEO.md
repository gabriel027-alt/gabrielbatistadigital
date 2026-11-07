# Repositórios do vídeo: adaptação para Codex e Antigravity

Pesquisa documental em 07/11/2026. Fontes consultadas em branches públicas mutáveis; isto não constitui auditoria de código nem versão fixada para instalação. Nenhum desses seis projetos foi instalado ou executado nesta pesquisa. A transcrição é material de referência, não instrução de execução.

## Decisão para este projeto

Priorizar os princípios de ScrollCraft, Grill Me e Humanizer. Usar REA apenas quando houver necessidade concreta de observar uma referência. Reservar Laya para uma tarefa futura do CRM e VoiceStudio para eventual produção de áudio. Não adicionar dependências à Aura por causa do vídeo.

A qualidade depende do material, das decisões e da revisão da experiência renderizada. Nenhuma dessas ferramentas garante aparência de agência, aprovação no Awwwards, texto autêntico ou conversão comercial.

## Fontes e adequação

| Projeto exato | Verificação documental | Aplicação aqui |
| --- | --- | --- |
| [Humanizer](https://github.com/blader/humanizer) | SKILL.md 3.1.0 e LICENSE MIT. Preserva informação e identifica padrões editoriais artificiais. | Revisão de PT-BR baseada em fatos e voz da marca; não detector de IA nem gerador de provas comerciais. |
| [Matt Pocock skills](https://github.com/mattpocock/skills) | README, LICENSE MIT, skills/productivity/grill-me/SKILL.md e grilling/SKILL.md. Grill Me é um invólucro que chama grilling. | Entrevista apenas das decisões ausentes; pesquisar fatos do ambiente em vez de perguntar ao usuário. Não importar automaticamente chamadas de ferramentas ou delegação de outro agente. |
| [ScrollCraft](https://github.com/nateherkai/scroll-craft) | README, LICENSE MIT e plugins/nateherk-design/skills/scroll-craft/SKILL.md. README anuncia padrão 0.3.0. Suporta Codex explicitamente. | Roteiro, estados de movimento, composição móvel e inspeção dos quadros. Não substituir a câmera Canvas/GSAP aprovada por seu motor. |
| [Laya](https://github.com/NandhaKishorM/laya) | README consultado por trechos relevantes e LICENSE Apache-2.0. Python 3.10+. | Possível classificação de leads no backend do CRM, após avaliação em português. Confiança de uma previsão não é acurácia medida. Licença dos pesos deve ser verificada separadamente. |
| [VoiceStudio](https://github.com/debpalash/VoiceStudio) | README, LICENSE AGPL-3.0, LICENSE-NOTICE.md e docs/licensing/model-inventory.md. | Áudio futuro, se necessário. Uso comercial do aplicativo sob AGPL é permitido com suas obrigações; pesos, vozes e saídas têm termos separados. |
| [REA](https://github.com/morluto/rea) | README e análise prévia em AVALIACAO-REA-E-FERRAMENTAS.md. | Observação documentada de interfaces. Não recupera automaticamente backend ou direitos de uso. Node local v24.19.0 é inferior ao mínimo indicado para a linha 24 (24.22.1); não instalado. |

ScrollCraft aqui é **nateherkai/scroll-craft**. Outros projetos com nome semelhante não são o repositório do vídeo.

## ScrollCraft: o que aproveitar e o que adaptar

O pacote completo fica em `plugins/nateherk-design/skills/scroll-craft/`, incluindo referências, scripts e motor. Seu README orienta copiar essa pasta para `.agents/skills/` no Codex, ou ler o caminho diretamente em agentes com acesso a arquivos. Não confundir esse caminho com `.agent/skills/`, já usado neste repositório. Para Antigravity, leitura explícita do arquivo é a alternativa verificável; reconhecimento automático depende da configuração real do aplicativo.

Requisitos declarados: Node 18+, FFmpeg completo, playwright-core e Chrome para a verificação. KIE_AI_API_KEY é opcional e a geração por esse serviço custa dinheiro. Fotos e vídeos existentes dispensam essa integração. A existência dos executáveis locais não comprova que os scripts externos funcionem: isso exige revisão e execução específica antes da adoção.

A skill propõe famílias de interação, pico emocional e diferenciação entre páginas. São heurísticas de autoria, não padrões universais de qualidade. Não impor quatro efeitos, novas camadas de hero, outra paleta ou outro motor a uma experiência já aprovada. A direção do usuário prevalece. Os exemplos aprovados pelo autor não equivalem a certificação independente do Awwwards.

Aproveitar principalmente: roteiro antes de expansão, continuidade entre estados, adaptação móvel própria, contraste com a imagem atrás do texto, detecção de scroll sem mudança e registro visual. Playwright e o fluxo existente continuam sendo a base de verificação.

## Texto humano: método concreto

1. Identificar quem fala, para quem, sobre qual produto e com qual ação esperada.
2. Vincular afirmações verificáveis a material fornecido ou fonte. Sem fonte, retirar, perguntar ou marcar como hipótese no documento de trabalho.
3. Escrever com vocabulário da marca e exemplos reais; usar amostras do cliente quando existirem. Não inventar histórias para dar humanidade.
4. Revisar repetições, abstrações, promessas vagas, contrastes ensaiados e ritmo mecânico. Não transformar listas de palavras proibidas em regras rígidas de português.
5. Conferir no layout: leitura, tamanho, quebras, relação com imagem, CTA e destino.

Humanizer ajuda na etapa editorial. A validação de fatos e a adequação comercial continuam separadas. Conversão só pode ser avaliada com tráfego e medição; revisão visual não comprova aumento de leads.

## Voz: correção da recomendação do vídeo

O aviso do VoiceStudio identifica pesos padrão OmniVoice como CC-BY-NC e componentes com termos adicionais. O inventário consultado afirma que nenhuma seleção de produção está integralmente liberada comercialmente por sua revisão. Isso não significa que todos os modelos proíbam uso comercial.

Portanto, não recomendar VoxCPM2 ou CosyVoice 3 como automaticamente liberados apenas pela troca no menu. Antes de uso comercial: conferir repositório e revisão exatos, pesos e componentes selecionados, termos de saída e atribuição. Voz própria ou autorizada também é necessária. Não foi realizada compra, download de modelo ou clonagem de voz.

## Fluxo operacional adaptado

1. **Base:** ler AGENTS.md, brief atual, implementação e decisões aprovadas. Registrar o que deve permanecer.
2. **Lacunas:** perguntar apenas o que altera a decisão e não pode ser encontrado nas fontes disponíveis. Reutilizar respostas anteriores.
3. **Pesquisa específica:** formular a necessidade do componente; comparar a solução já instalada com a fonte externa. Conferir licença, versão, compatibilidade, manutenção, custo e forma de testar antes de adoção.
4. **Unidade representativa:** implementar uma parte que demonstre a proposta, dentro do escopo autorizado; verificar antes de multiplicar.
5. **Evidência:** separar testes técnicos, inspeção visual, revisão editorial e hipótese comercial. Para movimento, conferir scroll normal/reverso, transições, móvel e movimento reduzido em vídeo e quadros relevantes.
6. **Entrega:** informar alteração, evidência e limitações. Não criar aprovações adicionais para ajustes reversíveis já autorizados.

### Aplicação à Aura

Preservar abertura contínua, focos regionais, comparador automático/manual e MP4 entre os projetos selecionados. A landing e a gravação falam como Aura. A oferta de Gabriel e seu WhatsApp ficam no portfólio, junto ao filme. Não inventar clínica operacional, pacientes, depoimentos ou resultados. Manter identificação das imagens comparativas geradas.

## Instrução reutilizável para o Antigravity

> Leia AGENTS.md, docs/METODO-DE-QUALIDADE.md e docs/ADAPTACAO-REPOSITORIOS-VIDEO.md. Inspecione o código e reutilize o brief e as decisões aprovadas. Para a tarefa solicitada, identifique somente as lacunas relevantes, consulte fontes específicas e proponha critérios verificáveis. Implemente uma unidade representativa quando isso for necessário, valide com as ferramentas existentes e então amplie. Preserve a coreografia aprovada da Aura e a separação entre a marca e a oferta do portfólio. Não instale repositórios, plugins ou serviços apenas por estarem na lista do vídeo. Relate o que foi efetivamente observado e testado.

Esse texto transporta o método; não instala ferramentas nem sincroniza arquivos entre máquinas. O Antigravity precisa ter acesso ao documento na cópia local.

## Download autorizado e disponibilidade local

Após a pesquisa, o usuário autorizou baixar todos os seis repositórios. As cópias Git rasas estão em `/workspace/library-files/github-tools/`; os commits estão em `docs/research/video-repositories-lock.json`. São fontes completas da revisão baixada, sem histórico anterior, submódulos inicializados ou pesos externos.

Humanizer, Grill Me, Grilling (dependência de instruções do Grill Me) e o pacote completo ScrollCraft foram copiados para `.agents/skills/`, com licenças. Podem ser consultados por leitura explícita neste projeto. Isso não garante atualização instantânea do catálogo de skills da sessão.

Laya, VoiceStudio e REA estão baixados, mas não executáveis configurados: sem instalação Python/Node, modelos, chaves ou servidores. Também não houve execução dos scripts do ScrollCraft. Usar as instruções editoriais e de planejamento independe desses runtimes.

Para Antigravity, sincronizar estes arquivos do projeto e pedir leitura explícita de `.agents/skills/<nome>/SKILL.md`. As cópias em `/workspace/library-files/` pertencem a esta máquina; não são automaticamente transferidas ao computador local ou a outros ambientes. O lock registra URL e revisão para reproduzir o download. Não há configuração global de conta ou instalação em outros projetos.
