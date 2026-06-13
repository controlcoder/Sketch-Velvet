import Button from "@mui/material/Button";

interface ToolButtonProps {
  title: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function ToolButton({
  title,
  active,
  onClick,
  children,
}: ToolButtonProps) {
  return (
    <Button
      title={title}
      onClick={onClick}
      sx={{
        border: "1px solid black",
        padding: "2px 0px",
        minWidth: 0,
        width: 40,
        bgcolor: active ? "#E0DFFF" : "transparent",

        "&:hover": {
          bgcolor: active ? "#E0DFFF" : "#f5f5f5",
        },
      }}
    >
      {children}
    </Button>
  );
}
