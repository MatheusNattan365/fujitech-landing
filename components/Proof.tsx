const items = [
  "Diagnóstico",
  "Planejamento",
  "Implementação",
  "Acompanhamento",
];

const specialties = [
  "Desenvolvimento de software",
  "Consultoria de TI",
  "Cloud e infraestrutura",
  "Integrações e automação",
];

export function Proof() {
  return (
    <section className="relative z-10 -mt-16 px-5" aria-label="Como a Fujitech trabalha">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-ink/10 bg-white px-6 py-8 shadow-[0_30px_80px_-48px_rgba(7,20,34,0.85)] md:px-10">
        <p className="text-sm uppercase tracking-[0.18em] text-cyan-ink">Forma de trabalhar</p>
        <ol className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-xl text-ink md:text-2xl">
          {items.map((item, index) => (
            <li key={item} className="flex items-center gap-3">
              <span>{item}</span>
              {index < items.length - 1 ? <span className="text-cyan-ink" aria-hidden="true">→</span> : null}
            </li>
          ))}
        </ol>
        <ul className="mt-6 flex flex-wrap gap-2">
          {specialties.map((item) => (
            <li key={item} className="rounded-full bg-paper px-3 py-1 text-sm text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
