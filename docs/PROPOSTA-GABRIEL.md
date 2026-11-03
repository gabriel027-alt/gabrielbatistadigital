# Proposta de abertura — GABRIEL

Rota separada: `/propostas/gabriel`. Não substitui a página principal. Sem indexação, sem deploy.

## Decisões atuais

GABRIEL é o nome principal, Batista Digital identifica a assinatura. Grafite #101114, texto branco frio #F5F6F7, vermelho #CE352C nas ações. No tema claro: branco frio, texto grafite e vermelho #B92B25 para contraste. Oferta à esquerda, retrato central, assinatura à direita. Em telas estreitas, a oferta e o contato vêm antes da foto, com a assinatura abaixo. A página tem a primeira apresentação de projeto para avaliar continuidade. Não há animação ou 3D nesta etapa.

## Fotografia

A imagem aprovada é o retrato frontal com roupa preta e luz vermelha suave, enviado na conversa após a análise do método CREATE. A última geração feita por este agente foi rejeitada; ela NÃO deve ser usada.

O arquivo original da imagem aprovada não estava disponível no workspace na implementação. Não foi substituído por outro rosto, reconstruído ou gerado novamente. Para concluir a integração, adicionar exatamente o original aprovado em:

`public/images/hero/gabriel-approved-red.png`

A rota verifica esse arquivo em cada requisição. Até que exista, permite selecionar um PNG/JPEG/WebP local. A seleção usa URL de objeto no navegador, sem POST, sem armazenamento remoto, sem filtros e sem alteração do arquivo. Depois de recarregar, a seleção local precisa ser refeita. É um recurso de revisão da proposta, não um upload de produção.

A máscara da composição suaviza somente as bordas externas. Não aplicar luzes ou filtros CSS sobre o rosto. Não gerar nova foto ou usar a versão rejeitada para preencher a ausência do arquivo.

## Limite de validação

A composição, estados, temas, responsividade e seleção local podem ser testados sem a fotografia original. Isso não equivale a validar o enquadramento do retrato aprovado: essa conferência depende do arquivo. Não anunciar a hero finalizada com a foto correta antes dessa integração.

Verificações: lint, build, tipagem e dois testes específicos aprovados. Os testes verificam seleção local sem envio de arquivo, preservação da URL da imagem entre temas, ausência de filtros, contato oficial, seis larguras e acessibilidade nos dois temas. A imagem de teste é um PNG sintético de 1 pixel, exclusivamente para verificar o mecanismo de seleção; não é o retrato aprovado nem uma validação de sua composição. A revisão visual desta etapa cobriu os estados sem retrato em desktop e celular.
