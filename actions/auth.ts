"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { login, logout } from "@/lib/auth";
import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const errors = getDictionary(await getLocale()).errors;
  const schema = z.object({
    email: z.string().trim().min(3, errors.loginEmail),
    password: z.string().min(1, errors.loginPassword),
  });
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? errors.loginCheck };
  const ok = await login(parsed.data.email, parsed.data.password);
  if (!ok) return { error: errors.loginInvalid };
  redirect("/admin");
}

export async function setLocaleAction(formData: FormData) {
  const value = String(formData.get("locale") || "");
  const locale: Locale = isLocale(value) ? value : "pt-br";
  const next = String(formData.get("next") || "/admin");
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  await logout();
}
