import React from 'react'

export default function UrlPanel({ Text, url }: { Text: string, url: string }) {
  return (
    <div
      className="
        w-full h-full 
        p-2 rounded 
        text-white text-sm leading-snug
        overflow-y-auto overflow-x-hidden
        pointer-events-none 
        select-none 
        break-words
      "
      //pointer-events-none zorgt ervoor dat hij hem niet openend als je er op klikt ivm dragging
      style={{ whiteSpace: "normal", wordBreak: "break-word" }}
      onClick={() => window.open(url!, "_blank")}
    >
      {Text}
    </div>
  );
}
