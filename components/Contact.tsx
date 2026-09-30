import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/utils";
import type { Messages } from "@/messages";

export function Contact({
  locale,
  messages,
  initialChallenge,
}: {
  locale: Locale;
  messages: Messages;
  initialChallenge?: string;
}) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const whatsapp = whatsappHref(process.env.NEXT_PUBLIC_WHATSAPP);

  return (
    <section id="contato" className="scroll-mt-24 bg-craft-ink-alt px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-[1.75rem] md:text-5xl">{messages.contact.title}</h2>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-craft-mist sm:text-lg">{messages.contact.intro}</p>
          <ul className="mt-8 grid gap-3">
            {email ? (
              <li>
                <a className="font-medium text-craft-ember underline-offset-4 hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a className="font-medium text-craft-ember underline-offset-4 hover:underline" href={whatsapp}>
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="hairline p-6 md:p-8 lg:col-span-7">
          <ContactForm key={initialChallenge ?? "geral"} locale={locale} messages={messages} initialChallenge={initialChallenge} />
        </div>
      </div>
    </section>
  );
}
