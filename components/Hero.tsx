import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <p className="animate-fade-up text-sm font-medium text-brand-blue-hover">
            Fujitech
          </p>
          <h1 className="mt-4 text-[2.25rem] text-brand-navy sm:text-5xl lg:text-[4rem]">
            Tecnologia que impulsiona o seu negócio.
          </h1>
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-text-secondary sm:text-lg">
            Serviços de TI e consultoria para desenvolver soluções, integrar sistemas e apoiar a
            evolução da sua empresa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#contato">Fale com um especialista</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#servicos">Conheça nossos serviços</Link>
            </Button>
          </div>
        </div>
        <BrandGeometry />
      </div>
    </section>
  );
}

function BrandGeometry() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      <svg viewBox="0 0 520 420" className="h-auto w-full" fill="none">
        <rect x="24" y="24" width="472" height="372" rx="16" fill="#F5F7FA" />
        <path d="M118 268 L248 158 L292 190 L162 300 Z" fill="#102238" />
        <path d="M162 300 L292 190 L336 222 L206 332 Z" fill="#2563EB" />
        <path d="M206 332 L292 262 L336 294 L250 364 Z" fill="#14B8A6" />
        <path d="M360 96 L456 96" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M392 128 L456 128" stroke="#E2E8F0" strokeWidth="2" />
      </svg>
    </div>
  );
}
