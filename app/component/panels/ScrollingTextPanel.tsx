import React from 'react'
import CurvedLoop from '../reactbits/CurvedLoop';


export default function ScrollingTextPanel({ Text }: { Text: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden rounded">
      <CurvedLoop
        marqueeText={Text}
        speed={3}
        curveAmount={0}
        direction="right"
        interactive={false}
        className="text-white text-sm leading-snug select-none"
      />
    </div>
  );
}

