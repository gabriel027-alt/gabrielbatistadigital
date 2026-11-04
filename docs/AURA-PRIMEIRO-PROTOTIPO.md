# Aura: primeira unidade de protótipo

## Escopo e diagnóstico

Estudo de clínica fictícia, em /propostas/aura. A rota /conceitos/aura-aesthetics e o portfólio permanecem preservados. Inspeção do Aura existente: hero de objetos decorativos, texto abstrato, coleção de etapas e seções repetidas compartilhadas com arquitetura/relojoaria. Não apresenta uma oferta de clínica específica. Imagens locais aura-escuta e aura-cuidado retratam espaços fictícios, não instalações de cliente.

Unidade: abertura e primeira avaliação; encerramento de revisão com contato comercial real de Gabriel. Sem cadastro ou agendamento de pacientes. Não inserir credenciais, profissionais, depoimentos ou resultados fictícios como evidência. Imagens são ilustrativas do estudo.

## Direção proposta

Base berinjela #291e2b, lavanda fria #eeedf4 e damasco #edb69e. Contraste de arquitetura quente e superfície fria. Não altera a paleta da marca de Gabriel. Uma família sans existente, Manrope, em escala de título ampla; composição assimétrica com imagem arquitetônica dominante, sem grades de cartões ou números decorativos. Conteúdo factual sobre o conceito de primeira conversa, sem conselho médico.

## Referências e lacunas

Codrops: efeitos de tipografia 4 e 6 escolhidos pelo usuário, adaptação do princípio de convergência e rotação de letras, não cópia pixel a pixel. Navegação e texto sem movimento devem permanecer acessíveis. REA e bibliotecas 3D não são requisitos desta unidade. A comparação externa de clínicas continua pendente por acesso restrito; nenhuma hipótese comercial é apresentada como pesquisa validada.

## Movimento e arquitetura

Priorizar animação nativa CSS ligada à rolagem quando suportada; fallback legível e estático quando ausente, sem JavaScript ou com movimento reduzido. O suporte e a geometria devem ser conferidos no Chromium disponível. Não reivindicar equivalência completa ao GSAP do exemplo. Só justificar dependência adicional se esta unidade demonstrar uma limitação concreta. Movimento de entrada não deve atrasar links ou o acesso ao conteúdo.

## Verificação prevista

Capturas desktop e mobile, rolagem e links internos, ausência de overflow, contraste/axe e movimento reduzido. Build/lint e testes focados. Não há teste em celular físico nem validação comercial. As capturas atuais são evidência do protótipo, não aprovação estética do usuário.

## Implementação e revisão

Rota /propostas/aura criada com CSS Modules e controle cliente pequeno de movimento. Sem nova biblioteca. As imagens locais foram reaproveitadas, preservando a informação de que são ilustrativas; diferem da arquitetura mostrada na imagem de conceito. O mockup gerado é uma proposta de direção, não aprovação do usuário nem especificação de fidelidade final.

Capturas em preview/aura-study/: concept.webp, desktop.webp, mobile.webp, scroll.webp. Inspeção renderizada do Aura antigo e da nova proposta feita com Playwright/Chromium, pois não há ferramenta Browser conectada. Capturas desktop/mobile feitas com movimento reduzido para legibilidade, e captura de scroll adicional com movimento ativo. Suporte CSS animation-timeline confirmado no Chromium; fallback nos demais depende da regra @supports. Não foram feitas medições de frame/GPU ou testes em celular físico.

A hero usa entrada tipográfica; título da seção de avaliação e enquadramento da imagem usam scroll. Não há shader de cursor, cena 3D ou integração Theatre neste primeiro trecho; continuam referências para estudos específicos. Não anunciar esta unidade como landing completa. Não houve comparação externa de clínicas por bloqueio de acesso.

Verificação concluída: npm run lint e npm run build aprovados; dois testes Playwright focados aprovados em 11,4s. Auditoria axe sem violações nos critérios automatizados selecionados, overflow verificado entre 360 e 1920px, controle de movimento e disclosure sem JavaScript verificados. Isso não equivale a certificação integral de acessibilidade ou aprovação estética.

## Correção de escopo pelo usuário: imersão é requisito

O usuário reafirmou que os critérios de pesquisa, especificidade, copy, direção de arte, animação e validação de seu portfólio também se aplicam aos protótipos de clientes. O trecho atual não atende ainda à intensidade de movimento e imersão solicitada. Não tratar a paleta, a composição ou a animação atuais como aprovadas. Testes técnicos aprovados não resolvem esta lacuna.

Antes da próxima implementação, produzir um roteiro de movimento por seção: objetivo, gatilho, estados inicial/intermediário/final, comportamento ao voltar o scroll, texto legível, mídia/câmera, relação com a seção seguinte, alternativa móvel e movimento reduzido. Confrontar esse roteiro com os efeitos Codrops selecionados e com os repositórios fornecidos; não substituir os efeitos escolhidos por animações genéricas sem justificar e demonstrar a adaptação.

Investigar uma sequência representativa com tipografia coreografada, transformação de layout/mídia e continuidade entre seções. Definir a função do 3D ou shader e verificar código, versões, licença e desempenho antes da integração. Uma imagem estática com parallax não deve ser apresentada como experiência 3D. Não adicionar uma cena decorativa desconectada da clínica para cumprir uma lista de tecnologias.

A história, os serviços, as imagens e a linguagem precisam distinguir o cliente fictício de outros estudos. Nenhum depoimento, resultado, credencial ou prova inventada. A paleta é uma proposta de identidade por cliente; não repetir uma fórmula visual em todos os nichos. Preservar a fisionomia de Gabriel e a identidade do portfólio quando trabalhar nele.

Critério de revisão: vídeo da sequência real no navegador, além de capturas estáticas, demonstração móvel e alternativa acessível. Registrar fluidez e carregamento no ambiente testado, sem presumir desempenho em celular físico ou efeito comercial. Primeiro trecho coreografado e comparado com referências antes de ampliar a página. O estado atual permanece estudo inicial, não protótipo final de alto padrão.
