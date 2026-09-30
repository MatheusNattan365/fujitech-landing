import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFrame } from "@/components/SiteFrame";
import { Badge } from "@/components/ui/badge";
import { listPublishedPartnerships } from "@/db/queries";
import { isLocale, localePath } from "@/lib/i18n";
import { mediaSrc } from "@/lib/utils";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getDictionary(locale);
  return {
    title: messages.partnerships.metaTitle,
    description: messages.partnerships.metaDescription,
    alternates: {
      languages: {
        "pt-BR": localePath("pt-br", "/parcerias"),
        en: localePath("en", "/parcerias"),
        fr: localePath("fr", "/parcerias"),
      },
    },
  };
}

export default async function PartnershipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const items = await listPublishedPartnerships(locale);
  return (
    <SiteFrame locale={locale} messages={messages}>
      <section className="mx-auto max-w-[1200px] px-5 pt-28 pb-24 md:px-8 md:pt-36">
        <h1 className="text-[2.25rem] sm:text-5xl">{messages.partnerships.pageTitle}</h1>
        {items.length === 0 ? (
          <p className="mt-10 text-craft-mist">{messages.partnerships.empty}</p>
        ) : (
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {items.map((item) => {
              const logo = mediaSrc(item.logoMediaId, item.logoUrl);
              return (
                <li key={item.id}>
                  <Link href={localePath(locale, `/parcerias/${item.slug}`)} className="hairline flex gap-4 p-6">
                    <span className="grid size-16 shrink-0 place-items-center overflow-hidden bg-craft-ink-accent text-craft-ember">
                      {logo ? (
                        <Image src={logo} alt="" width={64} height={64} className="size-16 object-cover" />
                      ) : (
                        item.name.slice(0, 1)
                      )}
                    </span>
                    <span>
                      {item.isExample ? (
                        <Badge className="mb-2 border-craft-bone/20 bg-transparent text-craft-mist">{messages.partnerships.example}</Badge>
                      ) : null}
                      <span className="block font-display text-2xl normal-case tracking-normal">{item.name}</span>
                      <span className="mt-2 block text-sm text-craft-mist">{item.summary}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </SiteFrame>
  );
}
