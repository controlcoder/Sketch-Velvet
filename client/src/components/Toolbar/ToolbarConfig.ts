import {
  SquareOutlined,
  CircleOutlined,
  ArrowForward,
  TextFieldsTwoTone,
  LineAxisSharp,
  Edit,
} from "@mui/icons-material";
import type { Tool } from "../Canvas/types";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";

  type ToolBar = {
    key: Tool;
    title: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
      muiName: string;
    };
  };

  export const toolbarConfig: ToolBar[] = [
    {
      key: "rectangle",
      title: "Rectangle",
      icon: SquareOutlined,
    },
    {
      key: "circle",
      title: "Circle",
      icon: CircleOutlined,
    },
    {
      key: "line",
      title: "Line",
      icon: LineAxisSharp,
    },
    {
      key: "arrow",
      title: "Arrow",
      icon: ArrowForward,
    },
    {
      key: "text",
      title: "Text",
      icon: TextFieldsTwoTone,
    },
    {
      key: "pencil",
      title: "Pencil",
      icon: Edit,
    },
  ];
