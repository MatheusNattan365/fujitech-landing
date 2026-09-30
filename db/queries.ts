import { and, count, desc, eq, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import {
  leads,
  partnershipTranslations,
  partnerships,
  projectTranslations,
  projects,
  testimonialTranslations,
  testimonials,
} from "@/db/schema";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export type ProjectView = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  body: string;
  stack: string[];
  status: "draft" | "published";
  featured: boolean;
  isExample: boolean;
  coverMediaId: string | null;
  coverUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PartnershipView = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  body: string;
  website: string | null;
  status: "draft" | "published";
  isExample: boolean;
  logoMediaId: string | null;
  logoUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TestimonialView = {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectCopy = typeof projectTranslations.$inferSelect;
type PartnershipCopy = typeof partnershipTranslations.$inferSelect;
type TestimonialCopy = typeof testimonialTranslations.$inferSelect;

function prefer<T extends { locale: string }>(rows: T[], locale: Locale) {
  return rows.find((row) => row.locale === locale) ?? rows.find((row) => row.locale === defaultLocale) ?? rows[0];
}

function projectView(
  project: typeof projects.$inferSelect,
  copy: Pick<ProjectCopy, "title" | "slug" | "summary" | "problem" | "solution" | "outcome" | "body">,
): ProjectView {
  return {
    id: project.id,
    title: copy.title,
    slug: copy.slug,
    summary: copy.summary,
    problem: copy.problem,
    solution: copy.solution,
    outcome: copy.outcome,
    body: copy.body,
    stack: project.stack,
    status: project.status,
    featured: project.featured,
    isExample: project.isExample,
    coverMediaId: project.coverMediaId,
    coverUrl: project.coverUrl,
    publishedAt: project.publishedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function listPublishedProjects(locale: Locale) {
  const fallback = alias(projectTranslations, "project_fallback");
  const rows = await getDb()
    .select({
      project: projects,
      translation: projectTranslations,
      fallback,
    })
    .from(projects)
    .leftJoin(
      projectTranslations,
      and(eq(projectTranslations.projectId, projects.id), eq(projectTranslations.locale, locale)),
    )
    .leftJoin(fallback, and(eq(fallback.projectId, projects.id), eq(fallback.locale, defaultLocale)))
    .where(eq(projects.status, "published"))
    .orderBy(desc(projects.featured), desc(projects.publishedAt));

  return rows.flatMap((row) => {
    const copy = row.translation ?? row.fallback;
    return copy ? [projectView(row.project, copy)] : [];
  });
}

export async function listAllProjects() {
  const rows = await getDb()
    .select({ project: projects, translation: projectTranslations })
    .from(projects)
    .leftJoin(projectTranslations, eq(projectTranslations.projectId, projects.id))
    .orderBy(desc(projects.updatedAt));

  const grouped = new Map<string, { project: typeof projects.$inferSelect; copies: ProjectCopy[] }>();
  for (const row of rows) {
    const current = grouped.get(row.project.id) ?? { project: row.project, copies: [] };
    if (row.translation) current.copies.push(row.translation);
    grouped.set(row.project.id, current);
  }

  return [...grouped.values()].flatMap(({ project, copies }) => {
    const copy = prefer(copies, defaultLocale);
    return copy ? [projectView(project, copy)] : [];
  });
}

export async function getPublishedProject(locale: Locale, slug: string) {
  const db = getDb();
  const matches = await db.select().from(projectTranslations).where(eq(projectTranslations.slug, slug));
  const found = prefer(matches, locale);
  if (!found) return null;

  const [project] = await db.select().from(projects).where(eq(projects.id, found.projectId)).limit(1);
  if (!project || project.status !== "published") return null;

  const copies = await db.select().from(projectTranslations).where(eq(projectTranslations.projectId, project.id));
  const copy = prefer(copies, locale);
  return copy ? projectView(project, copy) : null;
}

export async function projectAlternates(projectId: string) {
  return getDb()
    .select({ locale: projectTranslations.locale, slug: projectTranslations.slug })
    .from(projectTranslations)
    .where(eq(projectTranslations.projectId, projectId));
}

export async function getProject(id: string) {
  const db = getDb();
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (!project) return null;
  const copies = await db.select().from(projectTranslations).where(eq(projectTranslations.projectId, id));
  return { ...project, translations: copies };
}

export async function listPublishedPartnerships(locale: Locale) {
  const fallback = alias(partnershipTranslations, "partnership_fallback");
  const rows = await getDb()
    .select({
      partnership: partnerships,
      translation: partnershipTranslations,
      fallback,
    })
    .from(partnerships)
    .leftJoin(
      partnershipTranslations,
      and(eq(partnershipTranslations.partnershipId, partnerships.id), eq(partnershipTranslations.locale, locale)),
    )
    .leftJoin(fallback, and(eq(fallback.partnershipId, partnerships.id), eq(fallback.locale, defaultLocale)))
    .where(eq(partnerships.status, "published"))
    .orderBy(desc(partnerships.publishedAt));

  return rows.flatMap((row) => {
    const copy = row.translation ?? row.fallback;
    return copy ? [partnershipView(row.partnership, copy)] : [];
  });
}

function partnershipView(
  partnership: typeof partnerships.$inferSelect,
  copy: Pick<PartnershipCopy, "slug" | "summary" | "body">,
): PartnershipView {
  return {
    id: partnership.id,
    name: partnership.name,
    slug: copy.slug,
    summary: copy.summary,
    body: copy.body,
    website: partnership.website,
    status: partnership.status,
    isExample: partnership.isExample,
    logoMediaId: partnership.logoMediaId,
    logoUrl: partnership.logoUrl,
    publishedAt: partnership.publishedAt,
    createdAt: partnership.createdAt,
    updatedAt: partnership.updatedAt,
  };
}

export async function listAllPartnerships() {
  const rows = await getDb()
    .select({ partnership: partnerships, translation: partnershipTranslations })
    .from(partnerships)
    .leftJoin(partnershipTranslations, eq(partnershipTranslations.partnershipId, partnerships.id))
    .orderBy(desc(partnerships.updatedAt));

  const grouped = new Map<string, { partnership: typeof partnerships.$inferSelect; copies: PartnershipCopy[] }>();
  for (const row of rows) {
    const current = grouped.get(row.partnership.id) ?? { partnership: row.partnership, copies: [] };
    if (row.translation) current.copies.push(row.translation);
    grouped.set(row.partnership.id, current);
  }

  return [...grouped.values()].flatMap(({ partnership, copies }) => {
    const copy = prefer(copies, defaultLocale);
    return copy ? [partnershipView(partnership, copy)] : [];
  });
}

export async function getPublishedPartnership(locale: Locale, slug: string) {
  const db = getDb();
  const matches = await db.select().from(partnershipTranslations).where(eq(partnershipTranslations.slug, slug));
  const found = prefer(matches, locale);
  if (!found) return null;

  const [partnership] = await db.select().from(partnerships).where(eq(partnerships.id, found.partnershipId)).limit(1);
  if (!partnership || partnership.status !== "published") return null;

  const copies = await db
    .select()
    .from(partnershipTranslations)
    .where(eq(partnershipTranslations.partnershipId, partnership.id));
  const copy = prefer(copies, locale);
  return copy ? partnershipView(partnership, copy) : null;
}

export async function partnershipAlternates(partnershipId: string) {
  return getDb()
    .select({ locale: partnershipTranslations.locale, slug: partnershipTranslations.slug })
    .from(partnershipTranslations)
    .where(eq(partnershipTranslations.partnershipId, partnershipId));
}

export async function getPartnership(id: string) {
  const db = getDb();
  const [partnership] = await db.select().from(partnerships).where(eq(partnerships.id, id)).limit(1);
  if (!partnership) return null;
  const copies = await db.select().from(partnershipTranslations).where(eq(partnershipTranslations.partnershipId, id));
  return { ...partnership, translations: copies };
}

function testimonialView(
  item: typeof testimonials.$inferSelect,
  copy: Pick<TestimonialCopy, "role" | "quote">,
): TestimonialView {
  return {
    id: item.id,
    name: item.name,
    company: item.company,
    role: copy.role,
    quote: copy.quote,
    published: item.published,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function listPublishedTestimonials(locale: Locale) {
  const fallback = alias(testimonialTranslations, "testimonial_fallback");
  const rows = await getDb()
    .select({
      testimonial: testimonials,
      translation: testimonialTranslations,
      fallback,
    })
    .from(testimonials)
    .leftJoin(
      testimonialTranslations,
      and(eq(testimonialTranslations.testimonialId, testimonials.id), eq(testimonialTranslations.locale, locale)),
    )
    .leftJoin(fallback, and(eq(fallback.testimonialId, testimonials.id), eq(fallback.locale, defaultLocale)))
    .where(eq(testimonials.published, true))
    .orderBy(desc(testimonials.createdAt));

  return rows.flatMap((row) => {
    const copy = row.translation ?? row.fallback;
    return copy ? [testimonialView(row.testimonial, copy)] : [];
  });
}

export async function listAllTestimonials() {
  const rows = await getDb()
    .select({ testimonial: testimonials, translation: testimonialTranslations })
    .from(testimonials)
    .leftJoin(testimonialTranslations, eq(testimonialTranslations.testimonialId, testimonials.id))
    .orderBy(desc(testimonials.updatedAt));

  const grouped = new Map<string, { testimonial: typeof testimonials.$inferSelect; copies: TestimonialCopy[] }>();
  for (const row of rows) {
    const current = grouped.get(row.testimonial.id) ?? { testimonial: row.testimonial, copies: [] };
    if (row.translation) current.copies.push(row.translation);
    grouped.set(row.testimonial.id, current);
  }

  return [...grouped.values()].flatMap(({ testimonial, copies }) => {
    const copy = prefer(copies, defaultLocale);
    return copy ? [testimonialView(testimonial, copy)] : [];
  });
}

export async function getTestimonial(id: string) {
  const db = getDb();
  const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  if (!testimonial) return null;
  const copies = await db.select().from(testimonialTranslations).where(eq(testimonialTranslations.testimonialId, id));
  return { ...testimonial, translations: copies };
}

export async function listLeads() {
  return getDb().select().from(leads).orderBy(desc(leads.createdAt));
}

export async function dashboardCounts() {
  const db = getDb();
  const [projectCount] = await db.select({ value: count() }).from(projects);
  const [partnershipCount] = await db.select({ value: count() }).from(partnerships);
  const [leadCount] = await db.select({ value: count() }).from(leads);
  const [quoteCount] = await db.select({ value: count() }).from(testimonials).where(eq(testimonials.published, true));
  return {
    projects: projectCount?.value ?? 0,
    partnerships: partnershipCount?.value ?? 0,
    leads: leadCount?.value ?? 0,
    testimonials: quoteCount?.value ?? 0,
  };
}

export async function slugTaken(table: "projects" | "partnerships", locale: Locale, slug: string, currentId?: string) {
  const db = getDb();
  if (table === "projects") {
    const [row] = await db
      .select({ id: projectTranslations.projectId })
      .from(projectTranslations)
      .where(
        currentId
          ? and(
              eq(projectTranslations.locale, locale),
              eq(projectTranslations.slug, slug),
              ne(projectTranslations.projectId, currentId),
            )
          : and(eq(projectTranslations.locale, locale), eq(projectTranslations.slug, slug)),
      )
      .limit(1);
    return Boolean(row);
  }
  const [row] = await db
    .select({ id: partnershipTranslations.partnershipId })
    .from(partnershipTranslations)
    .where(
      currentId
        ? and(
            eq(partnershipTranslations.locale, locale),
            eq(partnershipTranslations.slug, slug),
            ne(partnershipTranslations.partnershipId, currentId),
          )
        : and(eq(partnershipTranslations.locale, locale), eq(partnershipTranslations.slug, slug)),
    )
    .limit(1);
  return Boolean(row);
}

export { locales };
