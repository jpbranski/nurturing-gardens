"use client";

import { Button, ButtonGroup, Paper } from "@mui/material";
import {
  CropSquare,
  Circle,
  Timeline,
  TextFields,
  Delete,
} from "@mui/icons-material";

interface ToolbarProps {
  onAddShape: (type: "rect" | "circle" | "line" | "text") => void;
  onDelete: () => void;
  hasSelection: boolean;
}

export default function Toolbar({ onAddShape, onDelete, hasSelection }: ToolbarProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <ButtonGroup variant="contained" aria-label="shape tools">
        <Button
          startIcon={<CropSquare />}
          onClick={() => onAddShape("rect")}
          title="Add Rectangle"
        >
          Rectangle
        </Button>
        <Button
          startIcon={<Circle />}
          onClick={() => onAddShape("circle")}
          title="Add Circle"
        >
          Circle
        </Button>
        <Button
          startIcon={<Timeline />}
          onClick={() => onAddShape("line")}
          title="Add Line"
        >
          Line
        </Button>
        <Button
          startIcon={<TextFields />}
          onClick={() => onAddShape("text")}
          title="Add Text"
        >
          Text
        </Button>
      </ButtonGroup>

      <Button
        variant="outlined"
        color="error"
        startIcon={<Delete />}
        onClick={onDelete}
        disabled={!hasSelection}
        title="Delete Selected"
      >
        Delete
      </Button>
    </Paper>
  );
}
