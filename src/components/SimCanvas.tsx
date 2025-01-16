import React from "react";
import useCanvasShapes from "../hooks/useCanvasShapes";

const SimCanvas: React.FC = () => {
  const [boxes, setBoxes] = React.useState([
    { x: 100, y: 100, width: 50, height: 75 },
    { x: 250, y: 150, width: 80, height: 80 },
    { x: 200, y: 300, width: 120, height: 80 },
  ]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggingBoxIndex, setDraggingBoxIndex] = React.useState<number | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  // Set the canvas context
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext('2d'));
    }
  }, []);

  // Use the custom hook for canvas rendering
  useCanvasShapes(ctx, boxes);

  // Handle mouse events directly on the canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the mouse click is inside any rectangle
    const clickedBoxId = boxes.findIndex(
      (box) =>
        mouseX >= box.x &&
        mouseX <= box.x + box.width &&
        mouseY >= box.y &&
        mouseY <= box.y + box.height
    );

    if (clickedBoxId !== -1) {
      setIsDragging(true);
      setDraggingBoxIndex(clickedBoxId);
    }
  };

  // Handle dragging the rectangle
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || draggingBoxIndex === null || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Update the box's position as the mouse moves
    setBoxes((prevBoxes) =>
      prevBoxes.map((b, index) =>
        index === draggingBoxIndex
          ? { ...b, x: mouseX - b.width / 2, y: mouseY - b.height / 2 }
          : b
      )
    );
  };

  // Stop dragging
  const stopDragging = () => {
    setIsDragging(false);
    setDraggingBoxIndex(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      />
    </div>
  );
};

export default SimCanvas;
