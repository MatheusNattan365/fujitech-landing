import Image from "next/image";
import Link from "next/link";
import type { PartnershipView } from "@/db/queries";
import { Badge } from "@/components/ui/badge";
import { localePath, type Locale } from "@/lib/i18n";
import { mediaSrc } from "@/lib/utils";
import type { Messages } from "@/messages";

export function Partnerships({
  locale,
  messages,
  items,
}: {
  locale: Locale;
  messages: Messages;
  items: PartnershipView[];
}) {
  if (items.length === 0) return null;

  return (
    <section id="parcerias" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-[1.75rem] md:text-5xl">{messages.partnerships.title}</h2>
          </div>
          <Link href={localePath(locale, "/parcerias")} className="text-sm font-medium text-craft-ember underline-offset-4 hover:underline">
            {messages.partnerships.all}
          </Link>
        </div>
        {items.some((item) => item.isExample) ? (
          <p className="mt-6 max-w-2xl text-sm text-craft-mist">{messages.partnerships.exampleNote}</p>
        ) : null}
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const logo = mediaSrc(item.logoMediaId, item.logoUrl);
            return (
              <li key={item.id}>
                <Link
                  href={localePath(locale, `/parcerias/${item.slug}`)}
                  className="hairline flex h-full items-center gap-4 p-5 transition-colors hover:border-craft-ember"
                >
                  <span className="grid size-16 shrink-0 place-items-center overflow-hidden bg-craft-ink-accent">
                    {logo ? (
                      <Image src={logo} alt="" width={64} height={64} className="size-16 object-cover" />
                    ) : (
                      <span className="font-display text-xl text-craft-ember">{item.name.slice(0, 1)}</span>
                    )}
                  </span>
                  <span>
                    {item.isExample ? <Badge className="mb-2">{messages.partnerships.example}</Badge> : null}
                    <span className="block font-display text-xl normal-case tracking-normal">{item.name}</span>
                    <span className="mt-1 block text-sm text-craft-mist">{item.summary}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
