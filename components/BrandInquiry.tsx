"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Arrow } from "@/components/ui/icons";
import styles from "./BrandInquiry.module.css";

type Brand = "aura" | "orla" | "forma" | "almeida";
type Question = { key: string; label: string; options: string[] };
type Content = {
  name: string; title: string; intro: string; action: string; steps: Question[][]; next: string;
  invitation: string; stepNames: string[]; stepTitles: string[]; summaryTitle: string; noscript: string;
  /** What is not made (an appointment, a visit request). Omitted for brands whose owner asked to drop the notice. */
  privacyItem?: string;
};
const subscribe = () => () => {};
const content: Record<Brand, Content> = {
  aura: {
    name: "Aura", title: "O que você gostaria de valorizar?",
    intro: "Comece pela região que desperta seu interesse e pela dúvida que você quer esclarecer.", action: "Quero uma avaliação",
    steps: [
      [{ key: "regiao", label: "Por onde você quer começar?", options: ["Lábios", "Maçãs do rosto", "Queixo e contorno", "Nariz", "Quero olhar o rosto inteiro"] }],
      [{ key: "duvida", label: "O que você quer entender primeiro?", options: ["As possibilidades para o meu rosto", "Como funciona a avaliação", "Os cuidados e a recuperação", "Ainda estou conhecendo as opções"] }],
    ],
    next: "Uma avaliação individual considera suas expectativas, suas características e os limites de cada possibilidade. Essas escolhas ajudam a começar a conversa; não indicam um procedimento.",
    invitation: "Uma avaliação começa por ouvir.", stepNames: ["Seu interesse", "Sua dúvida"], stepTitles: ["O que chama sua atenção?", "Vamos esclarecer sua dúvida."],
    summaryTitle: "Seu ponto de partida.", noscript: "Para começar, pense na região de interesse e nas dúvidas que deseja esclarecer em uma avaliação individual.",
  },
  orla: {
    name: "Orla", title: "Como é a casa que você procura?",
    intro: "Conte o que importa na sua busca. Do lugar ao investimento, cada preferência ajuda a orientar a seleção.", action: "Encontrar meu imóvel",
    steps: [
      [{ key: "objetivo", label: "O que você procura neste momento?", options: ["Uma casa para morar", "Um lugar para os dias de descanso", "Um imóvel para investir", "Ainda estou explorando"] }],
      [{ key: "cenario", label: "Em qual cenário você se imagina?", options: ["Perto do mar", "Em meio ao verde", "Com a cidade por perto", "Quero comparar possibilidades"] }],
      [
        { key: "investimento", label: "Qual faixa deseja considerar?", options: ["Até R$ 2 milhões", "De R$ 2 a R$ 5 milhões", "Acima de R$ 5 milhões", "Prefiro definir depois"] },
        { key: "prazo", label: "Quando essa mudança faz sentido?", options: ["Nos próximos meses", "Ao longo do próximo ano", "Sem prazo definido"] },
      ],
    ],
    next: "Localização, arquitetura e condições de compra precisam ser avaliadas em conjunto. Este resumo organiza o que importa para você antes de aprofundar a busca.",
    invitation: "Uma seleção começa pelas suas preferências.", stepNames: ["Seu objetivo", "O lugar", "Investimento e prazo"], stepTitles: ["Uma casa para qual momento?", "O lugar também faz parte.", "Vamos delimitar sua busca."],
    summaryTitle: "Uma busca com direção.", noscript: "Para começar, considere a finalidade do imóvel, a região, o investimento e o prazo da sua busca.",
  },
  forma: {
    name: "Forma", title: "Vamos preparar a sua avaliação.",
    intro: "Duas perguntas rápidas ajudam a equipe a reservar o tempo certo para a sua primeira consulta.", action: "Agendar avaliação",
    steps: [
      [{ key: "objetivo", label: "O que você quer resolver?", options: ["Repor um ou mais dentes", "Mudar a forma ou a cor do sorriso", "Alinhar os dentes", "Clarear", "Ainda não sei, quero uma avaliação geral"] }],
      [
        { key: "momento", label: "Quando você pensa em começar?", options: ["Assim que possível", "Nos próximos meses", "Só estou pesquisando"] },
        { key: "periodo", label: "Qual período fica melhor?", options: ["Manhã", "Tarde", "Início da noite"] },
      ],
    ],
    next: "Na primeira consulta, a dentista conversa sobre o que você quer mudar, examina e explica as alternativas, com etapas e orçamento por escrito. Nenhum tratamento é decidido antes disso.",
    invitation: "A primeira consulta é uma conversa.", stepNames: ["O que resolver", "Quando"], stepTitles: ["Por onde começamos?", "Vamos encontrar um horário."],
    summaryTitle: "Sua avaliação, preparada.", noscript: "Para agendar, pense no que você quer resolver e no melhor período para a primeira consulta.",
  },
  almeida: {
    name: "Almeida & Valença", title: "Conte o que a sua família precisa resolver.",
    intro: "Três perguntas rápidas ajudam a preparar a primeira conversa com a advogada.", action: "Falar com a advogada",
    steps: [
      [{ key: "situacao", label: "Qual é a sua situação?", options: ["Preciso abrir um inventário", "Tenho um inventário em andamento", "Quero planejar a sucessão", "Tenho dúvidas sobre testamento ou doação"] }],
      [
        { key: "formato", label: "Como prefere a primeira conversa?", options: ["Presencial", "Online"] },
        { key: "quando", label: "Quando você quer conversar?", options: ["Esta semana", "Nas próximas semanas", "Ainda estou me informando"] },
      ],
    ],
    next: "Na primeira conversa, a advogada entende a situação da família, explica os caminhos possíveis e apresenta custos e prazos por escrito. Nenhuma decisão é tomada antes disso.",
    invitation: "A primeira conversa é para entender o seu caso.", stepNames: ["Sua situação", "A conversa"], stepTitles: ["Por onde começamos?", "Como prefere conversar?"],
    summaryTitle: "Sua conversa, preparada.", noscript: "Para começar, pense na situação da família e em como prefere a primeira conversa.",
  },
};

export function BrandInquiry({ brand }: { brand: Brand }) {
  const data = content[brand];
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const id = useId();
  const sectionId = `${brand}-interesse`;
  const summary = step === data.steps.length;

  useEffect(() => {
    const open = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>(`a[href="#${sectionId}"]`);
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener.current = anchor;
      dialog.current?.showModal();
      heading.current?.focus();
    };
    document.addEventListener("click", open);
    return () => document.removeEventListener("click", open);
  }, [sectionId]);

  useEffect(() => {
    if (dialog.current?.open) heading.current?.focus();
  }, [step]);

  function show(event: React.MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    dialog.current?.showModal();
    heading.current?.focus();
  }
  function close() { dialog.current?.close(); }

  return <section className={`${styles.section} ${styles[brand]}`} id={sectionId} aria-labelledby={`${id}-section-title`} data-inquiry={brand}>
    <div className={styles.invitation}><p className={styles.brandName}>{data.invitation}</p><h2 id={`${id}-section-title`}>{data.title}</h2></div>
    <div className={styles.offer}><p>{data.intro}</p>{hydrated && <button type="button" className={styles.launch} onClick={show}>{completed ? "Rever minhas escolhas" : data.action}<Arrow size={21} /></button>}
      <p className={styles.note}>{completed ? "Seu resumo continua disponível enquanto esta página estiver aberta." : "Sem cadastro. Você pode rever suas escolhas."}</p>
      <noscript><p>O roteiro interativo precisa de JavaScript. {data.noscript}{data.privacyItem && " Nenhuma informação é enviada."}</p></noscript>
    </div>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={data.privacyItem ? `${id}-privacy` : undefined} onClose={() => opener.current?.focus()}>
      <div className={styles.dialogHeader}><span>{data.name}</span><button type="button" onClick={close} aria-label="Fechar roteiro">Fechar <span aria-hidden="true">×</span></button></div>
      <ol className={styles.steps} aria-label="Etapas do roteiro">{data.steps.map((_, index) => <li key={index} aria-current={!summary && step === index ? "step" : undefined}>{data.stepNames[index]}</li>)}<li aria-current={summary ? "step" : undefined}>Seu resumo</li></ol>
      <div className={styles.body}>
        <h3 ref={heading} id={`${id}-title`} tabIndex={-1}>{summary ? data.summaryTitle : data.stepTitles[step]}</h3>
        {summary ? <>
          <dl className={styles.summary}>{data.steps.flat().map(question => <div key={question.key}><dt>{question.label}</dt><dd>{answers[question.key]}</dd></div>)}</dl>
          <p className={styles.next}>{data.next}</p>
          <div className={styles.actions}><button type="button" className={styles.back} onClick={() => setStep(0)}>Ajustar escolhas</button><button type="button" className={styles.primary} onClick={() => { setCompleted(true); close(); }}>Voltar ao site <Arrow size={18} /></button></div>
        </> : <form onSubmit={event => { event.preventDefault(); setStep(value => value + 1); }}>
          {data.steps[step].map(question => <fieldset key={question.key} className={styles.fieldset}><legend>{question.label}</legend><div className={styles.options}>{question.options.map(option => <label key={option}><input type="radio" name={`${id}-${question.key}`} value={option} checked={answers[question.key] === option} required onChange={() => setAnswers(previous => ({ ...previous, [question.key]: option }))} /><span>{option}</span></label>)}</div></fieldset>)}
          <div className={styles.actions}>{step > 0 && <button className={styles.back} type="button" onClick={() => setStep(value => value - 1)}>Voltar</button>}<button className={styles.primary} type="submit">{step === data.steps.length - 1 ? "Ver meu resumo" : "Continuar"}<Arrow size={18} /></button></div>
        </form>}
        {data.privacyItem && <p id={`${id}-privacy`} className={styles.privacy}>As escolhas ficam nesta página. Nada é enviado e nenhum {data.privacyItem} é realizado.</p>}
      </div>
    </dialog>
  </section>;
}
