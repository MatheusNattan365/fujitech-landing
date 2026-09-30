import Link from "next/link";
import { dashboardCounts } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const counts = await dashboardCounts();
  const copy = getDictionary(await getLocale()).admin;
  const cards = [
    { href: "/admin/projetos", label: copy.projects, value: counts.projects },
    { href: "/admin/parcerias", label: copy.partnerships, value: counts.partnerships },
    { href: "/admin/depoimentos", label: copy.testimonialsPublished, value: counts.testimonials },
    { href: "/admin/leads", label: copy.leads, value: counts.leads },
  ];

  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{copy.panel}</h1>
      <p className="mt-3 max-w-2xl text-craft-mist">{copy.panelText}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link href={card.href} className="hairline block bg-craft-ink-accent p-6 hover:border-craft-ember">
              <span className="furniture text-craft-mist">{card.label}</span>
              <span className="mt-3 block font-display text-4xl">{card.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
