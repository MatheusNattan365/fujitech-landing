CREATE TABLE "project_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"outcome" text NOT NULL,
	"body" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partnership_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partnership_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"slug" text NOT NULL,
	"summary" text NOT NULL,
	"body" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonial_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"testimonial_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"role" text NOT NULL,
	"quote" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "partnership_translations" ADD CONSTRAINT "partnership_translations_partnership_id_partnerships_id_fk" FOREIGN KEY ("partnership_id") REFERENCES "public"."partnerships"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "testimonial_translations" ADD CONSTRAINT "testimonial_translations_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "project_translations_project_locale" ON "project_translations" USING btree ("project_id","locale");
--> statement-breakpoint
CREATE UNIQUE INDEX "project_translations_locale_slug" ON "project_translations" USING btree ("locale","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "partnership_translations_partnership_locale" ON "partnership_translations" USING btree ("partnership_id","locale");
--> statement-breakpoint
CREATE UNIQUE INDEX "partnership_translations_locale_slug" ON "partnership_translations" USING btree ("locale","slug");
--> statement-breakpoint
CREATE UNIQUE INDEX "testimonial_translations_testimonial_locale" ON "testimonial_translations" USING btree ("testimonial_id","locale");
--> statement-breakpoint
INSERT INTO "project_translations" ("project_id", "locale", "title", "slug", "summary", "problem", "solution", "outcome", "body")
SELECT "id", 'pt-br', "title", "slug", "summary", "problem", "solution", "outcome", "body" FROM "projects";
--> statement-breakpoint
INSERT INTO "partnership_translations" ("partnership_id", "locale", "slug", "summary", "body")
SELECT "id", 'pt-br', "slug", "summary", "body" FROM "partnerships";
--> statement-breakpoint
INSERT INTO "testimonial_translations" ("testimonial_id", "locale", "role", "quote")
SELECT "id", 'pt-br', "role", "quote" FROM "testimonials";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_slug_unique";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "title";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "slug";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "summary";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "problem";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "solution";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "outcome";
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "body";
--> statement-breakpoint
ALTER TABLE "partnerships" DROP CONSTRAINT "partnerships_slug_unique";
--> statement-breakpoint
ALTER TABLE "partnerships" DROP COLUMN "slug";
--> statement-breakpoint
ALTER TABLE "partnerships" DROP COLUMN "summary";
--> statement-breakpoint
ALTER TABLE "partnerships" DROP COLUMN "body";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP COLUMN "role";
--> statement-breakpoint
ALTER TABLE "testimonials" DROP COLUMN "quote";
--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "locale" text DEFAULT 'pt-br' NOT NULL;
