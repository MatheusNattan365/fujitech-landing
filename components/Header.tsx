"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function Header({ locale, messages }: { locale: Locale; messages: Messages }) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: localePath(locale, "/#servicos"), label: messages.nav.services },
    { href: localePath(locale, "/#metodo"), label: messages.nav.process },
    { href: localePath(locale, "/#contato"), label: messages.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <Link href={localePath(locale)} onClick={() => setOpen(false)} className="shrink-0 rounded-sm">
          <Logo variant="dark" priority className="h-9 sm:h-11" />
        </Link>
        <nav className="furniture hidden items-center gap-8 text-craft-bone/80 lg:flex" aria-label={messages.nav.label}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-sm transition-colors hover:text-craft-ember">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-6 lg:flex">
          <LocaleSwitch locale={locale} label={messages.nav.language} mode="path" />
          <Button asChild variant="ember" className="focus-visible:ring-offset-craft-ink">
            <Link href={localePath(locale, "/#contato")}>{messages.nav.talk}</Link>
          </Button>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center text-craft-bone lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? messages.nav.close : messages.nav.open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <nav id="menu-mobile" className="border-t border-craft-bone/15 bg-craft-ink px-5 py-4 lg:hidden" aria-label={messages.nav.mobile}>
          <ul className="mx-auto grid max-w-[1200px] gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="furniture block rounded-sm px-2 py-3 text-craft-bone" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-2 py-3">
              <LocaleSwitch locale={locale} label={messages.nav.language} mode="path" />
            </li>
            <li className="pt-2">
              <Button asChild variant="ember" className="w-full">
                <Link href={localePath(locale, "/#contato")} onClick={() => setOpen(false)}>
                  {messages.nav.talk}
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
