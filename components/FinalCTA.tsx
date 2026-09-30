import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-brand-navy px-5 py-20 text-white md:px-8 md:py-28">
      <div className="relative mx-auto max-w-[1200px] overflow-hidden">
        <svg
          viewBox="0 0 240 160"
          className="pointer-events-none absolute -right-6 top-0 hidden h-40 w-60 opacity-80 md:block"
          aria-hidden="true"
          fill="none"
        >
          <path d="M20 120 L110 40 L150 72 L60 152 Z" fill="#2563EB" />
          <path d="M70 152 L140 92 L180 124 L110 184 Z" fill="#14B8A6" />
        </svg>
        <h2 className="relative max-w-[18ch] text-[1.75rem] text-white md:text-[2.5rem]">
          Uma conversa objetiva sobre o seu cenário.
        </h2>
        <p className="relative mt-5 max-w-[65ch] text-base leading-relaxed text-white/80 sm:text-lg">
          Sem apresentação genérica. Você conta o desafio e a Fujitech responde com um caminho
          técnico.
        </p>
        <Button asChild size="lg" className="relative mt-8 focus-visible:ring-offset-brand-navy">
          <Link href="/#contato">Fale com um especialista</Link>
        </Button>
      </div>
    </section>
  );
}
