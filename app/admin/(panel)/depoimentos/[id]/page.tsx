import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getTestimonial } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonial(id);
  if (!testimonial) notFound();
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.editTestimonial}</h1>
      <div className="mt-8">
        <TestimonialForm testimonial={testimonial} messages={messages} />
      </div>
    </div>
  );
}
