"use client";

import { useActionState } from "react";
import { savePartnership, type ActionState } from "@/actions/content";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

type Translation = { locale: string; slug: string; summary: string; body: string };

type Partnership = {
  id: string;
  name: string;
  website: string | null;
  logoUrl: string | null;
  status: "draft" | "published";
  isExample: boolean;
  translations: Translation[];
};

export function PartnershipForm({ partnership, messages }: { partnership?: Partnership; messages: Messages }) {
  const [state, action, pending] = useActionState(savePartnership, null as ActionState);
  const copy = messages.admin;

  return (
    <form action={action} className="grid max-w-3xl gap-5">
      {partnership ? <input type="hidden" name="id" value={partnership.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="name">{copy.name}</Label>
        <Input id="name" name="name" defaultValue={partnership?.name} required />
      </div>
      <LocaleTabs label={copy.language}>
        {(locale) => {
          const current = partnership?.translations.find((item) => item.locale === locale);
          return (
            <>
              {locale !== "pt-br" ? <p className="text-sm text-craft-mist">{copy.optionalLocale}</p> : null}
              <Field label={copy.slug} name={field("slug", locale)} defaultValue={current?.slug} placeholder={copy.slugHint} />
              <Area label={copy.summary} name={field("summary", locale)} defaultValue={current?.summary} required={locale === "pt-br"} />
              <Area label={copy.body} name={field("body", locale)} defaultValue={current?.body} rows={12} />
            </>
          );
        }}
      </LocaleTabs>
      <div className="grid gap-2">
        <Label htmlFor="website">{copy.website}</Label>
        <Input id="website" name="website" defaultValue={partnership?.website ?? ""} placeholder="https://" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="logoUrl">{copy.logoUrl}</Label>
        <Input id="logoUrl" name="logoUrl" defaultValue={partnership?.logoUrl ?? ""} placeholder="https://" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="logo">{copy.logoFile}</Label>
        <Input id="logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">{copy.status}</Label>
        <select id="status" name="status" defaultValue={partnership?.status ?? "draft"} className="min-h-12 border border-craft-bone/20 bg-craft-ink px-4 text-craft-bone">
          <option value="draft">{copy.draft}</option>
          <option value="published">{copy.published}</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isExample" defaultChecked={partnership?.isExample} />
        {copy.examplePartnership}
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <Button type="submit" variant="ember" disabled={pending} className="w-fit">
        {pending ? copy.saving : copy.savePartnership}
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
