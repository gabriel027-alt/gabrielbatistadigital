# Configuração reutilizável no Antigravity

## Regra global

O arquivo [GEMINI.md](GEMINI.md) é independente de marca, domínio, linguagem ou projeto. É uma base curta de critérios e roteamento; não contém as sete skills inteiras. Isso evita repetir o problema anterior de exceder o limite de tokens da regra global.

No Windows, o arquivo global mostrado pelo Antigravity neste histórico é `%USERPROFILE%\.gemini\GEMINI.md`. Prefira abrir a regra Global pela interface de Customizations / Rules para confirmar o arquivo realmente usado na versão instalada. Preserve uma cópia da regra anterior e consolide regras úteis; não apenas acrescente esta base embaixo de um arquivo já enorme.

O repositório guarda a proposta. Esta atualização NÃO acessa nem modifica automaticamente a configuração global do Windows.

## Skills disponíveis em qualquer workspace

As skills atuais foram instaladas no projeto, em `.agent/skills/`. A regra global não instala suas pastas nem garante que existam em outro projeto.

Se a versão instalada do Antigravity reconhecer skills globais em `%USERPROFILE%\.gemini\antigravity\skills\`, elas podem ser colocadas ali com suas referências. Verifique o suporte e a descoberta na versão local antes de considerar a instalação global concluída. Caso não reconheça, mantenha uma biblioteca central e copie as skills necessárias para `.agent/skills/` em cada projeto.

Ao mover as skills, preserve SKILL.md, licenças, scripts, referências e caminhos relativos. Neste pacote, web-3d-asset-pipeline usa `../../references/`: copiar somente a pasta da skill perde suas dependências. Em uma instalação global com a mesma estrutura, a pasta de referências precisa continuar dois níveis acima do SKILL.md. Não copie arquivos incompletos nem sobrescreva skills já existentes sem comparação.

## Comunidade

Há outros catálogos, por exemplo:

- https://github.com/vercel-labs/agent-skills — práticas do ecossistema Vercel, incluindo frontend.
- https://github.com/obra/superpowers — workflows de desenvolvimento.
- https://github.com/openai/plugins — catálogo atual de plugins, com autores OpenAI e parceiros.
- https://github.com/anthropics/skills — skills de referência e exemplos.

Cada pacote precisa de avaliação própria. Existir no GitHub não atesta qualidade, compatibilidade ou segurança. Antes de instalar: leia a skill, confira licença, scripts, referências, ferramentas exigidas e possíveis conflitos com o workflow existente. Fixe a revisão usada e registre a origem. Não execute instaladores ou scripts apenas porque foram mencionados em uma página.

Regras globais são critérios estáveis. Skills são procedimentos aplicáveis ao contexto. Bibliotecas como GSAP e Three.js são dependências de cada aplicação. Conectores MCP são ferramentas do ambiente. São quatro camadas diferentes; uma não substitui a instalação da outra.
