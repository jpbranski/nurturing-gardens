"use client";

import { useRef, useState } from "react";
import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from "react-konva";
import type Konva from "konva";

export interface Shape {
  id: string;
  type: "rect" | "circle" | "line" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill?: string;
  stroke?: string;
  text?: string;
  fontSize?: number;
}

interface CanvasStageProps {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onShapeChange: (shapes: Shape[]) => void;
}

export default function CanvasStage({
  shapes,
  selectedId,
  onSelect,
  onShapeChange,
}: CanvasStageProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const handleDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === id
        ? { ...shape, x: e.target.x(), y: e.target.y() }
        : shape
    );
    onShapeChange(updatedShapes);
  };

  const handleTransformEnd = (id: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return {
          ...shape,
          x: node.x(),
          y: node.y(),
          width: shape.width ? Math.max(5, node.width() * scaleX) : shape.width,
          height: shape.height ? Math.max(5, node.height() * scaleY) : shape.height,
          radius: shape.radius ? Math.max(5, shape.radius * scaleX) : shape.radius,
        };
      }
      return shape;
    });
    onShapeChange(updatedShapes);
  };

  const renderShape = (shape: Shape) => {
    const shapeProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      draggable: true,
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => handleDragEnd(shape.id, e),
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => handleTransformEnd(shape.id, e),
      onClick: () => onSelect(shape.id),
      onTap: () => onSelect(shape.id),
    };

    switch (shape.type) {
      case "rect":
        return (
          <Rect
            {...shapeProps}
            width={shape.width || 100}
            height={shape.height || 100}
            fill={shape.fill || "#00D2FF"}
            stroke={shape.stroke || "#000"}
            strokeWidth={2}
          />
        );
      case "circle":
        return (
          <Circle
            {...shapeProps}
            radius={shape.radius || 50}
            fill={shape.fill || "#FF6B6B"}
            stroke={shape.stroke || "#000"}
            strokeWidth={2}
          />
        );
      case "line":
        return (
          <Line
            {...shapeProps}
            points={shape.points || [0, 0, 100, 100]}
            stroke={shape.stroke || "#000"}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        );
      case "text":
        return (
          <Text
            {...shapeProps}
            text={shape.text || "Text"}
            fontSize={shape.fontSize || 24}
            fill={shape.fill || "#000"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="canvas-container" style={{ border: "1px solid #ccc", width: "100%", height: "600px" }}>
      <Stage
        ref={stageRef}
        width={800}
        height={600}
        onMouseDown={(e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty) {
            onSelect(null);
          }
        }}
      >
        <Layer>
          {shapes.map(renderShape)}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
