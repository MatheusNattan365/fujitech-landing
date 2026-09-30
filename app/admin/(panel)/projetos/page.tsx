import Link from "next/link";
import { deleteProject } from "@/actions/content";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listAllProjects } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const items = await listAllProjects();
  const copy = getDictionary(await getLocale()).admin;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">{copy.projects}</h1>
        <Button asChild variant="ember">
          <Link href="/admin/projetos/novo">{copy.newProject}</Link>
        </Button>
      </div>
      <ul className="mt-8 grid gap-3">
        {items.length === 0 ? <li className="text-craft-mist">{copy.emptyProjects}</li> : null}
        {items.map((item) => (
          <li key={item.id} className="hairline flex flex-wrap items-center justify-between gap-4 bg-craft-ink-accent px-5 py-4">
            <div>
              <p className="font-display text-xl uppercase">{item.title}</p>
              <p className="text-sm text-craft-mist">/pt-br/projetos/{item.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={item.status === "published" ? "border-craft-ember/40 bg-transparent text-craft-ember" : "border-craft-bone/20 bg-transparent text-craft-mist"}>
                {item.status === "published" ? copy.published : copy.draft}
              </Badge>
              <Link href={`/admin/projetos/${item.id}`} className="text-sm text-craft-ember">
                {copy.edit}
              </Link>
              <DeleteButton action={deleteProject.bind(null, item.id)} label={copy.remove} confirmMessage={copy.confirmDelete} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
