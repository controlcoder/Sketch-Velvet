import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { MAX_ZOOM, MIN_ZOOM } from "../../constants/camera";

type ZoomControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export default function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        right: 30,
        bottom: 30,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 2,
        padding: "6px 10px",
      }}
    >
      <Button
        onClick={onZoomOut}
        sx={{ minWidth: 32 }}
        disabled={zoom <= MIN_ZOOM}
      >
        <Remove />
      </Button>

      <Typography
        onClick={onReset}
        sx={{
          minWidth: 50,
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {Math.round(zoom * 100)}%
      </Typography>

      <Button
        onClick={onZoomIn}
        sx={{ minWidth: 32 }}
        disabled={zoom >= MAX_ZOOM}
      >
        <Add />
      </Button>
    </Box>
  );
}
