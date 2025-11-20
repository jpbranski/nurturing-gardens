"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Container, Grid, Typography, Box } from "@mui/material";
import Toolbar from "@/components/tool/Toolbar";
import LayersPanel from "@/components/tool/LayersPanel";
import PropertiesPanel from "@/components/tool/PropertiesPanel";
import type { Shape } from "@/components/tool/CanvasStage";

// Dynamically import CanvasStage with SSR disabled
const CanvasStage = dynamic(() => import("@/components/tool/CanvasStage"), {
  ssr: false,
});

export default function ToolPage() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddShape = (type: "rect" | "circle" | "line" | "text") => {
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      x: 100 + shapes.length * 20,
      y: 100 + shapes.length * 20,
      ...(type === "rect" && { width: 100, height: 100, fill: "#00D2FF" }),
      ...(type === "circle" && { radius: 50, fill: "#FF6B6B" }),
      ...(type === "line" && { points: [0, 0, 100, 100], stroke: "#000" }),
      ...(type === "text" && { text: "Text", fontSize: 24, fill: "#000" }),
    };
    setShapes([...shapes, newShape]);
    setSelectedId(newShape.id);
  };

  const handleDelete = () => {
    if (selectedId) {
      setShapes(shapes.filter((shape) => shape.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleShapeUpdate = (updates: Partial<Shape>) => {
    if (!selectedId) return;
    setShapes(
      shapes.map((shape) =>
        shape.id === selectedId ? { ...shape, ...updates } : shape
      )
    );
  };

  const selectedShape = shapes.find((shape) => shape.id === selectedId) || null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Canvas Design Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create and edit shapes on the canvas. Use the toolbar to add shapes, then drag, resize, and customize them.
      </Typography>

      <Toolbar
        onAddShape={handleAddShape}
        onDelete={handleDelete}
        hasSelection={selectedId !== null}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <CanvasStage
            shapes={shapes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onShapeChange={setShapes}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <LayersPanel
              shapes={shapes}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <PropertiesPanel
              selectedShape={selectedShape}
              onUpdate={handleShapeUpdate}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
