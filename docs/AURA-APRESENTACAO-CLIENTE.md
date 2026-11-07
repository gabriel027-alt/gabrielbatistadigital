# Aura — identidade própria na apresentação

O usuário esclareceu que a peça exibida no portfólio deve ter acabamento de um site de cliente. A oferta “site para sua clínica” inserida dentro da Aura quebrava a identidade e foi retirada. O público comprador continua sendo dono de clínica, mas a conversão acontece fora do filme, na página de Gabriel.

## Alterações

- Removidos bloco de venda de criação de site, dúvidas de contratação, chamadas a Gabriel e WhatsApp da agência no interior da Aura.
- Navegação passa a “O olhar”, “Comparar” e “A abordagem”, com destinos internos funcionais.
- Comparador recebe texto voltado à observação de volumes/contornos. Identificação de ilustração permanece; não apresentar como paciente real.
- Encerramento próprio: “A harmonia está no conjunto”, texto de leitura facial, replay do comparador e assinatura Aura. Sem foto de recepção decorativa ou seções comerciais genéricas.
- Sem nomes de profissionais, registros, endereços, depoimentos ou canais de agendamento inventados.
- Preservados câmera, focos, antes/depois ilustrativo, prioridade manual do comparador, toque/teclado e alternativa com movimento reduzido.
- Portfólio mantém a oferta real de Gabriel junto ao vídeo. A rota de revisão não recebe tráfego por link do cartão.

Essa separação dá coerência de marca à apresentação, sem afirmar que a clínica é cliente contratado. A landing não recebe novos contatos de pacientes: não há dados operacionais de uma clínica fornecidos. O filme mostra a experiência e a marca; o CTA externo capta interessados no trabalho de Gabriel.

Mídia é regravada a partir da implementação para eliminar textos comerciais da agência e atualizar capa e legendas. Sem deploy.

## Verificação

Build/TypeScript, lint e 19 cenários aprovados. Cobrem ausência de ofertas da agência dentro da Aura, contato real preservado no cartão do portfólio, navegação, contraste/axe, larguras de 360 a 1920 px, scroll reversível, comparação manual/automática, toque, teclado e ausência de JS. Verificação de âncoras: nenhum destino ausente; captura móvel sem overflow. Encerramento desktop/mobile e último quadro do filme inspecionados em docs/preview/aura-delivery. Filme regravado: 39.36 s, 1.46 MiB, sem erros de execução. Sem prova clínica, cliente contratado ou teste físico alegados.
