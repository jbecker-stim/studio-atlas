import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {

  const response = await notion.databases.query({
    database_id: process.env.NOTION_INTERACTIONS_DB_ID,
  });

  const interactions = response.results
    .map((page) => ({

      id: page.id,

      name:
        page.properties["Interaction"]?.title?.[0]?.plain_text ?? "",

      code:
        page.properties["Code"]?.rich_text?.[0]?.plain_text ?? "",

      order:
        page.properties["Ordre"]?.number ?? 0,

      stepId:
        page.properties["Étape liée"]?.relation?.[0]?.id ?? null,

      sender:
        page.properties["Émetteur"]?.relation?.[0]?.id ?? null,

      receiver:
        page.properties["Destinataire"]?.relation?.[0]?.id ?? null,

      senderDepartment:
        page.properties["Département émetteur"]?.select?.name ?? "",

      receiverDepartment:
        page.properties["Département destinataire"]?.rich_text?.[0]?.plain_text ?? "",

      type:
        page.properties["Type d'interaction"]?.select?.name ?? "",

      critical:
        page.properties["Critique"]?.select?.name === "TRUE",

      status:
        page.properties["Statut"]?.select?.name ?? "",

      object:
        page.properties["Objet"]?.rich_text?.[0]?.plain_text ?? "",

      trigger:
        page.properties["Déclencheur"]?.rich_text?.[0]?.plain_text ?? "",

      deliverable:
        page.properties["Livrable"]?.rich_text?.[0]?.plain_text ?? "",

      risk:
        page.properties["Risque"]?.rich_text?.[0]?.plain_text ?? "",

      notes:
        page.properties["Notes"]?.rich_text?.[0]?.plain_text ?? ""

    }))
    .sort((a, b) => a.order - b.order);

  res.status(200).json(interactions);

}
