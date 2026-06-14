import { Box, Button } from "@mui/material";

interface HistoryPanelProps {
  undo: () => void;
  canUndo: boolean;
  redo: () => void;
  canRedo: boolean;
}

export default function HistoryPanel({
  undo,
  canUndo,
  redo,
  canRedo,
}: HistoryPanelProps) {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: 30,
          bottom: 30,
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "#E0DFFF",
          borderRadius: 2,
          width: 120,
          padding: "5px 10px",
        }}
      >
        <Button
          onClick={undo}
          disabled={!canUndo}
          sx={{
            minWidth: 0,
            padding: "1px 4px",
            fontSize: "12px",
            bgcolor: "white",
          }}
        >
          Undo
        </Button>
        <Button
          onClick={redo}
          disabled={!canRedo}
          sx={{
            minWidth: 0,
            padding: "1px 4px",
            fontSize: "12px",
            bgcolor: "white",
          }}
        >
          Redo
        </Button>
      </Box>
    </>
  );
}
