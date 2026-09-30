import Image from "next/image";
import Link from "next/link";
import type { ProjectView } from "@/db/queries";
import { Badge } from "@/components/ui/badge";
import { localePath, type Locale } from "@/lib/i18n";
import { mediaSrc } from "@/lib/utils";
import type { Messages } from "@/messages";

export function Projects({
  locale,
  messages,
  items,
}: {
  locale: Locale;
  messages: Messages;
  items: ProjectView[];
}) {
  return (
    <section id="projetos" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[65ch]">
            <h2 className="text-[1.75rem] md:text-5xl">{messages.projects.title}</h2>
          </div>
          <Link href={localePath(locale, "/projetos")} className="text-sm font-medium text-craft-ember underline-offset-4 hover:underline">
            {messages.projects.all}
          </Link>
        </div>
        {items.some((item) => item.isExample) ? (
          <p className="mt-6 max-w-2xl text-sm text-craft-mist">{messages.projects.exampleNote}</p>
        ) : null}
        {items.length === 0 ? (
          <p className="mt-10 text-craft-mist">{messages.projects.emptyHome}</p>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {items.map((item) => (
              <ProjectCard key={item.id} locale={locale} messages={messages} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ProjectCard({
  locale,
  messages,
  item,
}: {
  locale: Locale;
  messages: Messages;
  item: ProjectView;
}) {
  const cover = mediaSrc(item.coverMediaId, item.coverUrl);
  return (
    <Link
      href={localePath(locale, `/projetos/${item.slug}`)}
      className="group hairline flex h-full flex-col overflow-hidden transition-colors duration-200 hover:border-craft-ember"
    >
      <div className="relative aspect-[16/10] bg-craft-ink-accent">
        {cover ? (
          <Image src={cover} alt="" width={800} height={500} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-craft-ink-accent" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {item.isExample ? (
          <Badge className="mb-4 w-fit border-craft-bone/20 bg-transparent text-craft-mist">{messages.projects.example}</Badge>
        ) : null}
        <h3 className="text-xl normal-case tracking-normal group-hover:text-craft-ember">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-craft-mist">{item.summary}</p>
        <dl className="mt-6 grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-craft-bone">{messages.projects.problem}</dt>
            <dd className="text-craft-mist">{item.problem}</dd>
          </div>
          <div>
            <dt className="font-medium text-craft-bone">{messages.projects.solution}</dt>
            <dd className="text-craft-mist">{item.solution}</dd>
          </div>
          <div>
            <dt className="font-medium text-craft-bone">{messages.projects.outcome}</dt>
            <dd className="text-craft-mist">{item.outcome}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
