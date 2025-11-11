import fs from "fs";
import path from "path";

export async function POST(req: Request): Promise<Response> {
  try {
    const { color }: { color: string } = await req.json();

    const cssPath = path.join(process.cwd(), "app", "globals.css");
    let css = fs.readFileSync(cssPath, "utf8");

    // Replace color inside :root { ... }
    css = css.replace(
      /(:root\s*{[^}]*--background:\s*)#[0-9A-Fa-f]{3,6}([^}]*})/,
      `$1${color}$2`
    );

    fs.writeFileSync(cssPath, css, "utf8");

    return new Response(
      JSON.stringify({ success: true, color }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error updating CSS:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
