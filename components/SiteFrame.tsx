import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function SiteFrame({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <div className="craft min-h-full bg-craft-ink text-craft-bone">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-craft-ember focus:px-4 focus:py-2 focus:text-craft-bone"
      >
        {messages.nav.skip}
      </a>
      <Header locale={locale} messages={messages} />
      <main id="conteudo">{children}</main>
      <Footer locale={locale} messages={messages} />
    </div>
  );
}
