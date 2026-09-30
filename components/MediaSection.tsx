import { ConnectionGraph } from "@/components/ConnectionGraph";

const labels = [
  { name: "ERP", place: "left-6 top-10" },
  { name: "CRM", place: "right-8 top-16" },
  { name: "Planilhas", place: "left-10 bottom-16" },
  { name: "Operação", place: "right-6 bottom-12" },
  { name: "Dados", place: "left-1/2 top-6 -translate-x-1/2" },
];

export function MediaSection() {
  return (
    <section className="px-5 py-24 md:py-32" aria-labelledby="sistemas-titulo">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-ink">Sistemas</p>
          <h2 id="sistemas-titulo" className="mt-4 font-display text-4xl text-ink md:text-5xl">
            O problema quase sempre é a distância entre os sistemas.
          </h2>
          <p className="mt-6 text-muted">
            Sistemas que não se comunicam, processos manuais, aplicações lentas e dificuldade
            para escalar. A Fujitech entra para desenhar a ligação e o software que sustenta essa
            ligação.
          </p>
        </div>
        <div className="relative lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-navy shadow-[0_40px_90px_-50px_rgba(7,20,34,0.9)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,230,214,0.25),transparent_45%)]" />
            <ConnectionGraph className="relative h-80" />
            {labels.map((label) => (
              <span
                key={label.name}
                className={`absolute rounded-full border border-cyan/30 bg-navy/80 px-3 py-1 text-xs text-cyan ${label.place}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
