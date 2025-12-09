"use client";

import { Button, Dialog, Stack, VStack } from "@chakra-ui/react";
import { PanelType } from "@/app/types/panel";
import { panelTypes } from "../sidebar";

interface ChoosePanelModalProps {
   open: boolean;                      // controlled open state
  onClose: () => void;                // called when user closes dialog
  onSelect: (type: PanelType) => void; // called when a panel type is chosen
}

export default function ChoosePanelModal({
  open,
  onClose,
  onSelect,
}: ChoosePanelModalProps) {
    
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        // Chakra v3 Dialog gives you the "next" open state
        if (!details.open) onClose();
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Select a panel</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <div>
              Kies welk panel je in deze dropzone wilt plaatsen:
            </div>

            <Stack >
              {panelTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant="surface"
                  onClick={() => onSelect(type)}
                >
                  {type === "scrollingText" ? "Scrolling Text" : type}
                </Button>
              ))}
            </Stack>
          </Dialog.Body>

          <Dialog.Footer gap="2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}