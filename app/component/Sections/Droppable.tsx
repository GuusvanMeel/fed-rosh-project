import { JsxElement } from '@chakra-ui/react';
import {useDroppable} from '@dnd-kit/core';
import React from 'react';


export default function Droppable({ UID, children }: { UID: string, children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: UID,
  });
  
  return (
    <div 
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? 'rgba(0, 128, 0, 0.2)' : 'rgba(200, 200, 200, 0.3)',
        border: isOver ? '2px solid green' : '2px dashed gray',
        transition: 'all 0.2s',
        minHeight: '150px',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <div className="text-sm text-gray-500 mb-2">Drop Zone: {UID}</div>
      {children}
    </div>
  );
}