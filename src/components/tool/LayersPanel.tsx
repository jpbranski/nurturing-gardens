"use client";

import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Shape } from "./CanvasStage";

interface LayersPanelProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function LayersPanel({ shapes, selectedId, onSelect }: LayersPanelProps) {
  return (
    <Paper elevation={2} sx={{ p: 2, height: "100%", minHeight: 300 }}>
      <Typography variant="h6" gutterBottom>
        Layers
      </Typography>
      <List>
        {shapes.length === 0 ? (
          <ListItem>
            <ListItemText
              secondary="No shapes yet. Use the toolbar to add shapes."
            />
          </ListItem>
        ) : (
          shapes.map((shape, index) => (
            <ListItem key={shape.id} disablePadding>
              <ListItemButton
                selected={shape.id === selectedId}
                onClick={() => onSelect(shape.id)}
              >
                <ListItemText
                  primary={`${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)} ${index + 1}`}
                  secondary={`x: ${Math.round(shape.x)}, y: ${Math.round(shape.y)}`}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
}
