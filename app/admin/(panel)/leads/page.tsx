import { listLeads } from "@/db/queries";
import { isChallengeId } from "@/lib/challenges";
import { isLocale, localeLabel, toIntlLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatDate } from "@/lib/utils";
import { getDictionary, type Messages } from "@/messages";

function challengeTitle(id: string, leadLocale: string, fallback: Messages) {
  const copy = isLocale(leadLocale) ? getDictionary(leadLocale) : fallback;
  if (isChallengeId(id)) return copy.challenges[id].title;
  return id;
}

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const items = await listLeads();
  const locale = await getLocale();
  const messages = getDictionary(locale);
  const copy = messages.admin;
  return (
    <div>
      <h1 className="text-4xl md:text-5xl">{copy.leads}</h1>
      <p className="mt-3 text-craft-mist">{copy.leadsHint}</p>
      <ul className="mt-8 grid gap-4">
        {items.length === 0 ? <li className="text-craft-mist">{copy.emptyLeads}</li> : null}
        {items.map((item) => (
          <li key={item.id} className="hairline bg-craft-ink-accent p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-2xl uppercase">{item.name}</p>
              <p className="text-sm text-craft-mist">{formatDate(item.createdAt, toIntlLocale(locale))}</p>
            </div>
            <p className="mt-1 text-sm text-craft-mist">
              {item.email} · {item.company}
              {isLocale(item.locale) ? ` · ${copy.origin} ${localeLabel[item.locale]}` : null}
            </p>
            <p className="mt-3 text-sm text-craft-ember">{challengeTitle(item.challenge, item.locale, messages)}</p>
            <p className="mt-3 whitespace-pre-wrap">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
