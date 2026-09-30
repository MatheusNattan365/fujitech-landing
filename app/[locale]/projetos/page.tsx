import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/Projects";
import { SiteFrame } from "@/components/SiteFrame";
import { listPublishedProjects } from "@/db/queries";
import { isLocale, localePath } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getDictionary(locale);
  return {
    title: messages.projects.metaTitle,
    description: messages.projects.metaDescription,
    alternates: {
      languages: {
        "pt-BR": localePath("pt-br", "/projetos"),
        en: localePath("en", "/projetos"),
        fr: localePath("fr", "/projetos"),
      },
    },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const items = await listPublishedProjects(locale);
  return (
    <SiteFrame locale={locale} messages={messages}>
      <section className="mx-auto max-w-[1200px] px-5 pt-28 pb-24 md:px-8 md:pt-36">
        <h1 className="max-w-[18ch] text-[2.25rem] sm:text-5xl">{messages.projects.pageTitle}</h1>
        {items.length === 0 ? (
          <p className="mt-10 text-craft-mist">{messages.projects.empty}</p>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {items.map((item) => (
              <ProjectCard key={item.id} locale={locale} messages={messages} item={item} />
            ))}
          </div>
        )}
      </section>
    </SiteFrame>
  );
}
