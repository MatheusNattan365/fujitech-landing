import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteFrame } from "@/components/SiteFrame";
import { Badge } from "@/components/ui/badge";
import { getPublishedProject, projectAlternates } from "@/db/queries";
import { isLocale, localePath, toHtmlLang, toIntlLocale, type Locale } from "@/lib/i18n";
import { formatDate, mediaSrc } from "@/lib/utils";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const messages = getDictionary(locale);
  const project = await getPublishedProject(locale, slug);
  if (!project) return { title: messages.projects.missing };
  const copies = await projectAlternates(project.id);
  const languages: Record<string, string> = {};
  for (const copy of copies) {
    if (!isLocale(copy.locale)) continue;
    languages[toHtmlLang(copy.locale)] = localePath(copy.locale, `/projetos/${copy.slug}`);
  }
  return { title: project.title, description: project.summary, alternates: { languages } };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const project = await getPublishedProject(locale, slug);
  if (!project) notFound();
  const cover = mediaSrc(project.coverMediaId, project.coverUrl);

  return (
    <SiteFrame locale={locale} messages={messages}>
      <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
        <Link href={localePath(locale, "/projetos")} className="text-sm font-medium text-craft-ember">
          {messages.projects.back}
        </Link>
        {project.isExample ? (
          <Badge className="mt-6 border-craft-bone/20 bg-transparent text-craft-mist">{messages.projects.example}</Badge>
        ) : null}
        <h1 className="mt-4 text-[2.25rem] sm:text-5xl">{project.title}</h1>
        <p className="mt-5 text-lg text-craft-mist normal-case tracking-normal">{project.summary}</p>
        {project.publishedAt ? (
          <p className="mt-3 text-sm text-craft-mist">{formatDate(project.publishedAt, toIntlLocale(locale as Locale))}</p>
        ) : null}
        {cover ? (
          <Image src={cover} alt="" width={1200} height={675} priority className="mt-8 aspect-[16/9] w-full object-cover" />
        ) : null}
        <dl className="mt-10 grid gap-6 border-y border-craft-bone/15 py-8">
          <div>
            <dt className="font-display text-xl">{messages.projects.problem}</dt>
            <dd className="mt-2 text-craft-mist normal-case tracking-normal">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-display text-xl">{messages.projects.solution}</dt>
            <dd className="mt-2 text-craft-mist normal-case tracking-normal">{project.solution}</dd>
          </div>
          <div>
            <dt className="font-display text-xl">{messages.projects.outcome}</dt>
            <dd className="mt-2 text-craft-mist normal-case tracking-normal">{project.outcome}</dd>
          </div>
        </dl>
        {project.stack.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item} className="border border-craft-bone/20 px-3 py-1 text-sm text-craft-mist">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-10">
          <MarkdownBody source={project.body} />
        </div>
      </article>
    </SiteFrame>
  );
}
