"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { slugTaken } from "@/db/queries";
import { media, partnershipTranslations, partnerships, projectTranslations, projects, testimonialTranslations, testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/messages";
import { slugify } from "@/lib/slug";

export type ActionState = { error?: string } | null;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

async function copy() {
  return getDictionary(await getLocale()).errors;
}

async function storeImage(file: FormDataEntryValue | null, errors: Awaited<ReturnType<typeof copy>>) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!ALLOWED_MIME.has(file.type)) throw new Error(errors.imageType);
  if (file.size > MAX_BYTES) throw new Error(errors.imageSize);
  const data = Buffer.from(await file.arrayBuffer());
  const [row] = await getDb().insert(media).values({ mime: file.type, data }).returning({ id: media.id });
  return row?.id ?? null;
}

async function deleteMedia(id: string | null) {
  if (!id) return;
  await getDb().delete(media).where(eq(media.id, id));
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function publicationStatus(value: FormDataEntryValue | null): "draft" | "published" | null {
  if (value === "draft" || value === "published") return value;
  return null;
}

function optionalUrl(value: string, errors: Awaited<ReturnType<typeof copy>>) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\/\S+$/i.test(trimmed)) throw new Error(errors.url);
  return trimmed;
}

async function resolveImage(options: {
  file: FormDataEntryValue | null;
  urlField: string;
  previousMediaId: string | null;
  errors: Awaited<ReturnType<typeof copy>>;
}) {
  const uploaded = await storeImage(options.file, options.errors);
  if (uploaded) {
    if (options.previousMediaId && options.previousMediaId !== uploaded) await deleteMedia(options.previousMediaId);
    return { mediaId: uploaded, url: null as string | null };
  }
  const url = optionalUrl(options.urlField, options.errors);
  if (url && options.previousMediaId) {
    await deleteMedia(options.previousMediaId);
    return { mediaId: null, url };
  }
  return { mediaId: options.previousMediaId, url: url ?? null };
}

function readField(formData: FormData, name: string, locale: Locale) {
  return String(formData.get(`${name}__${locale}`) || "");
}

function revalidateLocales(paths: string[]) {
  for (const locale of locales) {
    for (const path of paths) revalidatePath(`/${locale}${path}`);
  }
}

const projectShape = (errors: Awaited<ReturnType<typeof copy>>) =>
  z.object({
    title: z.string().trim().min(3, errors.title),
    summary: z.string().trim().min(10, errors.summary),
    problem: z.string().trim().min(10, errors.problem),
    solution: z.string().trim().min(10, errors.solution),
    outcome: z.string().trim().min(10, errors.outcome),
    body: z.string(),
    slug: z.string(),
  });

export async function saveProject(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const errors = await copy();
  const id = String(formData.get("id") || "");
  const status = publicationStatus(formData.get("status"));
  if (!status) return { error: errors.check };

  const schema = projectShape(errors);
  const parsedLocales: Record<Locale, z.infer<ReturnType<typeof projectShape>> | null> = {
    "pt-br": null,
    en: null,
    fr: null,
  };

  for (const locale of locales) {
    const raw = {
      title: readField(formData, "title", locale),
      summary: readField(formData, "summary", locale),
      problem: readField(formData, "problem", locale),
      solution: readField(formData, "solution", locale),
      outcome: readField(formData, "outcome", locale),
      body: readField(formData, "body", locale),
      slug: readField(formData, "slug", locale),
    };
    const blank = [raw.title, raw.summary, raw.problem, raw.solution, raw.outcome, raw.body, raw.slug].every(
      (value) => value.trim() === "",
    );
    if (locale !== "pt-br" && blank) continue;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? errors.check };
    parsedLocales[locale] = parsed.data;
  }

  const primary = parsedLocales["pt-br"];
  if (!primary) return { error: errors.check };

  try {
    const db = getDb();
    const existing = id ? (await db.select().from(projects).where(eq(projects.id, id)).limit(1))[0] : undefined;
    if (id && !existing) return { error: errors.projectMissing };

    const slugs = new Map<Locale, string>();
    for (const locale of locales) {
      const data = parsedLocales[locale];
      if (!data) continue;
      const slug = slugify(data.slug.trim() || data.title);
      if (await slugTaken("projects", locale, slug, existing?.id)) return { error: errors.slugProject };
      slugs.set(locale, slug);
    }

    const image = await resolveImage({
      file: formData.get("cover"),
      urlField: String(formData.get("coverUrl") || ""),
      previousMediaId: existing?.coverMediaId ?? null,
      errors,
    });

    const stack = String(formData.get("stack") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const now = new Date();
    const publishedAt = status === "published" ? (existing?.publishedAt ?? now) : (existing?.publishedAt ?? null);
    const values = {
      stack,
      status,
      featured: checked(formData, "featured"),
      isExample: checked(formData, "isExample"),
      coverMediaId: image.mediaId,
      coverUrl: image.url,
      publishedAt,
      updatedAt: now,
    };

    const projectId = existing
      ? existing.id
      : (await db.insert(projects).values(values).returning({ id: projects.id }))[0]?.id;
    if (!projectId) return { error: errors.saveProject };
    if (existing) await db.update(projects).set(values).where(eq(projects.id, existing.id));

    for (const locale of locales) {
      const data = parsedLocales[locale];
      const slug = slugs.get(locale);
      if (!data || !slug) {
        await db
          .delete(projectTranslations)
          .where(and(eq(projectTranslations.projectId, projectId), eq(projectTranslations.locale, locale)));
        continue;
      }
      const translation = {
        projectId,
        locale,
        title: data.title,
        slug,
        summary: data.summary,
        problem: data.problem,
        solution: data.solution,
        outcome: data.outcome,
        body: data.body,
      };
      const [current] = await db
        .select({ id: projectTranslations.id })
        .from(projectTranslations)
        .where(and(eq(projectTranslations.projectId, projectId), eq(projectTranslations.locale, locale)))
        .limit(1);
      if (current) {
        await db.update(projectTranslations).set(translation).where(eq(projectTranslations.id, current.id));
      } else {
        await db.insert(projectTranslations).values(translation);
      }
    }

    revalidateLocales(["", "/projetos"]);
    for (const slug of slugs.values()) revalidateLocales([`/projetos/${slug}`]);
  } catch (error) {
    return { error: error instanceof Error ? error.message : errors.saveProject };
  }

  redirect("/admin/projetos");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const db = getDb();
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!row) redirect("/admin/projetos");
  const copies = await db.select().from(projectTranslations).where(eq(projectTranslations.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
  await deleteMedia(row.coverMediaId);
  revalidateLocales(["", "/projetos"]);
  for (const copy of copies) revalidateLocales([`/projetos/${copy.slug}`]);
  redirect("/admin/projetos");
}

export async function savePartnership(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const errors = await copy();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  if (name.length < 2) return { error: errors.partnershipName };
  const status = publicationStatus(formData.get("status"));
  if (!status) return { error: errors.check };

  const schema = z.object({
    summary: z.string().trim().min(10, errors.summary),
    body: z.string(),
    slug: z.string(),
  });
  const parsedLocales: Partial<Record<Locale, z.infer<typeof schema>>> = {};

  for (const locale of locales) {
    const raw = {
      summary: readField(formData, "summary", locale),
      body: readField(formData, "body", locale),
      slug: readField(formData, "slug", locale),
    };
    const blank = [raw.summary, raw.body, raw.slug].every((value) => value.trim() === "");
    if (locale !== "pt-br" && blank) continue;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? errors.check };
    parsedLocales[locale] = parsed.data;
  }

  try {
    const db = getDb();
    const existing = id ? (await db.select().from(partnerships).where(eq(partnerships.id, id)).limit(1))[0] : undefined;
    if (id && !existing) return { error: errors.partnershipMissing };

    const slugs = new Map<Locale, string>();
    for (const locale of locales) {
      const data = parsedLocales[locale];
      if (!data) continue;
      const slug = slugify(data.slug.trim() || name);
      if (await slugTaken("partnerships", locale, slug, existing?.id)) return { error: errors.slugPartnership };
      slugs.set(locale, slug);
    }

    const image = await resolveImage({
      file: formData.get("logo"),
      urlField: String(formData.get("logoUrl") || ""),
      previousMediaId: existing?.logoMediaId ?? null,
      errors,
    });
    const now = new Date();
    const values = {
      name,
      website: optionalUrl(String(formData.get("website") || ""), errors),
      status,
      isExample: checked(formData, "isExample"),
      logoMediaId: image.mediaId,
      logoUrl: image.url,
      publishedAt: status === "published" ? (existing?.publishedAt ?? now) : (existing?.publishedAt ?? null),
      updatedAt: now,
    };

    const partnershipId = existing
      ? existing.id
      : (await db.insert(partnerships).values(values).returning({ id: partnerships.id }))[0]?.id;
    if (!partnershipId) return { error: errors.savePartnership };
    if (existing) await db.update(partnerships).set(values).where(eq(partnerships.id, existing.id));

    for (const locale of locales) {
      const data = parsedLocales[locale];
      const slug = slugs.get(locale);
      if (!data || !slug) {
        await db
          .delete(partnershipTranslations)
          .where(and(eq(partnershipTranslations.partnershipId, partnershipId), eq(partnershipTranslations.locale, locale)));
        continue;
      }
      const translation = { partnershipId, locale, slug, summary: data.summary, body: data.body };
      const [current] = await db
        .select({ id: partnershipTranslations.id })
        .from(partnershipTranslations)
        .where(and(eq(partnershipTranslations.partnershipId, partnershipId), eq(partnershipTranslations.locale, locale)))
        .limit(1);
      if (current) await db.update(partnershipTranslations).set(translation).where(eq(partnershipTranslations.id, current.id));
      else await db.insert(partnershipTranslations).values(translation);
    }

    revalidateLocales(["", "/parcerias"]);
    for (const slug of slugs.values()) revalidateLocales([`/parcerias/${slug}`]);
  } catch (error) {
    return { error: error instanceof Error ? error.message : errors.savePartnership };
  }

  redirect("/admin/parcerias");
}

export async function deletePartnership(id: string) {
  await requireAdmin();
  const db = getDb();
  const [row] = await db.select().from(partnerships).where(eq(partnerships.id, id)).limit(1);
  if (!row) redirect("/admin/parcerias");
  const copies = await db.select().from(partnershipTranslations).where(eq(partnershipTranslations.partnershipId, id));
  await db.delete(partnerships).where(eq(partnerships.id, id));
  await deleteMedia(row.logoMediaId);
  revalidateLocales(["", "/parcerias"]);
  for (const copy of copies) revalidateLocales([`/parcerias/${copy.slug}`]);
  redirect("/admin/parcerias");
}

export async function saveTestimonial(prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const errors = await copy();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  if (name.length < 2) return { error: errors.personName };
  if (company.length < 2) return { error: errors.company };

  const schema = z.object({
    role: z.string().trim().min(2, errors.role),
    quote: z.string().trim().min(10, errors.quote),
  });
  const parsedLocales: Partial<Record<Locale, z.infer<typeof schema>>> = {};
  for (const locale of locales) {
    const raw = { role: readField(formData, "role", locale), quote: readField(formData, "quote", locale) };
    const blank = raw.role.trim() === "" && raw.quote.trim() === "";
    if (locale !== "pt-br" && blank) continue;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? errors.testimonialCheck };
    parsedLocales[locale] = parsed.data;
  }

  const db = getDb();
  const now = new Date();
  const values = { name, company, published: checked(formData, "published"), updatedAt: now };
  const testimonialId = id
    ? id
    : (await db.insert(testimonials).values(values).returning({ id: testimonials.id }))[0]?.id;
  if (!testimonialId) return { error: errors.testimonialCheck };
  if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));

  for (const locale of locales) {
    const data = parsedLocales[locale];
    if (!data) {
      await db
        .delete(testimonialTranslations)
        .where(and(eq(testimonialTranslations.testimonialId, testimonialId), eq(testimonialTranslations.locale, locale)));
      continue;
    }
    const translation = { testimonialId, locale, role: data.role, quote: data.quote };
    const [current] = await db
      .select({ id: testimonialTranslations.id })
      .from(testimonialTranslations)
      .where(and(eq(testimonialTranslations.testimonialId, testimonialId), eq(testimonialTranslations.locale, locale)))
      .limit(1);
    if (current) await db.update(testimonialTranslations).set(translation).where(eq(testimonialTranslations.id, current.id));
    else await db.insert(testimonialTranslations).values(translation);
  }

  revalidateLocales([""]);
  redirect("/admin/depoimentos");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await getDb().delete(testimonials).where(eq(testimonials.id, id));
  revalidateLocales([""]);
  redirect("/admin/depoimentos");
}
