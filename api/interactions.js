import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default async function handler(req, res) {

  const response = await notion.search({
    filter: {
      property: "object",
      value: "database",
    },
  });

  const databases = response.results.map(db => ({
    id: db.id,
    title: db.title?.map(t => t.plain_text).join("") || "(sans titre)"
  }));

  res.status(200).json(databases);

}
