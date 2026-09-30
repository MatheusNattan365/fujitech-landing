import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, toHtmlLang } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const messages = getDictionary(value);
  return {
    title: { default: messages.meta.title, template: "%s | Fujitech Software" },
    description: messages.meta.description,
    keywords: [...messages.meta.keywords],
    openGraph: {
      title: messages.meta.ogTitle,
      description: messages.meta.description,
      locale: toHtmlLang(value).replace("-", "_"),
      type: "website",
    },
    alternates: {
      languages: {
        "pt-BR": "/pt-br",
        en: "/en",
        fr: "/fr",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return children;
}
