const steps = [
  {
    title: "Diagnóstico",
    text: "Entendemos o fluxo, os sistemas e o que está custando tempo antes de propor construção.",
  },
  {
    title: "Planejamento",
    text: "Definimos escopo, riscos e a sequência de entrega. O que fica de fora também é uma decisão.",
  },
  {
    title: "Implementação",
    text: "Construímos, integramos e colocamos no ar em partes que o time consegue usar.",
  },
  {
    title: "Acompanhamento",
    text: "Depois da entrega, ajustamos com o uso real. Software que para no deploy envelhece rápido.",
  },
];

export function Method() {
  return (
    <section id="metodo" className="scroll-mt-24 bg-surface-muted px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-[65ch]">
          <h2 className="text-[1.75rem] text-brand-navy md:text-[2.5rem]">Do diagnóstico ao uso real</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
            Quatro etapas, na ordem em que o trabalho acontece.
          </p>
        </div>
        <ol className="relative mt-12 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-border md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <span className="relative z-10 grid size-10 place-items-center rounded-full bg-brand-blue font-display text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl text-brand-navy">{step.title}</h3>
              <p className="mt-3 max-w-[36ch] text-base leading-relaxed text-text-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
