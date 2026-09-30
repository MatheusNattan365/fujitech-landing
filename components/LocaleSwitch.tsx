"use client";

import { usePathname } from "next/navigation";
import { setLocaleAction } from "@/actions/auth";
import { localeLabel, locales, LOCALE_COOKIE, swapLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitch({
  locale,
  label,
  mode,
}: {
  locale: Locale;
  label: string;
  mode: "path" | "admin";
}) {
  const pathname = usePathname();

  if (mode === "admin") {
    return (
      <div className="flex items-center gap-3" aria-label={label}>
        {locales.map((item) => (
          <form key={item} action={setLocaleAction}>
            <input type="hidden" name="locale" value={item} />
            <input type="hidden" name="next" value={pathname} />
            <button
              type="submit"
              className={cn("furniture text-craft-mist hover:text-craft-bone", item === locale && "text-craft-ember")}
              aria-current={item === locale ? "true" : undefined}
            >
              {localeLabel[item]}
            </button>
          </form>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3" aria-label={label}>
      {locales.map((item) => (
        <a
          key={item}
          href={swapLocale(pathname, item)}
          className={cn("furniture text-craft-mist hover:text-craft-bone", item === locale && "text-craft-ember")}
          aria-current={item === locale ? "page" : undefined}
          onClick={() => {
            document.cookie = `${LOCALE_COOKIE}=${item};path=/;max-age=31536000;samesite=lax`;
          }}
        >
          {localeLabel[item]}
        </a>
      ))}
    </div>
  );
}
