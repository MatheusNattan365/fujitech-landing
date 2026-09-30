import type { Messages } from "@/messages";

export function Services({ messages }: { messages: Messages }) {
  return (
    <section id="servicos" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="max-w-[14ch] text-[1.75rem] md:text-5xl">{messages.services.title}</h2>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-craft-mist sm:text-lg">{messages.services.intro}</p>
        <ul className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {messages.services.items.map((service, index) => (
            <li key={service.title} className="flex flex-col gap-4">
              <span className="font-display text-craft-ember">0{index + 1}</span>
              <h3 className="text-2xl">{service.title}</h3>
              <p className="max-w-[48ch] leading-relaxed text-craft-mist">{service.text}</p>
              <p className="text-sm text-craft-bone">{service.evidence}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
