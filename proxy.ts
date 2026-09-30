import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";
import { defaultLocale, isLocale, LOCALE_COOKIE, localeFromPath, negotiateLocale, type Locale } from "@/lib/i18n";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;
  return negotiateLocale(request.headers.get("accept-language"));
}

function isLegacyPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/projetos" ||
    pathname.startsWith("/projetos/") ||
    pathname === "/parcerias" ||
    pathname.startsWith("/parcerias/") ||
    pathname === "/privacidade"
  );
}

function withLocale(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const locale = preferredLocale(request);
    if (pathname === "/admin/login") return withLocale(request, locale);

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const session = await readSession(token);
      if (!session || session.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return withLocale(request, locale);
  }

  if (pathname.startsWith("/api")) return NextResponse.next();

  const locale = localeFromPath(pathname);
  if (!locale) {
    if (!isLegacyPublicPath(pathname)) return withLocale(request, preferredLocale(request));
    const next = preferredLocale(request) || defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${next}` : `/${next}${pathname}`;
    return NextResponse.redirect(url);
  }

  return withLocale(request, locale);
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|favicon.ico|brand|.*\\..*).*)"],
};
