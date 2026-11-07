> Correção de escopo: a oferta comercial foi retirada do interior da Aura. A captação de donos de clínicas permanece no portfólio, junto ao filme. As recomendações abaixo sobre o encerramento comercial interno são históricas; ver [a separação corrigida](AURA-APRESENTACAO-CLIENTE.md).

# Aura — auditoria editorial e de conversão

## Objetivo confirmado

Dono de clínica → conversar com Gabriel sobre contratar um site. A Aura é apresentada por filme entre seis projetos do portfólio; não recebe pacientes ou marca consultas. Esta revisão cobre a Aura inteira e os pontos relevantes da jornada na homepage (projetos, serviços, FAQ e WhatsApp), sem redesenhar os demais projetos.

## Evidência e referências

Leitura da implementação atual, brief histórico, referências de movimento escolhidas pelo usuário e skills frontend-design / webapp-testing. O movimento aprovado e a personagem são preservados. Não houve nova inspeção de sites premiados externos: os acessos anteriores ao Awwwards foram bloqueados, e não há ferramenta de pesquisa conectada nesta sessão. Não declarar certificação, prêmio ou equivalência a sites avaliados.

Awwwards é referência de direção de arte, criatividade, usabilidade e conteúdo; não comprova geração de leads. O critério comercial desta revisão é clareza de público/oferta, caminho de contato, destino verdadeiro e ausência de fricção desnecessária. Referência de contraste: WCAG 2.2, contraste mínimo de texto (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Os ratios abaixo foram calculados com luminância relativa sRGB; não representam inspeção de cada pixel sobre fotografias.

## Diagnóstico e ação

| Ponto | Problema encontrado | Decisão / evidência verificável |
|---|---|---|
| Público no encerramento | A seção explicava avaliação facial para pacientes, mas a conversão desejada é de donos de clínicas. | Substituída por oferta de site, CTA e dúvidas de contratação. Sem canal de agendamento fictício. |
| Imagem de recepção | Imagem ilustrativa extensa sem prova da operação de uma clínica real; prolongava o caminho. | Retirada desse encerramento. Personagem e comparações seguem identificadas como ilustração. |
| CTA junto ao filme | O cartão terminava em reprodução, sem próximo passo comercial específico. | Link “Quero um site para minha clínica” ao WhatsApp de Gabriel, disponível antes de assistir. |
| CTA da abertura | “Entender a avaliação” levava a conteúdo clínico; o link O olhar apontava ao topo do próprio palco. | “Ver o rosto em detalhe” conduz ao primeiro foco no modo animado; navegação apresenta também “Seu próximo site” e “Falar com Gabriel”. |
| Rodapé | Contato comercial verdadeiro, mas pouco destacado e distante de uma oferta clara. | CTA laranja, mesmo objetivo e destino do bloco comercial; autoria explícita. |
| WhatsApp | Número oficial correto, mensagem antiga pouco alinhada à contratação de site. | Link centralizado em lib/aura-contact.ts usando lib/whatsapp.ts / siteConfig. Mensagens identificam filme ou projeto Aura e o interesse num site para clínica. Não enviam mensagens automaticamente. |
| Provas | Não existem pacientes, depoimentos ou métricas comerciais autorizados. | Não foram inventados. Prova apresentada: a própria experiência visual e funcional. |
| Consistência da homepage | FAQ dizia que todos os projetos abriam interfaces, embora Aura agora seja filme. | Texto corrigido para interfaces disponíveis e filmes. Outros cinco cartões preservados. |
| Formulário / atendimento | O portfólio já permite contato direto e diagnóstico opcional sem cadastro. | Preservados; nenhum novo formulário de saúde, pedido de dados de paciente ou etapa obrigatória antes do contato. |

## Paleta, hierarquia e contraste

Paleta mantida: espresso #201714, branco mineral #f2f1eb e acento #ff704d. Não há evidência para trocar cores por preferência arbitrária ou atribuir a uma cor uma promessa de conversão.

- Texto branco mineral / espresso: **15,54:1**.
- Texto espresso / botão laranja: **6,43:1**.
- Texto de apoio cobre claro #e8b197 / espresso: **9,35:1**.
- Texto de apoio #d6c2b8 / espresso: **10,27:1**.

Esses pares superam 4,5:1 para texto normal. O foco dos CTAs foi separado por superfície: claro sobre escuro, escuro sobre claro. O cartão do portfólio herda tokens próprios nos dois temas. CTA primário não depende apenas de cor: tem texto de ação, área de toque e destino identificável. Contraste sobre a fotografia e composição continuam exigindo inspeção visual; axe não comprova sozinho acessibilidade integral.

## Copy e objeções

A nova copy explica o que o site ajuda a apresentar, quem cria e qual ação tomar. Não promete faturamento, número de leads, posição no Google, prazo, preço ou retorno garantido. As dúvidas tratam de fotos/textos, identidade e definição de escopo. O CTA aparece antes delas; abrir todos os detalhes não é condição para conversar. As explicações regionais não são aconselhamento médico nem resultados de pacientes.

## O que ainda não está comprovado

Não há dados de tráfego, taxa de reprodução, conclusão de filme, cliques, contatos iniciados ou leads qualificados. Não houve teste com donos de clínicas, ensaio em aparelhos físicos ou medição de Core Web Vitals nesta revisão. Portanto a entrega é uma jornada mais coerente e testável, não uma garantia de conversão.

Próxima validação comercial: registrar visualizações da peça, reprodução/conclusão, cliques no CTA e conversas qualificadas atribuídas à Aura. As mensagens preparadas ajudam a identificar a origem, mas não substituem analytics nem confirmam envio. Instrumentação, consentimento aplicável e CRM devem ser definidos antes de instalar rastreamento; nada disso foi instalado silenciosamente.

As dúvidas do encerramento são hipóteses editoriais para reduzir atrito na contratação, não resultados de entrevistas ou pesquisa de objeções. Devem ser confrontadas com as conversas reais de donos de clínicas.

## Verificação desta revisão

Build de produção/TypeScript e lint aprovados. 21 cenários distintos passaram: 19 da Aura/experiência, incluindo um repetido após corrigir o seletor de FAQ do teste, e mais dois de catálogo/homepage. Entre eles: axe nos critérios WCAG selecionados, CTA em ambos os temas, larguras 360–1920 px sem overflow, navegação ao foco inicial, quatro focos e reversão, comparador automático/manual/toque, pausa, movimento reduzido, ausência de JS, destino e texto do WhatsApp e preservação dos seis projetos/20 entradas.

Capturas desktop/mobile do encerramento e CTA do filme foram examinadas em docs/preview/aura-conversion. Filme H.264 regravado no navegador, 40,52 s, cerca de 1,5 MB, sem erros de execução; capa atualizada. O novo fechamento comercial aparece no filme. Não foram abertas conversas nem enviadas mensagens no WhatsApp. Sem deploy e sem instrumentos de rastreamento adicionados.
