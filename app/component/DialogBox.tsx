"use client";

import {
  Dialog,
  Button
} from "@chakra-ui/react";

type DialogBoxProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message?: string;
  type?: "success" | "error" | "info" | "warning";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showClose?: boolean;
  children?: React.ReactNode; 
};

export default function DialogBox({
  open,
  onOpenChange,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  showClose = true,
  children,
}: DialogBoxProps) {
  const colorMap = {
    success: "green.500",
    error: "red.500",
    info: "blue.500",
    warning: "yellow.600",
  };

   return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title color={colorMap[type]}>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {children ? children : message}
          </Dialog.Body>
          {(onConfirm || onCancel) && (
            <Dialog.Footer>
              {cancelText && (
                <Button variant="outline" mr={3} onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
              {onConfirm && (
                <Button
                  bgColor={type === "error" ? "red" : "blue"}
                  color={"white"}
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              )}
            </Dialog.Footer>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}