"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Olá! Sou o assistente de inteligência da **Gabriel Batista Digital**. Como posso ajudar a transformar a presença digital e os resultados do seu negócio hoje?",
  },
];

const SUGGESTIONS = [
  "Quais serviços de engenharia web vocês oferecem?",
  "Como funciona o design de Landing Pages?",
  "Como funciona o serviço de SEO local?",
  "Quero falar com o Gabriel no WhatsApp",
];

const WHATSAPP_URL = "https://wa.me/5538998267717";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Placeholder para a resposta em streaming
    const assistantIndex = updatedMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Erro na resposta do servidor.";
        try {
          const errData = await response.json();
          errorMsg = errData.details || errData.error || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Stream não suportado pelo navegador.");
      }

      const decoder = new TextDecoder("utf-8");
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        const contentSnapshot = fullContent;

        setMessages((prev) => {
          const next = [...prev];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              role: "assistant",
              content: contentSnapshot,
            };
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Não foi possível obter resposta.";

      setMessages((prev) => {
        const next = [...prev];
        if (next[assistantIndex]) {
          next[assistantIndex] = {
            role: "assistant",
            content: `⚠️ ${errorMessage}\n\nVocê também pode falar diretamente no [WhatsApp do Gabriel Batista](${WHATSAPP_URL}).`,
          };
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Botão Flutuante de Abertura */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente virtual"
          className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2.5 rounded-full border border-[#DFEF8B]/30 bg-[#111210]/95 px-5 py-3.5 text-sm font-medium text-[#F5F4EE] shadow-2xl backdrop-blur-md transition-all hover:border-[#DFEF8B] hover:text-[#DFEF8B] hover:-translate-y-0.5"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DFEF8B] opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#DFEF8B]"></span>
          </span>
          <span>Assistente IA</span>
        </button>
      )}

      {/* Janela do Chat Assistant */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 right-5 sm:right-auto sm:w-[420px] z-50 flex flex-col h-[560px] max-h-[85vh] rounded-2xl border border-white/10 bg-[#111210]/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DFEF8B]/10 text-xs font-semibold text-[#DFEF8B] border border-[#DFEF8B]/20">
                GB
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#DFEF8B]">
                  Gabriel Batista Digital
                </p>
                <p className="text-xs text-[#F5F4EE]/60 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  OpenAI Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Conversar pelo WhatsApp"
                className="text-xs text-[#DFEF8B] hover:underline px-2 py-1"
              >
                WhatsApp ↗
              </a>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar assistente"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-[10px] text-[#F5F4EE]/40 mb-1 px-1">
                  {msg.role === "user" ? "Você" : "Assistente"}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#DFEF8B] text-[#111210] font-medium rounded-br-xs"
                      : "bg-white/[0.05] border border-white/10 text-[#F5F4EE] rounded-bl-xs"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex items-center gap-1 text-[#DFEF8B]">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Sugestões rápidas se houver apenas a mensagem de boas-vindas */}
            {messages.length === 1 && (
              <div className="pt-2">
                <p className="text-[11px] uppercase tracking-wider text-[#F5F4EE]/40 mb-2">
                  Sugestões de perguntas:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => sendMessage(sug)}
                      className="text-left text-xs text-[#F5F4EE]/80 bg-white/[0.025] hover:bg-white/[0.07] border border-white/10 rounded-xl px-3 py-2 transition-all hover:text-[#DFEF8B] hover:border-[#DFEF8B]/40"
                    >
                      {sug} ↗
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input e Envio */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-3 bg-white/[0.01]"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte sobre projetos, prazos, tecnologias..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F5F4EE] placeholder-white/30 focus:outline-none focus:border-[#DFEF8B]/60 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-10 px-4 rounded-xl bg-[#DFEF8B] text-[#111210] text-sm font-semibold hover:bg-[#c9da74] disabled:opacity-40 disabled:hover:bg-[#DFEF8B] transition-colors"
              >
                {isLoading ? "..." : "Enviar"}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#F5F4EE]/40">
              Alimentado pela OpenAI · Gabriel Batista Digital
            </p>
          </form>
        </div>
      )}
    </>
  );
}
