import Image from 'next/image'
import React from 'react'

export default function ImagePanel({ source }: { source: string}) {
return (
   <Image
  src={source}
  alt=""
  width={300}
  height={100}
  className="w-full h-full object-cover"
  style={{
  borderRadius: "inherit",
  }}
/>
)
}

