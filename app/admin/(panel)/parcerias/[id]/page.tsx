import { notFound } from "next/navigation";
import { PartnershipForm } from "@/components/admin/PartnershipForm";
import { getPartnership } from "@/db/queries";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function EditPartnershipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const partnership = await getPartnership(id);
  if (!partnership) notFound();
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.editPartnership}</h1>
      <div className="mt-8">
        <PartnershipForm partnership={partnership} messages={messages} />
      </div>
    </div>
  );
}
