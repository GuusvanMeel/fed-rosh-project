
import React from 'react'
import CurvedLoop from '../reactbits/CurvedLoop';

export default function ScrollingTextPanel({ 
  Text, 
  fontSize = 96,
  scrollDirection = 'right'
}: { 
  Text: string;
  fontSize?: number;
  scrollDirection?: 'left' | 'right';
}) {
  return (
    <div className="w-full h-full flex items-center justify-center select-none max-h-[200px]">
      <CurvedLoop
        marqueeText={Text}
        speed={3}
        curveAmount={0}
        direction={scrollDirection}
        interactive={false}
        className="select-none"
        style={{ fontSize: `${fontSize*5}px` }}
      />
    </div>
  );
}