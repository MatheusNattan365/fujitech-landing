import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string | null | undefined, locale = "pt-BR") {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function mediaSrc(mediaId: string | null | undefined, url: string | null | undefined) {
  if (mediaId) return `/api/media/${mediaId}`;
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export function whatsappHref(raw: string | undefined) {
  const digits = raw?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
