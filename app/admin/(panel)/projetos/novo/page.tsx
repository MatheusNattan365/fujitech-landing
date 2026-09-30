import { ProjectForm } from "@/components/admin/ProjectForm";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export default async function NewProjectPage() {
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.newProject}</h1>
      <div className="mt-8">
        <ProjectForm messages={messages} />
      </div>
    </div>
  );
}
