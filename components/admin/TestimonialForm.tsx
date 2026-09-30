"use client";

import { useActionState } from "react";
import { saveTestimonial, type ActionState } from "@/actions/content";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

type Translation = { locale: string; role: string; quote: string };

type Quote = {
  id: string;
  name: string;
  company: string;
  published: boolean;
  translations: Translation[];
};

export function TestimonialForm({ testimonial, messages }: { testimonial?: Quote; messages: Messages }) {
  const [state, action, pending] = useActionState(saveTestimonial, null as ActionState);
  const copy = messages.admin;

  return (
    <form action={action} className="grid max-w-3xl gap-5">
      {testimonial ? <input type="hidden" name="id" value={testimonial.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="name">{copy.name}</Label>
        <Input id="name" name="name" defaultValue={testimonial?.name} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="company">{copy.company}</Label>
        <Input id="company" name="company" defaultValue={testimonial?.company} required />
      </div>
      <LocaleTabs label={copy.language}>
        {(locale) => {
          const current = testimonial?.translations.find((item) => item.locale === locale);
          return (
            <>
              {locale !== "pt-br" ? <p className="text-sm text-craft-mist">{copy.optionalLocale}</p> : null}
              <div className="grid gap-2">
                <Label htmlFor={field("role", locale)}>{copy.role}</Label>
                <Input id={field("role", locale)} name={field("role", locale)} defaultValue={current?.role} required={locale === "pt-br"} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={field("quote", locale)}>{copy.quote}</Label>
                <Textarea id={field("quote", locale)} name={field("quote", locale)} defaultValue={current?.quote} required={locale === "pt-br"} />
              </div>
            </>
          );
        }}
      </LocaleTabs>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={testimonial?.published} />
        {copy.published}
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <Button type="submit" variant="ember" disabled={pending} className="w-fit">
        {pending ? copy.saving : copy.saveTestimonial}
      </Button>
    </form>
  );
}

function field(name: string, locale: Locale) {
  return `${name}__${locale}`;
}
