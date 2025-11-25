import { CloseButton } from '@chakra-ui/react';
import {useDndMonitor, useDroppable} from '@dnd-kit/core';
import React, { useRef, useState } from 'react';


type Edge = 'left' | 'center' | 'right' | null;

interface DroppableProps {
  UID: string;
  children: React.ReactNode;
  onEdgeHover?: (info: { dropzoneId: string; edge: Edge }) => void;
  OnDelete:() => void;
  hasPanels: Boolean
    
}

export default function Droppable({ UID, children, onEdgeHover, OnDelete, hasPanels }: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: UID,
  });  
  
const containerRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    setNodeRef(el);
  };

  const [edge, setEdge] = useState<Edge>(null);

  useDndMonitor({
    onDragOver(event) {
      if (!containerRef.current) return;
      if (!event.over || event.over.id !== UID) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Use the center of the active item as a proxy for pointer position
      const activeRect =
        event.active.rect.current.translated ?? event.active.rect.current.initial;

      const activeCenterX = activeRect!.left + activeRect!.width / 2;

      const relativeX = activeCenterX - rect.left;
      const percentageX = relativeX / rect.width;

      let nextEdge: Edge;
      if (percentageX < 0.2) nextEdge = 'left';
      else if (percentageX > 0.8) nextEdge = 'right';
      else nextEdge = 'center';

      setEdge(nextEdge);
      onEdgeHover?.({ dropzoneId: UID, edge: nextEdge });
      console.log(nextEdge + "in droppable zone " + UID);
    },

    onDragEnd() {
      setEdge(null);
      onEdgeHover?.({ dropzoneId: UID, edge: null });
    },

    onDragCancel() {
      setEdge(null);
      onEdgeHover?.({ dropzoneId: UID, edge: null });
    },
  });

  const borderStyle =
    edge === 'left' || edge === 'right'
      ? '2px solid darkgreen'
      : isOver
      ? '2px solid green'
      : '2px dashed gray';

  return (
    <div 
      ref={setRefs}
      style={{
        position: "relative",
        backgroundColor: isOver ? 'rgba(0, 128, 0, 0.2)' : 'rgba(200, 200, 200, 0.3)',
        border: borderStyle,
        transition: 'all 0.2s',
        pointerEvents: "none",
        height: hasPanels ? "auto" : "100px",
        borderRadius: '8px',
        padding: 0
      }}
    >
   <div  style={{ pointerEvents: "auto" }}>
      
       <CloseButton
    size="sm"
    color="red.500"
    position="absolute"      
    top="6px"                
    right="6px"
    pointerEvents="auto"
    onClick={OnDelete}
    _hover={{ bg: "red.100" }}
  />

    {children}
  </div>
</div>
  );
}