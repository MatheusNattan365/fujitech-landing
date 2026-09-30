import Link from "next/link";
import { challengeIds } from "@/lib/challenges";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function Challenges({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <section id="diferenciais" className="scroll-mt-24 bg-craft-ink-alt px-5 py-24 md:px-8 md:py-32">
      <div id="desafios" className="mx-auto max-w-[1200px] scroll-mt-24">
        <div id="sobre" className="max-w-[62ch] scroll-mt-24">
          <h2 className="text-[1.75rem] md:text-5xl">{messages.work.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-craft-mist sm:text-lg">{messages.work.intro}</p>
        </div>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {messages.work.points.map((point) => (
            <li key={point.title} className="hairline-b pb-6">
              <h3 className="text-xl normal-case tracking-normal">{point.title}</h3>
              <p className="mt-3 max-w-[36ch] leading-relaxed text-craft-mist">{point.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <div className="furniture hairline-b grid grid-cols-1 gap-3 py-4 text-craft-mist md:grid-cols-[1.1fr_1.6fr]">
            <span>{messages.work.challenge}</span>
            <span>{messages.work.feels}</span>
          </div>
          {challengeIds.map((id) => (
            <Link
              key={id}
              href={`${localePath(locale)}/?desafio=${id}#contato`}
              className="hairline-b grid grid-cols-1 items-center gap-3 py-8 transition-colors hover:bg-white/5 md:grid-cols-[1.1fr_1.6fr] md:px-2"
            >
              <span className="font-display text-xl uppercase">{messages.challenges[id].title}</span>
              <span className="max-w-[52ch] text-craft-mist">{messages.challenges[id].text}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
