"use client";

import { useState } from "react";
import { localeLabel, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleTabs({ label, children }: { label: string; children: (locale: Locale) => React.ReactNode }) {
  const [active, setActive] = useState<Locale>("pt-br");

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-4" role="tablist" aria-label={label}>
        {locales.map((locale) => (
          <button
            key={locale}
            type="button"
            role="tab"
            aria-selected={active === locale}
            className={cn("furniture text-craft-mist hover:text-craft-bone", active === locale && "text-craft-ember")}
            onClick={() => setActive(locale)}
          >
            {localeLabel[locale]}
          </button>
        ))}
      </div>
      {locales.map((locale) => (
        <div key={locale} hidden={active !== locale} className="grid gap-5">
          {children(locale)}
        </div>
      ))}
    </div>
  );
}
