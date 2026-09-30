"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Messages } from "@/messages";

export function LoginForm({ messages }: { messages: Messages }) {
  const [state, action, pending] = useActionState(loginAction, null as LoginState);
  const copy = messages.admin;

  return (
    <main className="craft grid min-h-screen place-items-center bg-craft-ink px-5 text-craft-bone">
      <form action={action} className="hairline w-full max-w-md bg-craft-ink-alt p-8 md:p-10">
        <Logo variant="dark" className="h-10" />
        <p className="furniture mt-8 text-craft-mist">{copy.backoffice}</p>
        <h1 className="mt-3 text-4xl">{copy.loginTitle}</h1>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{copy.email}</Label>
            <Input id="email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{copy.password}</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          {state?.error ? (
            <p className="text-sm text-red-300" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" variant="ember" disabled={pending}>
            {pending ? copy.entering : copy.enter}
          </Button>
        </div>
      </form>
    </main>
  );
}
