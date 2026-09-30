import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getDictionary } from "@/messages";

export default async function NotFound() {
  const locale = await getLocale();
  const messages = getDictionary(locale);
  return (
    <main className="craft grid min-h-screen place-items-center bg-craft-ink px-6 text-craft-bone">
      <div className="max-w-lg">
        <h1 className="text-[2.25rem]">{messages.errors.notFound}</h1>
        <Link href={localePath(locale)} className="mt-6 inline-block text-base font-medium text-craft-ember">
          {messages.errors.backHome}
        </Link>
      </div>
    </main>
  );
}
