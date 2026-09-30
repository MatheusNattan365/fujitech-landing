import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { isLocale, localePath } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getDictionary(locale);
  return {
    title: messages.privacy.title,
    description: messages.privacy.description,
    alternates: {
      languages: {
        "pt-BR": localePath("pt-br", "/privacidade"),
        en: localePath("en", "/privacidade"),
        fr: localePath("fr", "/privacidade"),
      },
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  return (
    <SiteFrame locale={locale} messages={messages}>
      <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
        <h1 className="text-[2.25rem] sm:text-5xl">{messages.privacy.heading}</h1>
        <div className="mt-8 grid gap-4 text-craft-mist normal-case tracking-normal">
          {messages.privacy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </SiteFrame>
  );
}
