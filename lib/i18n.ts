export const locales = ["pt-br", "en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-br";

export const LOCALE_COOKIE = "fujitech_locale";

export const localeLabel: Record<Locale, string> = {
  "pt-br": "PT",
  en: "EN",
  fr: "FR",
};

const htmlLang: Record<Locale, string> = {
  "pt-br": "pt-BR",
  en: "en",
  fr: "fr",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function toHtmlLang(locale: Locale) {
  return htmlLang[locale];
}

export function toIntlLocale(locale: Locale) {
  return htmlLang[locale];
}

export function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

export function localePath(locale: Locale, path = "/") {
  const [pathname, hash] = path.split("#");
  const suffix = hash ? `#${hash}` : "";
  if (!pathname || pathname === "/") return `/${locale}${suffix ? `/${suffix}` : ""}`;
  return `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}${suffix}`;
}

export function swapLocale(pathname: string, locale: Locale) {
  const [path, hash] = pathname.split("#");
  const parts = path.split("/");
  if (isLocale(parts[1])) parts[1] = locale;
  else parts.splice(1, 0, locale);
  const next = parts.join("/") || `/${locale}`;
  return hash ? `${next}#${hash}` : next;
}

export function negotiateLocale(acceptLanguage: string | null) {
  const tags = (acceptLanguage ?? "")
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);
  for (const tag of tags) {
    if (tag.startsWith("fr")) return "fr" as const;
    if (tag.startsWith("en")) return "en" as const;
    if (tag.startsWith("pt")) return "pt-br" as const;
  }
  return defaultLocale;
}
