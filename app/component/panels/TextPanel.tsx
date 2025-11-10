import React from 'react'

export default function TextPanel({ Text }: { Text: string }) {
  return (
    <div
      className="
        w-full h-full 
        p-2 rounded 
        text-white text-sm leading-snug
        overflow-y-auto overflow-x-hidden
        select-none 
        break-words
      "
      style={{ whiteSpace: "normal", wordBreak: "break-word" }}
    >
      {Text}
    </div>
  );
}
