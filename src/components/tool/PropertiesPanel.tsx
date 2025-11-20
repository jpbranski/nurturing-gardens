"use client";

import {
  Paper,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { Shape } from "./CanvasStage";

interface PropertiesPanelProps {
  selectedShape: Shape | null;
  onUpdate: (updates: Partial<Shape>) => void;
}

export default function PropertiesPanel({
  selectedShape,
  onUpdate,
}: PropertiesPanelProps) {
  if (!selectedShape) {
    return (
      <Paper elevation={2} sx={{ p: 2, height: "100%", minHeight: 300 }}>
        <Typography variant="h6" gutterBottom>
          Properties
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a shape to edit its properties
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, height: "100%", minHeight: 300 }}>
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
        <TextField
          label="X Position"
          type="number"
          value={Math.round(selectedShape.x)}
          onChange={(e) => onUpdate({ x: Number(e.target.value) })}
          size="small"
          fullWidth
        />
        <TextField
          label="Y Position"
          type="number"
          value={Math.round(selectedShape.y)}
          onChange={(e) => onUpdate({ y: Number(e.target.value) })}
          size="small"
          fullWidth
        />

        {selectedShape.type === "rect" && (
          <>
            <TextField
              label="Width"
              type="number"
              value={selectedShape.width || 100}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              size="small"
              fullWidth
            />
            <TextField
              label="Height"
              type="number"
              value={selectedShape.height || 100}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              size="small"
              fullWidth
            />
          </>
        )}

        {selectedShape.type === "circle" && (
          <TextField
            label="Radius"
            type="number"
            value={selectedShape.radius || 50}
            onChange={(e) => onUpdate({ radius: Number(e.target.value) })}
            size="small"
            fullWidth
          />
        )}

        {selectedShape.type === "text" && (
          <>
            <TextField
              label="Text"
              value={selectedShape.text || "Text"}
              onChange={(e) => onUpdate({ text: e.target.value })}
              size="small"
              fullWidth
            />
            <TextField
              label="Font Size"
              type="number"
              value={selectedShape.fontSize || 24}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              size="small"
              fullWidth
            />
          </>
        )}

        <TextField
          label="Fill Color"
          type="color"
          value={selectedShape.fill || "#00D2FF"}
          onChange={(e) => onUpdate({ fill: e.target.value })}
          size="small"
          fullWidth
        />

        {selectedShape.type !== "text" && (
          <TextField
            label="Stroke Color"
            type="color"
            value={selectedShape.stroke || "#000000"}
            onChange={(e) => onUpdate({ stroke: e.target.value })}
            size="small"
            fullWidth
          />
        )}
      </Box>
    </Paper>
  );
}
