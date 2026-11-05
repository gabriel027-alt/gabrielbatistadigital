# Fluxo do projeto para Antigravity + Codex

Protocolo independente para aplicar as conclusões da análise de Sites Incríveis à aplicação existente. Não contém o motor ou a skill proprietária e não exige Claude Code. A licença do material original permanece relevante se ele for incorporado no futuro.

## Estado e limites

Trabalhar em revisao-site; preservar main e alterações locais. Sem deploy ou publicação por consequência deste documento. O retrato de Gabriel, os links e o contato oficial permanecem preservados. O protótipo Aura em /propostas/aura é estudo parcial e não tem direção visual aprovada. A rota antiga também permanece disponível. A pesquisa de referências comerciais de clínicas continua incompleta, não pode ser substituída por uma demonstração de efeitos.

## Responsabilidades entre os agentes

Um único agente edita uma unidade de trabalho por vez. O outro recebe commit, rota, critérios e pendências para inspeção. Não manter ambos alterando o mesmo componente em paralelo. Antes de editar, verificar branch, status e diferenças locais; sincronizar sem reset/clean forçado.

- Codex: inspecionar código, pesquisar fontes, justificar dependências, escrever especificação e testes, implementar quando for o executor da unidade. Usar documentação local de Next antes do código.
- Antigravity: abrir a versão sincronizada no navegador local, inspecionar scroll real e comparar referências, testar quando houver acesso a Chrome/dispositivo que a nuvem não possui. Também pode implementar uma unidade desde que assuma explicitamente a edição e devolva commit/diff.
- Quem executa precisa provar o resultado; o nome da ferramenta não determina autoridade. Capturas feitas na nuvem não demonstram o estado do clone Windows e vice-versa.

## Sequência antes da implementação

1. Consolidar contexto existente e formular apenas as perguntas cuja resposta não está na conversa, arquivos ou pesquisa. O agente propõe caminhos de composição; não exige que o usuário invente a solução técnica.
2. Investigar referências específicas: URL, conteúdo realmente consultado, efeito desejado, arquivo/versão, licença e limitações. Separar autorização estética, licença de código e direitos de imagens/fontes.
3. Escrever conteúdo e roteiro: objetivo de cada seção, informação necessária, estados de movimento, transições, ritmo e ação final. Crenças/emoções esperadas são hipóteses, não efeitos comprovados em pacientes.
4. Definir tokens e composição estática; manter paleta e texto como propostas até avaliação. Não mudar identidade só para diferir de outro projeto. Não confundir a marca de Gabriel com a marca de uma clínica.
5. Definir orçamento e verificação: peso de mídia, alvo de tempo de frame no dispositivo declarado, comportamento em redes lentas, teclado e movimento reduzido. Valores propostos não são métricas medidas.
6. Implementar apenas uma sequência representativa; conferir sua execução antes de multiplicar padrões no site completo. Uma aprovação de referências não é aprovação de qualquer composição derivada.

## Brief conhecido do Aura

| Tema | Estado |
| --- | --- |
| Produto de Gabriel | Landing pages para clínicas de estética, confirmado pelo usuário |
| Visitante do protótipo | Potencial paciente; público e contexto específicos ainda são hipótese de estudo |
| Intensidade desejada | Experiência fortemente animada e imersiva, confirmado |
| Referências aprovadas | Efeitos tipográficos Codrops 4, 5, 6, 7, 9; textos 25/27; cursor shader trail e Theatre tutorial como referências de movimento |
| Paleta | Berinjela/lavanda/damasco apenas proposta atual, não aprovação |
| Assets | Espaços fictícios locais; não são fotos de cliente. Não há modelo 3D clínico validado |
| Provas | Nenhum resultado, depoimento, credencial profissional ou quantidade de clientes para anunciar |
| Próxima ação real | Contato comercial com Gabriel; sem canal fictício de agendamento de pacientes |
| Lacunas essenciais | Posicionamento específico do estudo, seleção de procedimento se necessária, recursos visuais e forma do momento principal |

## Roteiro proposto para investigar, não layout aprovado

A história completa pode ter quatro momentos; implementar inicialmente só a abertura e sua transição para a avaliação. Não ampliar agora o protótipo para cumprir uma contagem de cenas.

| Momento | Conteúdo/função | Movimento a estudar | Alternativa |
| --- | --- | --- | --- |
| Abertura | Tornar claro o foco em cuidado com a pele e conduzir à informação | Título se organiza pelo princípio do efeito 4 ou 6; enquadramento do espaço se transforma com o scroll | Título completo e imagem estática; link alcançável imediatamente |
| Primeira avaliação | Explicar perguntas e como uma decisão é preparada | Um palco temporário conecta espaço, texto e tópicos por estados; comparar transformação de layout com efeito 25/27, sem pôr todo o parágrafo em movimento ao mesmo tempo | Conteúdo linear, sem sobreposição ou foco oculto |
| Apresentação específica | Mostrar atendimento ou recurso apenas se houver definição e conteúdo | Candidato a pico: explorar espaço ilustrativo ou produto 3D licenciado. Se não existir asset pertinente, usar composição de mídia sem chamar de 3D | Fotografias/HTML com a mesma informação |
| Encerramento | Delimitar estudo fictício e permitir contato sobre o serviço de Gabriel | Composição resolve e dá lugar à ação; sem exigir terminar uma sequência para acessar o link | Link simples com destino oficial |

Para cada interação preencher antes de codificar: alvo; referência; gatilho; intervalo de scroll; início/meio/fim; retorno; adaptação por largura; alternativa sem JS; movimento reduzido; custo de execução; forma de verificar. Não prometer uma assinatura totalmente inédita. O cursor pode ser complementar, mas não substitui a narrativa e não é funcionalidade de toque.

## Integração técnica na base existente

- Usar rotas e componentes existentes, Server Components para estrutura e pequenas fronteiras cliente para movimento/interação.
- Evitar scripts que alterem filhos de elementos geridos pelo React. Letras e palavras devem ser estruturadas preservando significado, acentos e nome acessível.
- Qualquer motor precisa de escopo por contêiner, inicialização idempotente e dispose de listeners/observers/RAF ao desmontar. Não aplicar alterações globais ao html/body que sobrevivam à rota.
- Escolher CSS nativo, GSAP ou outra biblioteca a partir da coreografia. CSS nativo é válido se reproduz os estados necessários; não usá-lo como justificativa para reduzir o efeito aprovado. WebGL/Three e Theatre só quando a função justificar dependência e licença.
- Não importar versões antigas dos tutoriais. Conferir versões publicadas e peer dependencies, fixar versões de integração e medir custo de bundle/mídia.
- Progresso de cena e mudança de layout precisam considerar assets carregados e resize. Medir a janela de exibição, não apenas largura intrínseca do trilho.
- Responder dinamicamente a prefers-reduced-motion e ao botão de desativar. Conteúdo essencial visível por padrão e em falhas; etapas ocultas não podem receber foco. Sem animação, preservar ordem e conteúdo.
- Não adicionar motores concorrentes ao mesmo transform. Isolar elementos/camadas de movimento e evitar trabalho contínuo fora da tela.

## Verificação adaptada

Reutilizar @playwright/test e @axe-core/playwright já presentes. Rodar Next, não o servidor estático do pacote. Na nuvem, usar PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium; no Windows, usar instalação compatível do navegador sem fixar caminho Linux. Não instalar mais browsers por rotina.

Registrar por cenário: commit, URL/porta, navegador, viewport, preferência de movimento, estado e limitações. Percorrer scroll progressivo e reverso; capturar pontos de transição com vídeo e imagens. Aguardar fontes e mídia relevantes sem depender somente de networkidle e pausas fixas. Percorrer teclado, disclosures, ações, falhas de assets, mudanças de tema quando previstas, desativação de movimento e navegação de rota ida/volta.

Capturas mínimas: desktop, mobile com toque emulado e ambos com movimento reduzido; teste adicional sem JS. Conferir larguras pequenas e zoom. Medir desempenho no ambiente nomeado e comparar com versão estática. Toque e fluidez em aparelho físico ficam pendentes quando não houver acesso; não declarar validação iOS por emulação Chromium.

Critérios finais separados: técnica; semântica/acessibilidade; fidelidade visual aos efeitos selecionados; sequência de movimento; conteúdo factual; desempenho medido. Nenhum desses, sozinho, aprova o conjunto. Bugs devem ser corrigidos e a verificação pertinente repetida.

## Handoff curto para o Antigravity

> Leia AGENTS.md, docs/METODO-DE-QUALIDADE.md, docs/REFERENCIAS-ESCOLHIDAS-MOVIMENTO.md e docs/ADAPTACAO-ANTIGRAVITY-CODEX.md. Confira branch, commit e alterações locais antes de sincronizar revisao-site. O Aura atual é estudo parcial e não está aprovado como direção final. Inspecione /propostas/aura no servidor confirmado, com scroll normal e reverso, teclado, mobile e movimento reduzido. Entregue capturas/vídeo e problemas concretos, distinguindo observações de hipóteses. Não reconstrua a página inteira, instale o pacote proprietário, altere retrato ou faça deploy por consequência desta inspeção. Se assumir uma unidade de implementação, registre os arquivos sob sua responsabilidade antes de editar e devolva o commit com as verificações.

Este handoff é instrução para o trabalho futuro, não alegação de que a inspeção do Windows já ocorreu.
