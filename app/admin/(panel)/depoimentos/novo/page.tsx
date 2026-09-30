import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export default async function NewTestimonialPage() {
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.newTestimonial}</h1>
      <div className="mt-8">
        <TestimonialForm messages={messages} />
      </div>
    </div>
  );
}
