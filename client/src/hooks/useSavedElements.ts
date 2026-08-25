import { useEffect, useState } from "react";
import { boardApi } from "../api/board.api";
import type { Camera, CanvasElement } from "../components/Canvas/types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface UseSavedElementsProps {
  boardId: string;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
}

export function useSavedElements({
  boardId,
  setElements,
  setCamera,
}: UseSavedElementsProps) {
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  const getBoardInfo = async () => {
    if (!boardId) return;

    try {
      const { data } = await boardApi.get(boardId);
      setRole(data.board.role || null);
      setElements(data.board.elements);
      setCamera(data.board.viewport);
    } catch (err) {
      toast.error("Board not found");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    getBoardInfo();
  }, []);

  return {
    isViewer: role === "VIEWER"
  };
}
