import "server-only";

import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const fromHeader = headerStore.get("x-locale");
  if (isLocale(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return defaultLocale;
}
