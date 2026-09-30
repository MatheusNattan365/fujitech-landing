import type { Locale } from "@/lib/i18n";
import type { Messages } from "./pt-br";
import ptBr from "./pt-br";
import en from "./en";
import fr from "./fr";

const dictionaries: Record<Locale, Messages> = {
  "pt-br": ptBr,
  en,
  fr,
};

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}

export type { Messages };
