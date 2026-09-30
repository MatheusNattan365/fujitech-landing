"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className="border-y border-border">
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.question} value={item.question} className="border-b border-border last:border-b-0">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold tracking-tight text-ink md:text-xl">
              {item.question}
              <ChevronDown className="size-5 shrink-0 text-brand-blue transition duration-200 group-data-[state=open]:rotate-180" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="accordion-panel overflow-hidden text-muted">
            <p className="max-w-3xl pb-6 leading-relaxed">{item.answer}</p>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
