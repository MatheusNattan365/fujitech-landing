import { Challenges } from "@/components/Challenges";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Partnerships } from "@/components/Partnerships";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { SiteFrame } from "@/components/SiteFrame";
import { Testimonials } from "@/components/Testimonials";
import { ScrollStages } from "@/components/craft/ScrollStages";
import {
  listPublishedPartnerships,
  listPublishedProjects,
  listPublishedTestimonials,
} from "@/db/queries";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/messages";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ desafio?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const messages = getDictionary(value);
  const { desafio } = await searchParams;
  const [projectList, partnershipList, quotes] = await Promise.all([
    listPublishedProjects(value),
    listPublishedPartnerships(value),
    listPublishedTestimonials(value),
  ]);
  const projects = projectList.filter((item) => !item.isExample);
  const partnerships = partnershipList.filter((item) => !item.isExample);

  return (
    <SiteFrame locale={value} messages={messages}>
      <ScrollStages locale={value} messages={messages} />
      <Services messages={messages} />
      <Challenges locale={value} messages={messages} />
      {projects.length > 0 ? <Projects locale={value} messages={messages} items={projects.slice(0, 3)} /> : null}
      {partnerships.length > 0 ? <Partnerships locale={value} messages={messages} items={partnerships} /> : null}
      <Testimonials messages={messages} items={quotes} />
      <FAQ messages={messages} />
      <Contact locale={value} messages={messages} initialChallenge={desafio} />
    </SiteFrame>
  );
}
