import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProject } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.editProject}</h1>
      <div className="mt-8">
        <ProjectForm project={project} messages={messages} />
      </div>
    </div>
  );
}
