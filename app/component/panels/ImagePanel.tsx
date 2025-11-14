import React from 'react'

export default function ImagePanel({ source }: { source: string}) {
return (
   <img
  src={source}
  alt=""
  className="w-full h-full object-cover"
  style={{
    borderRadius: "inherit",
  }}
/>
)
}

