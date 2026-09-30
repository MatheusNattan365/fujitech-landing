import { boolean, customType, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const contentStatus = pgEnum("content_status", ["draft", "published"]);

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  mime: text("mime").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  coverUrl: text("cover_url"),
  stack: text("stack").array().notNull(),
  status: contentStatus("status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  isExample: boolean("is_example").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectTranslations = pgTable(
  "project_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    outcome: text("outcome").notNull(),
    body: text("body").notNull().default(""),
  },
  (table) => [
    uniqueIndex("project_translations_project_locale").on(table.projectId, table.locale),
    uniqueIndex("project_translations_locale_slug").on(table.locale, table.slug),
  ],
);

export const partnerships = pgTable("partnerships", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logoMediaId: uuid("logo_media_id").references(() => media.id, { onDelete: "set null" }),
  logoUrl: text("logo_url"),
  website: text("website"),
  status: contentStatus("status").notNull().default("draft"),
  isExample: boolean("is_example").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const partnershipTranslations = pgTable(
  "partnership_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    partnershipId: uuid("partnership_id")
      .notNull()
      .references(() => partnerships.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull().default(""),
  },
  (table) => [
    uniqueIndex("partnership_translations_partnership_locale").on(table.partnershipId, table.locale),
    uniqueIndex("partnership_translations_locale_slug").on(table.locale, table.slug),
  ],
);

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const testimonialTranslations = pgTable(
  "testimonial_translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    role: text("role").notNull(),
    quote: text("quote").notNull(),
  },
  (table) => [uniqueIndex("testimonial_translations_testimonial_locale").on(table.testimonialId, table.locale)],
);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  challenge: text("challenge").notNull(),
  message: text("message").notNull(),
  locale: text("locale").notNull().default("pt-br"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
