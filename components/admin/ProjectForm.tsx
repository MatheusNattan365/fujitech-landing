"use client";

import { useActionState } from "react";
import { saveProject, type ActionState } from "@/actions/content";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

type Translation = {
  locale: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  body: string;
};

type Project = {
  id: string;
  stack: string[];
  coverUrl: string | null;
  status: "draft" | "published";
  featured: boolean;
  isExample: boolean;
  translations: Translation[];
};

export function ProjectForm({ project, messages }: { project?: Project; messages: Messages }) {
  const [state, action, pending] = useActionState(saveProject, null as ActionState);
  const copy = messages.admin;

  return (
    <form action={action} className="grid max-w-3xl gap-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <LocaleTabs label={copy.language}>
        {(locale) => {
          const current = project?.translations.find((item) => item.locale === locale);
          return (
            <>
              {locale !== "pt-br" ? <p className="text-sm text-craft-mist">{copy.optionalLocale}</p> : null}
              <Field label={copy.title} name={field("title", locale)} defaultValue={current?.title} required={locale === "pt-br"} />
              <Field label={copy.slug} name={field("slug", locale)} defaultValue={current?.slug} placeholder={copy.slugHint} />
              <Area label={copy.summary} name={field("summary", locale)} defaultValue={current?.summary} required={locale === "pt-br"} />
              <Area label={copy.problem} name={field("problem", locale)} defaultValue={current?.problem} required={locale === "pt-br"} />
              <Area label={copy.solution} name={field("solution", locale)} defaultValue={current?.solution} required={locale === "pt-br"} />
              <Area label={copy.outcome} name={field("outcome", locale)} defaultValue={current?.outcome} required={locale === "pt-br"} />
              <Area label={copy.body} name={field("body", locale)} defaultValue={current?.body} rows={12} />
            </>
          );
        }}
      </LocaleTabs>
      <Field label={copy.stack} name="stack" defaultValue={project?.stack.join(", ")} />
      <Field label={copy.coverUrl} name="coverUrl" defaultValue={project?.coverUrl ?? ""} placeholder="https://" />
      <div className="grid gap-2">
        <Label htmlFor="cover">{copy.coverFile}</Label>
        <Input id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">{copy.status}</Label>
        <select id="status" name="status" defaultValue={project?.status ?? "draft"} className="min-h-12 border border-craft-bone/20 bg-craft-ink px-4 text-craft-bone">
          <option value="draft">{copy.draft}</option>
          <option value="published">{copy.published}</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={project?.featured} />
        {copy.featured}
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isExample" defaultChecked={project?.isExample} />
        {copy.exampleProject}
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <Button type="submit" variant="ember" disabled={pending} className="w-fit">
        {pending ? copy.saving : copy.saveProject}
      </Button>
    </form>
  );
}

function field(name: string, locale: Locale) {
  return `${name}__${locale}`;
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<"input">) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

function Area({
  label,
  name,
  rows = 4,
  ...props
}: { label: string; name: string; rows?: number } & React.ComponentProps<"textarea">) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} rows={rows} {...props} />
    </div>
  );
}
