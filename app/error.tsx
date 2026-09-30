"use client";

import { usePathname } from "next/navigation";
import { isLocale, localeFromPath } from "@/lib/i18n";
import { getDictionary } from "@/messages";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const fromPath = localeFromPath(pathname);
  const fromCookie = typeof document === "undefined" ? null : document.cookie.match(/(?:^|; )fujitech_locale=([^;]+)/)?.[1];
  const locale = fromPath ?? (isLocale(fromCookie) ? fromCookie : "pt-br");
  const messages = getDictionary(locale);

  return (
    <main className="craft grid min-h-screen place-items-center bg-craft-ink px-6 text-craft-bone">
      <div className="max-w-lg">
        <h1 className="text-4xl">{messages.errors.load}</h1>
        <button
          type="button"
          onClick={reset}
          className="mt-6 min-h-11 bg-craft-ember px-5 py-3 text-craft-bone uppercase tracking-[0.14em] hover:bg-[#2b4c7e]"
        >
          {messages.errors.retry}
        </button>
      </div>
    </main>
  );
}
