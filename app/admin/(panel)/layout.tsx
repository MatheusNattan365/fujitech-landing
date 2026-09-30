import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const locale = await getLocale();
  return (
    <AdminShell locale={locale} messages={getDictionary(locale)}>
      {children}
    </AdminShell>
  );
}
