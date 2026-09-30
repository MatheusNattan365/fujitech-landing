"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/actions/leads";
import { challengeIds, isChallengeId } from "@/lib/challenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

const initial: LeadState = null;

export function ContactForm({
  locale,
  messages,
  initialChallenge,
}: {
  locale: Locale;
  messages: Messages;
  initialChallenge?: string;
}) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const selected = isChallengeId(initialChallenge) ? initialChallenge : "modernizar";

  if (state?.ok) {
    return (
      <p className="hairline px-6 py-8 text-base text-craft-bone" role="status">
        {messages.contact.success}
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={messages.contact.name} name="name" autoComplete="name" required />
        <Field label={messages.contact.email} name="email" type="email" autoComplete="email" required />
      </div>
      <Field label={messages.contact.company} name="company" autoComplete="organization" required />
      <div className="grid gap-2">
        <Label htmlFor="challenge" className="text-craft-bone">
          {messages.contact.challenge}
        </Label>
        <select
          id="challenge"
          name="challenge"
          defaultValue={selected}
          className="min-h-12 w-full border border-craft-bone/20 bg-craft-ink px-4 text-base text-craft-bone outline-none focus:border-craft-ember"
          required
        >
          {challengeIds.map((id) => (
            <option key={id} value={id}>
              {messages.challenges[id].title}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message" className="text-craft-bone">
          {messages.contact.message}
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder={messages.contact.placeholder}
          className="border-craft-bone/20 bg-craft-ink text-craft-bone placeholder:text-craft-mist focus:border-craft-ember focus:ring-craft-ember/30"
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" variant="ember" disabled={pending} className="w-full sm:w-fit">
        {pending ? messages.contact.pending : messages.contact.submit}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  ...props
}: { label: string; name: string } & React.ComponentProps<"input">) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="text-craft-bone">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        className="border-craft-bone/20 bg-craft-ink text-craft-bone placeholder:text-craft-mist focus:border-craft-ember focus:ring-craft-ember/30"
        {...props}
      />
    </div>
  );
}
