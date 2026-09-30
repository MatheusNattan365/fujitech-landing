import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/messages";

export function AdminShell({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <div className="craft min-h-screen bg-craft-ink text-craft-bone">
      <AdminHeader locale={locale} messages={messages} />
      <main className="mx-auto w-full max-w-[1200px] px-5 pt-28 pb-16 md:px-8 md:pt-36">{children}</main>
    </div>
  );
}
