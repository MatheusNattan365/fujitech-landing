import type { Messages } from "@/messages";

export function FAQ({ messages }: { messages: Messages }) {
  return (
    <section id="faq" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-[1.75rem] md:text-5xl">{messages.faq.title}</h2>
        <div className="mt-12">
          {messages.faq.items.map((item) => (
            <details key={item.question} className="hairline-b group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-6 pr-8">
                <span className="text-base font-medium text-craft-bone">{item.question}</span>
                <span className="text-craft-ember transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-[65ch] pb-6 leading-relaxed text-craft-mist">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
