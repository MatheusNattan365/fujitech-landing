import type { TestimonialView } from "@/db/queries";
import type { Messages } from "@/messages";

export function Testimonials({ messages, items }: { messages: Messages; items: TestimonialView[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-5 py-24 md:px-8 md:py-32" aria-labelledby="depoimentos-titulo">
      <div className="mx-auto max-w-[1200px]">
        <h2 id="depoimentos-titulo" className="text-[1.75rem] md:text-5xl">
          {messages.testimonials.title}
        </h2>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="hairline p-7">
              <blockquote className="max-w-[65ch] text-lg leading-relaxed normal-case tracking-normal">“{item.quote}”</blockquote>
              <p className="mt-6 text-sm text-craft-mist">
                {item.name}
                <span aria-hidden="true"> · </span>
                {item.role}, {item.company}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
