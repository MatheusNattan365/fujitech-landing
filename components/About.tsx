const points = [
  {
    title: "Especialidades",
    text: "Software, consultoria de TI, cloud, integrações e automação de processos.",
  },
  {
    title: "Forma de trabalhar",
    text: "Diagnóstico antes da ferramenta. Entrega em partes. Acompanhamento depois que o sistema entra em uso.",
  },
  {
    title: "Onde",
    text: "A Fujitech Software conversa com empresas em qualquer cidade.",
  },
];

export function About() {
  return (
    <section id="sobre" className="scroll-mt-28 px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-ink">Sobre</p>
          <h2 className="mt-4 font-display text-4xl text-ink md:text-6xl">
            Parceira de tecnologia, não fornecedora de slide.
          </h2>
        </div>
        <div className="grid gap-8 lg:col-span-6">
          <p className="text-lg text-ink">
            A Fujitech existe para empresas que precisam de alguém capaz de desenvolver a solução,
            integrar o que já existe e ajudar a decidir o caminho técnico. O trabalho é próximo do
            problema e explícito sobre o que vai ser construído.
          </p>
          <ul className="grid gap-6">
            {points.map((point) => (
              <li key={point.title} className="border-t border-ink/10 pt-5">
                <h3 className="font-display text-2xl">{point.title}</h3>
                <p className="mt-2 text-muted">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
