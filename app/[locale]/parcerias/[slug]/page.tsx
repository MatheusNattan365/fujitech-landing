import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteFrame } from "@/components/SiteFrame";
import { Badge } from "@/components/ui/badge";
import { getPublishedPartnership, partnershipAlternates } from "@/db/queries";
import { isLocale, localePath, toHtmlLang, toIntlLocale } from "@/lib/i18n";
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
  const item = await getPublishedPartnership(locale, slug);
  if (!item) return { title: messages.partnerships.missing };
  const copies = await partnershipAlternates(item.id);
  const languages: Record<string, string> = {};
  for (const copy of copies) {
    if (!isLocale(copy.locale)) continue;
    languages[toHtmlLang(copy.locale)] = localePath(copy.locale, `/parcerias/${copy.slug}`);
  }
  return { title: item.name, description: item.summary, alternates: { languages } };
}

export default async function PartnershipPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getDictionary(locale);
  const item = await getPublishedPartnership(locale, slug);
  if (!item) notFound();
  const logo = mediaSrc(item.logoMediaId, item.logoUrl);

  return (
    <SiteFrame locale={locale} messages={messages}>
      <article className="mx-auto max-w-3xl px-5 pt-28 pb-24 md:px-8 md:pt-36">
        <Link href={localePath(locale, "/parcerias")} className="text-sm font-medium text-craft-ember">
          {messages.partnerships.back}
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <span className="grid size-20 place-items-center overflow-hidden bg-craft-ink-accent text-2xl text-craft-ember">
            {logo ? <Image src={logo} alt="" width={80} height={80} className="size-20 object-cover" /> : item.name.slice(0, 1)}
          </span>
          <div>
            {item.isExample ? (
              <Badge className="border-craft-bone/20 bg-transparent text-craft-mist">{messages.partnerships.example}</Badge>
            ) : null}
            <h1 className="text-[2.25rem] sm:text-5xl">{item.name}</h1>
          </div>
        </div>
        <p className="mt-6 text-lg text-craft-mist normal-case tracking-normal">{item.summary}</p>
        {item.publishedAt ? <p className="mt-3 text-sm text-craft-mist">{formatDate(item.publishedAt, toIntlLocale(locale))}</p> : null}
        {item.website ? (
          <p className="mt-4">
            <a className="font-medium text-craft-ember underline-offset-4 hover:underline" href={item.website}>
              {item.website}
            </a>
          </p>
        ) : null}
        <div className="mt-10">
          <MarkdownBody source={item.body} />
        </div>
      </article>
    </SiteFrame>
  );
}
