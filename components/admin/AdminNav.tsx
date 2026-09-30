"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Messages } from "@/messages";

export function AdminNav({
  className,
  onNavigate,
  messages,
}: {
  className?: string;
  onNavigate?: () => void;
  messages: Messages;
}) {
  const links = [
    { href: "/admin", label: messages.admin.panel },
    { href: "/admin/projetos", label: messages.admin.projects },
    { href: "/admin/parcerias", label: messages.admin.partnerships },
    { href: "/admin/depoimentos", label: messages.admin.testimonials },
    { href: "/admin/leads", label: messages.admin.leads },
  ];
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-8", className)} aria-label={messages.admin.nav}>
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "furniture rounded-sm px-2 py-3 text-craft-mist hover:text-craft-bone lg:px-0 lg:py-0",
              active && "text-craft-ember",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
