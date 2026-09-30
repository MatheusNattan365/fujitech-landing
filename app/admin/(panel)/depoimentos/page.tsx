import Link from "next/link";
import { deleteTestimonial } from "@/actions/content";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listAllTestimonials } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await listAllTestimonials();
  const copy = getDictionary(await getLocale()).admin;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">{copy.testimonials}</h1>
        <Button asChild variant="ember">
          <Link href="/admin/depoimentos/novo">{copy.newTestimonial}</Link>
        </Button>
      </div>
      <p className="mt-3 max-w-2xl text-craft-mist">{copy.testimonialsHint}</p>
      <ul className="mt-8 grid gap-3">
        {items.length === 0 ? <li className="text-craft-mist">{copy.emptyTestimonials}</li> : null}
        {items.map((item) => (
          <li key={item.id} className="hairline flex flex-wrap items-center justify-between gap-4 bg-craft-ink-accent px-5 py-4">
            <div>
              <p className="font-display text-xl uppercase">{item.name}</p>
              <p className="text-sm text-craft-mist">
                {item.role}, {item.company}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={item.published ? "border-craft-ember/40 bg-transparent text-craft-ember" : "border-craft-bone/20 bg-transparent text-craft-mist"}>
                {item.published ? copy.published : copy.hidden}
              </Badge>
              <Link href={`/admin/depoimentos/${item.id}`} className="text-sm text-craft-ember">
                {copy.edit}
              </Link>
              <DeleteButton action={deleteTestimonial.bind(null, item.id)} label={copy.remove} confirmMessage={copy.confirmDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
