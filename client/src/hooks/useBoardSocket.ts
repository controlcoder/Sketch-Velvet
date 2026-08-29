import { useEffect } from "react";
import { socket } from "../config/socket";

import type { CanvasElement } from "../components/Canvas/types";
import type { RemoteCursor } from "../components/Canvas/Canvas";

interface UseBoardSocketProps {
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  setRemoteCursors: React.Dispatch<React.SetStateAction<RemoteCursor[]>>;
}

export function useBoardSocket({
  setElements,
  setRemoteCursors,
}: UseBoardSocketProps) {
  useEffect(() => {
    const handleElementCreate = ({
      element,
    }: {
      element: CanvasElement;
      userId: string;
    }) => {
      setElements((prev) => [...prev, element]);
    };

    const handleElementDelete = ({
      elementId,
    }: {
      elementId: string;
      userId: string;
    }) => {
      setElements((prev) => prev.filter((element) => element.id !== elementId));
    };

    const handleElementUpdate = ({
      element,
    }: {
      element: CanvasElement;
      userId: string;
    }) => {
      setElements((prev) =>
        prev.map((existingElement) =>
          existingElement.id === element.id ? element : existingElement,
        ),
      );
    };

    const handleCursorMove = ({
      userId,
      x,
      y,
    }: {
      userId: string;
      x: number;
      y: number;
    }) => {
      setRemoteCursors((prev) => {
        const existing = prev.find((cursor) => cursor.userId === userId);

        if (existing) {
          return prev.map((cursor) =>
            cursor.userId === userId ? { ...cursor, x, y } : cursor,
          );
        }

        return [
          ...prev,
          {
            userId,
            x,
            y,
          },
        ];
      });
    };

    socket.on("element:create", handleElementCreate);
    socket.on("element:delete", handleElementDelete);
    socket.on("element:update", handleElementUpdate);
    socket.on("cursor:move", handleCursorMove);

    return () => {
      socket.off("element:create", handleElementCreate);
      socket.off("element:delete", handleElementDelete);
      socket.off("element:update", handleElementUpdate);
      socket.off("cursor:move", handleCursorMove);
    };
  }, [setElements, setRemoteCursors]);
}
