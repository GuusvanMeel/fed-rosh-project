import React from 'react'

export default function UrlPanel({ Text, url }: { Text: string, url: string }) {
  return (
    <div
  className="w-full h-full overflow-y-auto overflow-x-hidden select-none"
  style={{ whiteSpace: "normal", wordBreak: "break-word" }}
      onClick={() => window.open(url!, "_blank")}
    >
      {Text}
    </div>
  );
}
