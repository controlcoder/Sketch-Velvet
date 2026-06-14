import { useCallback, useLayoutEffect, useRef } from "react";
import type { Camera } from "../Canvas/types";

interface TextEditorProps {
  strokeColor: string;
  camera: Camera;
  textEditor: {
    x: number;
    y: number;
    value: string;
  } | null;
  setTextEditor: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      value: string;
    } | null>
  >;
  onSave: (text: string, x: number, y: number) => void;
}

export default function TextEditor({
  strokeColor,
  camera,
  textEditor,
  setTextEditor,
  onSave
}: TextEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const saveText = useCallback(() => {
    if (!textEditor) return;

    const value = textEditor.value.trim();

    if (!value) {
      setTextEditor(null);
      return;
    }

    onSave(value, textEditor.x, textEditor.y);

    setTextEditor(null);
  }, [textEditor, setTextEditor, onSave]);

  useLayoutEffect(() => {
    if (!textEditor || !textAreaRef || !textAreaRef.current) return;

    textAreaRef.current.focus();
  }, [textEditor]);

  return (
    <>
      {textEditor && (
        <textarea
          ref={textAreaRef}
          autoFocus
          value={textEditor.value}
          onChange={(e) =>
            setTextEditor((prev) =>
              prev
                ? {
                    ...prev,
                    value: e.target.value,
                  }
                : null,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveText();
            }
          }}
          onBlur={saveText}
          style={{
            position: "fixed",
            left: textEditor.x * camera.zoom + camera.x,
            top: textEditor.y * camera.zoom + camera.y,
            backgroundColor: "transparent",
            color: strokeColor,
            border: "none",
            outline: "none",
            resize: "none",
            overflow: "hidden",
          }}
        />
      )}
    </>
  );
}
