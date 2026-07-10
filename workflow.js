import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_WORKFLOW_DB_ID,
  });

  const steps = response.results
    .map((page) => ({
      id: page.id,
      name: page.properties["Étape"]?.title?.[0]?.plain_text ?? "",
      order: page.properties["Ordre"]?.number ?? 0,
      phase: page.properties["Phase macro"]?.select?.name ?? "",
    }))
    .sort((a, b) => a.order - b.order);

  res.status(200).json(steps);
}
