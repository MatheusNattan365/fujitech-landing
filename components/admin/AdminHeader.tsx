"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { Logo } from "@/components/Logo";
import { AdminNav } from "@/components/admin/AdminNav";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function AdminHeader({ locale, messages }: { locale: Locale; messages: Messages }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-craft-bone/15 bg-craft-ink">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/admin" onClick={() => setOpen(false)} className="shrink-0 rounded-sm">
          <Logo variant="dark" className="h-9 sm:h-11" />
        </Link>
        <AdminNav className="hidden lg:flex" messages={messages} />
        <div className="hidden items-center gap-6 lg:flex">
          <LocaleSwitch locale={locale} label={messages.nav.language} mode="admin" />
          <form action={logoutAction}>
            <button type="submit" className="furniture text-craft-mist hover:text-craft-ember">
              {messages.admin.logout}
            </button>
          </form>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center text-craft-bone lg:hidden"
          aria-expanded={open}
          aria-controls="menu-admin"
          aria-label={open ? messages.nav.close : messages.nav.open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <div id="menu-admin" className="border-t border-craft-bone/15 bg-craft-ink px-5 py-4 lg:hidden">
          <div className="mx-auto grid max-w-[1200px] gap-4">
            <AdminNav onNavigate={() => setOpen(false)} messages={messages} />
            <LocaleSwitch locale={locale} label={messages.nav.language} mode="admin" />
            <form action={logoutAction}>
              <button type="submit" className="furniture px-2 py-3 text-craft-mist hover:text-craft-ember">
                {messages.admin.logout}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </header>
  );
}
