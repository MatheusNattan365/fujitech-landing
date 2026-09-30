import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { toHtmlLang } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "latin-ext"],
  variable: "--font-unbounded",
  display: "swap",
  weight: "600",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["300", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const messages = getDictionary(await getLocale());
  return {
    title: {
      default: messages.meta.title,
      template: "%s | Fujitech Software",
    },
    description: messages.meta.description,
    keywords: [...messages.meta.keywords],
    openGraph: {
      title: messages.meta.ogTitle,
      description: messages.meta.description,
      locale: toHtmlLang(await getLocale()).replace("-", "_"),
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = getDictionary(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Fujitech Software",
    description: messages.meta.description,
    areaServed: messages.meta.areaServed,
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
  };

  return (
    <html lang={toHtmlLang(locale)} className={`${unbounded.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full bg-surface font-body text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
