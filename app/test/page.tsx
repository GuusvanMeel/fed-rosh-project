import { createServer } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createServer();

  const { data: projects, error } = await supabase.from("panels").select("*");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>✓ Connection successful!</p>
          <p>panels in database: {projects?.length || 0}</p>
          <div>
             {projects?.map((row: any, i: number) => (
              <tr key={row.uuid || i} className="border-b border-green-200">
                <td className="p-2 font-mono">{row.uuid}</td>
                <td className="p-2 font-mono">{row.page_id}</td>
                <td className="p-2">{row.x}</td>
                <td className="p-2">{row.y}</td>
                <td className="p-2">{row.w}</td>
                <td className="p-2">{row.h}</td>
              </tr>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}