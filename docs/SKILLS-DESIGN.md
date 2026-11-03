# Skills para o próximo ciclo visual

## Instaladas no repositório

1. [frontend-design](../.agent/skills/frontend-design/SKILL.md): direção, tipografia, composição, conteúdo e crítica de padrões genéricos.
2. [webapp-testing](../.agent/skills/webapp-testing/SKILL.md): inspeção do estado renderizado, interações, capturas e logs com Playwright.

Fonte e commit em [.agent/skills/SOURCES.md](../.agent/skills/SOURCES.md). Os arquivos e licenças foram preservados. Não se trata de componentes prontos, geração de vídeos, acesso ao Windows ou garantia de bom design.

## Ativar no Antigravity

Atualize o clone pela branch revisao-site e abra uma conversa nova no workspace do clone. Peça explicitamente para ler os dois SKILL.md. A descoberta automática depende da versão do agente; a leitura explícita funciona mesmo quando a interface não lista as skills. Não basta o agente afirmar que usou: ele deve apontar os arquivos lidos e produzir os resultados abaixo.

## Primeiro uso: crítica, sem nova implementação automática

A última proposta foi rejeitada. Não usar sua aparência como direção aprovada e não fazer mais uma troca de paleta com a mesma estrutura.

- Ler o contexto e a referência fornecida. Distinguir o que foi visto no navegador do que foi inferido do HTML. Sem CSS/assets da referência, não declarar reprodução visual exata.
- Abrir a página atual e identificar, com capturas, os cinco problemas visuais de maior impacto. Se não houver navegador, informar a limitação e continuar a análise estática sem inventar observação visual.
- Criar duas composições estáticas concretas para a abertura e primeira apresentação de projetos, com o conteúdo e a fotografia aprovados. São propostas de layout, não duas versões completas do site. Registrar paleta, tipografia, hierarquia, enquadramento e razão de cada escolha.
- Comparar as propostas com os critérios do usuário: personalidade, sofisticação, presença humana, movimento com propósito e leitura comercial imediata. A escolha da direção vem antes de reconstruir todo o restante.
- Separar revisão estética de lint/build/testes. Um teste passando não aprova a composição.

## Limites do projeto

Preservar a fisionomia da fotografia e o WhatsApp oficial. Não gerar poses ou barba, inventar clientes, depoimentos, números de resultado nem trocar estudos autorais por alegações de trabalhos contratados. A identificação pode ser discreta e não precisa se repetir em cada cartão.

Usar os testes Playwright existentes quando atendem à tarefa. A skill de testing traz exemplos Python, mas não exige migrar a aplicação ou a suíte TypeScript. Se o helper for necessário, executar --help primeiro e verificar as dependências disponíveis. Não instalar navegadores repetidamente se uma alternativa local compatível já está disponível.

Animação deve ser descrita por elemento, gatilho, comportamento e fallback. Não instalar GSAP, Motion ou outro motor só por instalar; escolher depois que a interação estiver definida. Respeitar toque, teclado, pausa e movimento reduzido.

## Critério para adicionar outras skills

Adicionar apenas quando surgir uma necessidade concreta que as duas não atendam. Verificar fonte, licença, scripts, dependências e conflitos com as regras do projeto. Evitar pacotes grandes de skills sobrepostas e regras globais enormes. Nesta revisão não foram instaladas bibliotecas nem alterada a interface do site.
