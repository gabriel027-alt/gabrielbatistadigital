"use client";
import { useEffect, useRef, useState } from "react";
import {
  questions,
  getRecommendation,
  diagnosisMessage,
} from "@/lib/diagnosis";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Asterisk, Arrow } from "../ui/icons";
import { SectionLabel } from "../ui/shared";
export function Contact() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const title = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    title.current?.focus();
  }, [step]);
  const result = getRecommendation(answers[0], answers[1]);
  return (
    <section id="contato" className="contact-section">
      <div className="shell contact-layout">
        <div className="contact-copy">
          <SectionLabel number="07">
            O PRÓXIMO CAPÍTULO COMEÇA AQUI
          </SectionLabel>
          <h2>
            Uma boa conversa.
            <br />
            <span className="serif">Um novo começo.</span>
          </h2>
          <p>
            Tem uma ideia que merece sair do comum?
            <br />
            Vamos encontrar a melhor forma de construir.
          </p>
          <a
            className="button button-primary"
            href={buildWhatsAppUrl(
              "Olá, quero conversar sobre meu próximo projeto.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar pelo WhatsApp <Arrow />
          </a>
          <span className="contact-note">
            DIRETO AO PONTO. SEM COMPROMISSO.
          </span>
          <Asterisk className="contact-asterisk" size={90} />
        </div>
        <div className="diagnosis">
          <div className="diagnosis-top">
            <span>UM PONTO DE PARTIDA</span>
            <span>
              {step < 0
                ? "GBD / DIAGNÓSTICO"
                : step < 3
                  ? `0${step + 1} / 03`
                  : "CONCLUÍDO"}
            </span>
          </div>
          <div className="diagnosis-body">
            {step === -1 ? (
              <>
                <p className="eyebrow accent">CLAREZA ANTES DO CÓDIGO</p>
                <h3 ref={title} tabIndex={-1}>
                  Por onde
                  <br />
                  começamos?
                </h3>
                <p>
                  Três perguntas para entender seu momento e levar contexto à
                  nossa conversa.
                </p>
                <button
                  className="button button-outline"
                  type="button"
                  onClick={() => setStep(0)}
                >
                  Descobrir meu próximo passo <Arrow size={16} />
                </button>
                <span className="diagnosis-small">
                  Sem cadastro. Sem envio automático.
                </span>
              </>
            ) : step < 3 ? (
              <>
                <p className="eyebrow accent">PERGUNTA 0{step + 1}</p>
                <h3 ref={title} tabIndex={-1}>
                  {questions[step].title}
                </h3>
                <fieldset className="diagnosis-options">
                  <legend className="sr-only">{questions[step].title}</legend>
                  {questions[step].options.map((option, i) => (
                    <label
                      key={option}
                      className={answers[step] === i ? "is-selected" : ""}
                    >
                      <input
                        type="radio"
                        name={`question-${step}`}
                        value={i}
                        checked={answers[step] === i}
                        onChange={() =>
                          setAnswers((previous) =>
                            previous.map((value, index) =>
                              index === step ? i : value,
                            ),
                          )
                        }
                      />
                      <span>{option}</span>
                      <span className="radio-mark" aria-hidden="true" />
                    </label>
                  ))}
                </fieldset>
                <div className="diagnosis-actions">
                  <button
                    type="button"
                    className="quiet-link"
                    onClick={() => setStep(step - 1)}
                  >
                    ← Voltar
                  </button>
                  <button
                    className="button button-small button-primary"
                    type="button"
                    disabled={answers[step] < 0}
                    onClick={() => setStep(step + 1)}
                  >
                    {step === 2 ? "Ver orientação" : "Continuar"}{" "}
                    <Arrow size={15} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow accent">SUA ORIENTAÇÃO INICIAL</p>
                <h3 ref={title} tabIndex={-1}>
                  {result.title}
                </h3>
                <p>{result.text}</p>
                <p className="diagnosis-disclaimer">
                  Uma direção para começar, não uma proposta fechada. Vamos
                  entender os detalhes juntos.
                </p>
                <a
                  className="button button-primary"
                  href={buildWhatsAppUrl(diagnosisMessage(answers))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Levar contexto ao WhatsApp <Arrow size={16} />
                </a>
                <div className="diagnosis-actions">
                  <button
                    type="button"
                    className="quiet-link"
                    onClick={() => setStep(2)}
                  >
                    ← Revisar
                  </button>
                  <button
                    type="button"
                    className="quiet-link"
                    onClick={() => {
                      setAnswers([-1, -1, -1]);
                      setStep(-1);
                    }}
                  >
                    Recomeçar ↻
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="diagnosis-bottom">
            <span className="status-dot" /> SEUS DADOS NÃO SÃO ARMAZENADOS
          </div>
        </div>
      </div>
    </section>
  );
}
