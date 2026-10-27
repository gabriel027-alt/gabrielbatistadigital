import {
  getOpenAIClient,
  AGENCY_SYSTEM_PROMPT,
  DEFAULT_OPENAI_MODEL,
} from "@/lib/openai";

export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Health check e status da integração OpenAI
 */
export async function GET() {
  if (process.env.ENABLE_AI_ASSISTANT !== "true")
    return Response.json({ error: "Not found" }, { status: 404 });
  const isConfigured = Boolean(process.env.OPENAI_API_KEY?.trim());

  return Response.json({
    status: "ok",
    service: "Gabriel Batista Digital - AI Assistant API",
    openaiConfigured: isConfigured,
    model: DEFAULT_OPENAI_MODEL,
    message: isConfigured
      ? "API pronta para receber requisições de chat."
      : "Atenção: OPENAI_API_KEY não foi configurada no arquivo .env.local.",
  });
}

/**
 * Endpoint de conversação com o assistente da agência via OpenAI
 */
export async function POST(request: Request) {
  if (process.env.ENABLE_AI_ASSISTANT !== "true")
    return Response.json({ error: "Not found" }, { status: 404 });
  try {
    let body: { messages?: ChatMessage[]; stream?: boolean };

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          error:
            "Corpo da requisição inválido. Envie um JSON com o array 'messages'.",
        },
        { status: 400 },
      );
    }

    const { messages, stream = true } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        {
          error:
            "O campo 'messages' é obrigatório e deve conter ao menos uma mensagem.",
        },
        { status: 400 },
      );
    }

    // Validação e sanitização das mensagens recebidas
    const validRoles = new Set(["user", "assistant", "system"]);
    const sanitizedMessages = messages
      .filter(
        (msg) =>
          validRoles.has(msg.role) &&
          typeof msg.content === "string" &&
          msg.content.trim() !== "",
      )
      .map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      return Response.json(
        { error: "Nenhuma mensagem válida encontrada no array." },
        { status: 400 },
      );
    }

    // Inicializa o cliente OpenAI
    let openai;
    try {
      openai = getOpenAIClient();
    } catch (configError) {
      const errorMessage =
        configError instanceof Error
          ? configError.message
          : "Chave de API não configurada.";
      return Response.json({ error: errorMessage }, { status: 500 });
    }

    // Monta o payload completo incluindo o System Prompt especializado da agência
    const completeMessages = [
      { role: "system" as const, content: AGENCY_SYSTEM_PROMPT },
      ...sanitizedMessages,
    ];

    const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

    // Modo Streaming (padrão)
    if (stream) {
      const openaiStream = await openai.chat.completions.create({
        model,
        messages: completeMessages,
        stream: true,
        temperature: 0.7,
      });

      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of openaiStream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (streamErr) {
            controller.error(streamErr);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Modo JSON síncrono
    const completion = await openai.chat.completions.create({
      model,
      messages: completeMessages,
      stream: false,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";

    return Response.json({
      role: "assistant",
      content: reply,
      model,
    });
  } catch (error: unknown) {
    console.error("[OpenAI Chat Route Error]:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro interno ao processar sua mensagem.";

    return Response.json(
      {
        error: "Falha na comunicação com a OpenAI.",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
