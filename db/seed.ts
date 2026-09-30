import { and, eq } from "drizzle-orm";
import { loadEnv } from "./load-env";

loadEnv();

type ProjectCopy = {
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  body: string;
};

async function main() {
  const { closeDb, getDb } = await import("./client");
  const { partnershipTranslations, partnerships, projectTranslations, projects } = await import("./schema");
  const db = getDb();
  const now = new Date();

  const examples: Array<{
    stack: string[];
    featured: boolean;
    pt: ProjectCopy;
    en: ProjectCopy;
    fr: ProjectCopy;
  }> = [
    {
      stack: ["TypeScript", "PostgreSQL", "APIs"],
      featured: true,
      pt: {
        title: "Sistema interno modernizado",
        slug: "sistema-interno-modernizado",
        summary: "Exemplo de solução para uma operação que divide pedidos entre planilhas e um sistema lento.",
        problem: "O time registra pedidos em planilhas e em um sistema antigo que não conversa com o financeiro.",
        solution: "Uma aplicação web única, com o fluxo de pedidos e a integração com o financeiro no mesmo lugar.",
        outcome: "Menos retrabalho manual e um caminho claro para crescer sem duplicar dados.",
        body: `Este texto é um **exemplo de solução**. Não descreve um cliente real.

## Contexto
A operação depende de planilhas e de um sistema que não acompanha o volume atual.

## O que a Fujitech faria
Mapear o fluxo, desenhar a aplicação e integrar os dados que hoje ficam soltos entre o comercial e o financeiro.`,
      },
      en: {
        title: "Modernized internal system",
        slug: "modernized-internal-system",
        summary: "Example of a solution for an operation that splits orders between spreadsheets and a slow system.",
        problem: "The team records orders in spreadsheets and in an old system that does not talk to finance.",
        solution: "A single web application, with the order flow and the finance integration in the same place.",
        outcome: "Less manual rework and a clear path to grow without duplicating data.",
        body: `This text is a **solution example**. It does not describe a real client.

## Context
The operation depends on spreadsheets and on a system that no longer matches the current volume.

## What Fujitech would do
Map the flow, design the application, and integrate the data that today sits loose between sales and finance.`,
      },
      fr: {
        title: "Système interne modernisé",
        slug: "systeme-interne-modernise",
        summary: "Exemple de solution pour une opération qui répartit les commandes entre des tableurs et un système lent.",
        problem: "L'équipe enregistre les commandes dans des tableurs et dans un ancien système qui ne parle pas à la finance.",
        solution: "Une application web unique, avec le flux de commandes et l'intégration financière au même endroit.",
        outcome: "Moins de retravail manuel et un chemin clair pour grandir sans dupliquer les données.",
        body: `Ce texte est un **exemple de solution**. Il ne décrit pas un client réel.

## Contexte
L'opération dépend de tableurs et d'un système qui ne suit plus le volume actuel.

## Ce que Fujitech ferait
Cartographier le flux, dessiner l'application et intégrer les données qui restent aujourd'hui entre le commercial et la finance.`,
      },
    },
    {
      stack: ["APIs", "Automações", "PostgreSQL"],
      featured: false,
      pt: {
        title: "Integração entre plataformas",
        slug: "integracao-entre-plataformas",
        summary: "Exemplo de solução para dados que nascem em uma ferramenta e precisam chegar em outra.",
        problem: "Pedidos entram no comercial e só aparecem no estoque depois que alguém copia a informação.",
        solution: "Uma integração que leva o pedido aprovado para o estoque e devolve o status para o comercial.",
        outcome: "O status deixa de depender de uma pessoa lembrar de atualizar duas telas.",
        body: `Este texto é um **exemplo de solução**. Não descreve um cliente real.

## Contexto
Duas plataformas corretas, isoladas, geram atraso e erro de digitação.

## O que a Fujitech faria
Definir o evento que dispara a troca, o contrato dos dados e o que acontece quando uma das pontas falha.`,
      },
      en: {
        title: "Integration between platforms",
        slug: "integration-between-platforms",
        summary: "Example of a solution for data that starts in one tool and needs to reach another.",
        problem: "Orders enter sales and only show up in inventory after someone copies the information.",
        solution: "An integration that sends the approved order to inventory and returns the status to sales.",
        outcome: "Status no longer depends on someone remembering to update two screens.",
        body: `This text is a **solution example**. It does not describe a real client.

## Context
Two correct platforms, kept apart, create delay and typing errors.

## What Fujitech would do
Define the event that starts the exchange, the data contract, and what happens when one side fails.`,
      },
      fr: {
        title: "Intégration entre plateformes",
        slug: "integration-entre-plateformes",
        summary: "Exemple de solution pour des données qui naissent dans un outil et doivent arriver dans un autre.",
        problem: "Les commandes entrent au commercial et n'apparaissent au stock qu'après qu'une personne recopie l'information.",
        solution: "Une intégration qui envoie la commande approuvée au stock et renvoie le statut au commercial.",
        outcome: "Le statut ne dépend plus d'une personne qui se souvient de mettre à jour deux écrans.",
        body: `Ce texte est un **exemple de solution**. Il ne décrit pas un client réel.

## Contexte
Deux plateformes correctes, isolées, créent du retard et des erreurs de saisie.

## Ce que Fujitech ferait
Définir l'événement qui déclenche l'échange, le contrat des données et ce qui se passe quand l'un des côtés échoue.`,
      },
    },
    {
      stack: ["Automações", "Cloud", "APIs"],
      featured: false,
      pt: {
        title: "Automação de rotinas operacionais",
        slug: "automacao-de-rotinas-operacionais",
        summary: "Exemplo de solução para tarefas repetidas que ainda passam por e-mail e conferência manual.",
        problem: "Todo fechamento do dia, alguém exporta relatórios, confere na mão e reenvia para outra área.",
        solution: "Uma rotina que consolida os dados, aponta exceções e entrega o resumo para quem decide.",
        outcome: "A conferência humana fica nas exceções, não na lista inteira.",
        body: `Este texto é um **exemplo de solução**. Não descreve um cliente real.

## Contexto
O processo funciona, mas só enquanto o volume cabe no tempo de uma pessoa.

## O que a Fujitech faria
Separar o que pode ser automático do que ainda precisa de julgamento e colocar isso em uma rotina observável.`,
      },
      en: {
        title: "Automation of operational routines",
        slug: "automation-of-operational-routines",
        summary: "Example of a solution for repeated tasks that still go through email and manual checking.",
        problem: "Every day close, someone exports reports, checks them by hand, and sends them to another area.",
        solution: "A routine that consolidates the data, points out exceptions, and delivers the summary to whoever decides.",
        outcome: "Human checking stays on the exceptions, not on the whole list.",
        body: `This text is a **solution example**. It does not describe a real client.

## Context
The process works, but only while the volume fits inside one person's time.

## What Fujitech would do
Separate what can be automatic from what still needs judgment, and put that into an observable routine.`,
      },
      fr: {
        title: "Automatisation des routines opérationnelles",
        slug: "automatisation-des-routines-operationnelles",
        summary: "Exemple de solution pour des tâches répétées qui passent encore par e-mail et vérification manuelle.",
        problem: "À chaque clôture de journée, quelqu'un exporte des rapports, les vérifie à la main et les renvoie à un autre service.",
        solution: "Une routine qui consolide les données, signale les exceptions et remet le résumé à qui décide.",
        outcome: "La vérification humaine reste sur les exceptions, pas sur toute la liste.",
        body: `Ce texte est un **exemple de solution**. Il ne décrit pas un client réel.

## Contexte
Le processus fonctionne, mais seulement tant que le volume tient dans le temps d'une personne.

## Ce que Fujitech ferait
Séparer ce qui peut être automatique de ce qui demande encore un jugement, et le placer dans une routine observable.`,
      },
    },
  ];

  for (const example of examples) {
    const [existing] = await db
      .select({ projectId: projectTranslations.projectId })
      .from(projectTranslations)
      .where(and(eq(projectTranslations.locale, "pt-br"), eq(projectTranslations.slug, example.pt.slug)))
      .limit(1);
    const projectId =
      existing?.projectId ??
      (
        await db
          .insert(projects)
          .values({
            stack: example.stack,
            status: "published",
            featured: example.featured,
            isExample: true,
            publishedAt: now,
            updatedAt: now,
          })
          .returning({ id: projects.id })
      )[0]?.id;
    if (!projectId) continue;
    for (const [locale, copy] of [
      ["pt-br", example.pt],
      ["en", example.en],
      ["fr", example.fr],
    ] as const) {
      await db
        .insert(projectTranslations)
        .values({ projectId, locale, ...copy })
        .onConflictDoNothing({ target: [projectTranslations.locale, projectTranslations.slug] });
    }
  }

  const partnership = {
    name: "Página modelo de parceria",
    pt: {
      slug: "pagina-modelo-de-parceria",
      summary: "Exemplo de como uma parceria publicada aparece no site. Não representa um parceiro real.",
      body: `Esta página é um **modelo**. Ela existe para mostrar o formato de uma parceria: contexto, o que cada lado faz e como o trabalho aparece para quem visita o site.

Quando houver uma parceria real, o conteúdo desta página pode ser substituído ou despublicado no backoffice.`,
    },
    en: {
      slug: "sample-partnership-page",
      summary: "Example of how a published partnership appears on the site. It does not represent a real partner.",
      body: `This page is a **sample**. It exists to show the shape of a partnership: context, what each side does, and how the work appears to someone visiting the site.

When there is a real partnership, the content of this page can be replaced or unpublished in the backoffice.`,
    },
    fr: {
      slug: "page-modele-de-partenariat",
      summary: "Exemple de la façon dont un partenariat publié apparaît sur le site. Il ne représente pas un partenaire réel.",
      body: `Cette page est un **modèle**. Elle existe pour montrer le format d'un partenariat : le contexte, ce que chaque côté fait et comment le travail apparaît à qui visite le site.

Lorsqu'il y aura un partenariat réel, le contenu de cette page pourra être remplacé ou dépublié dans le backoffice.`,
    },
  };

  const [existingPartnership] = await db
    .select({ partnershipId: partnershipTranslations.partnershipId })
    .from(partnershipTranslations)
    .where(and(eq(partnershipTranslations.locale, "pt-br"), eq(partnershipTranslations.slug, partnership.pt.slug)))
    .limit(1);
  const partnershipId =
    existingPartnership?.partnershipId ??
    (
      await db
        .insert(partnerships)
        .values({
          name: partnership.name,
          website: null,
          status: "published",
          isExample: true,
          publishedAt: now,
          updatedAt: now,
        })
        .returning({ id: partnerships.id })
    )[0]?.id;

  if (partnershipId) {
    for (const [locale, copy] of [
      ["pt-br", partnership.pt],
      ["en", partnership.en],
      ["fr", partnership.fr],
    ] as const) {
      await db
        .insert(partnershipTranslations)
        .values({ partnershipId, locale, ...copy })
        .onConflictDoNothing({ target: [partnershipTranslations.locale, partnershipTranslations.slug] });
    }
  }

  await closeDb();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
