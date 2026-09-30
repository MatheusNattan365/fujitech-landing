import { PartnershipForm } from "@/components/admin/PartnershipForm";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export default async function NewPartnershipPage() {
  const messages = getDictionary(await getLocale());
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{messages.admin.newPartnership}</h1>
      <div className="mt-8">
        <PartnershipForm messages={messages} />
      </div>
    </div>
  );
}
