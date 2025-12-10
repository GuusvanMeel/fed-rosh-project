import { CloseButton } from '@chakra-ui/react';
import {useDndMonitor, useDroppable} from '@dnd-kit/core';
import React, { useRef, useState } from 'react';


export type Edge = 'left' | 'center' | 'right' | null;

interface DroppableProps {
  UID: string;
  children: React.ReactNode;
  onEdgeHover?: (info: { dropzoneId: string; edge: Edge }) => void;
  OnDelete:() => void;
  hasPanels: boolean  
  onOpenPanelModal: (zoneId: string) => void;  
}

export default function Droppable({ UID, children, onEdgeHover, OnDelete, hasPanels, onOpenPanelModal }: DroppableProps) {
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
    onDragMove(event) {
      if (!containerRef.current) return;
      if (!event.over || event.over.id !== UID) {setEdge(null); return;}

      const rect = containerRef.current.getBoundingClientRect();

      // Use the center of the active item as a proxy for pointer position
      const activeRect =
        event.active.rect.current.translated ?? event.active.rect.current.initial;

      const activeCenterX = activeRect!.left + activeRect!.width / 2;

      const relativeX = activeCenterX - rect.left;
      const percentageX = relativeX / rect.width;

      let nextEdge: Edge;
      if (percentageX < 0.1) nextEdge = 'left';
      else if (percentageX > 0.9) nextEdge = 'right';
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
   zIndex={10}
  />
  {edge === "left" && (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "6px",
      height: "100%",
      backgroundColor: "rgba(0, 150, 255, 0.7)",
      borderRadius: "4px 0 0 4px",
      zIndex: 5,
      pointerEvents: "none",
    }}
  />
)}

{/* Right edge highlight */}
{edge === "right" && (
  <div
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      width: "6px",
      height: "100%",
      backgroundColor: "rgba(0, 150, 255, 0.7)",
      borderRadius: "0 4px 4px 0",
      zIndex: 5,
      pointerEvents: "none",
    }}
  />
)}
{children}
   {!hasPanels && (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "3px",
      pointerEvents: "none",
      zIndex: 5,
    }}
  >
    {/* Mini inward arrows */}
    <img
      src="/inwardArrows.svg"
      alt="inward arrows"
      style={{
        width: "18px",
        height: "18px",
        opacity: 0.7,
      }}
    />

    {/* OR text */}
    <div
      style={{
        fontSize: "10px",
        color: "#444",
        opacity: 0.8,
        fontWeight: 500,
        marginTop: "-2px",
      }}
    >
      OR
    </div>

    {/* Add panel button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpenPanelModal(UID);
      }}
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        pointerEvents: "auto",
        marginTop: "-2px",
        
      }}
    >
      Add a panel
    </button>
  </div>
)}
  </div>
</div>
  );
}