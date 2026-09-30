import Link from "next/link";
import { Logo } from "@/components/Logo";
import { localePath, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/utils";
import type { Messages } from "@/messages";

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const whatsapp = whatsappHref(process.env.NEXT_PUBLIC_WHATSAPP);
  const year = new Date().getFullYear();
  const links = [
    { href: localePath(locale, "/#servicos"), label: messages.nav.services },
    { href: localePath(locale, "/#diferenciais"), label: messages.footer.differentiators },
    { href: localePath(locale, "/#metodo"), label: messages.nav.process },
    { href: localePath(locale, "/#contato"), label: messages.nav.contact },
    { href: localePath(locale, "/projetos"), label: messages.footer.projects },
    { href: localePath(locale, "/parcerias"), label: messages.footer.partnerships },
  ];

  return (
    <footer className="border-t border-craft-bone/15 px-5 py-20 md:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-12 md:flex-row">
        <div>
          <Logo variant="dark" className="h-10 sm:h-11" />
          <p className="mt-6 max-w-xs text-craft-mist">{messages.footer.blurb}</p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <p className="furniture text-craft-bone">{messages.footer.map}</p>
            <ul className="grid gap-2 text-sm text-craft-mist">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="rounded-sm hover:text-craft-ember">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="furniture text-craft-bone">{messages.footer.talk}</p>
            <ul className="grid gap-2 text-sm text-craft-mist">
              {email ? (
                <li>
                  <a className="hover:text-craft-ember" href={`mailto:${email}`}>
                    {email}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a className="hover:text-craft-ember" href={whatsapp}>
                    WhatsApp
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="furniture text-craft-bone">{messages.footer.legal}</p>
            <Link href={localePath(locale, "/privacidade")} className="text-sm text-craft-mist hover:text-craft-ember">
              {messages.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
      <div className="furniture mx-auto mt-16 flex max-w-[1200px] flex-wrap justify-between gap-3 text-xs text-craft-mist">
        <p>© {year} Fujitech Software</p>
      </div>
    </footer>
  );
}
