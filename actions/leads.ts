"use server";

import { z } from "zod";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/messages";
import { isChallengeId } from "@/lib/challenges";

export type LeadState = { error?: string; ok?: boolean } | null;

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const localeValue = String(formData.get("locale") || "pt-br");
  const locale: Locale = isLocale(localeValue) ? localeValue : "pt-br";
  const errors = getDictionary(locale).errors;
  const schema = z.object({
    name: z.string().trim().min(2, errors.name),
    email: z.string().trim().email(errors.email),
    company: z.string().trim().min(2, errors.company),
    challenge: z.enum(["modernizar", "integrar", "automatizar", "infraestrutura"], {
      message: errors.challenge,
    }),
    message: z.string().trim().min(10, errors.message),
  });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    challenge: formData.get("challenge"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? errors.check };
  if (!isChallengeId(parsed.data.challenge)) return { error: errors.challenge };

  await getDb().insert(leads).values({ ...parsed.data, locale });
  return { ok: true };
}
