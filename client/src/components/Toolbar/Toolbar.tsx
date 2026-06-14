import { Box, TextField } from "@mui/material";
import { toolbarConfig } from "./ToolbarConfig";
import ToolButton from "./ToolButton";
import type { Tool } from "../Canvas/types";

interface ToolbarProps {
  tool: Tool;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
  strokeColor: string;
  setStrokeColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function Toolbar({
  tool,
  setTool,
  strokeColor,
  setStrokeColor,
}: ToolbarProps) {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 30,
          left: "35%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {toolbarConfig.map((item) => {
          const Icon = item.icon;

          return (
            <ToolButton
              key={item.key}
              title={item.title}
              active={tool === item.key}
              onClick={() =>
                setTool((prev) => {
                  return prev === item.key ? "select" : item.key;
                })
              }
            >
              <Icon
                sx={{
                  color: "black",
                  fontSize: 20,
                }}
              />
            </ToolButton>
          );
        })}

        <TextField
          type="color"
          value={strokeColor}
          sx={{
            width: 40,
            "& .MuiInputBase-root": {
              height: 28,
              padding: "0px 2px",
            },
            "& input": {
              height: 28,
              padding: 0,
              cursor: "pointer",
            },
          }}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
      </Box>
    </>
  );
}
