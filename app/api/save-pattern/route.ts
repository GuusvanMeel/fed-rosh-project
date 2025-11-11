import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const filePath = path.join(process.cwd(), "lib/patterns/design-patterns.json");

  const existing = JSON.parse(await fs.readFile(filePath, "utf-8"));
  const updated = { ...existing, ...body };

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
