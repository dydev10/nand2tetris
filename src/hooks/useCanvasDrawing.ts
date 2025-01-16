import { useEffect, useState } from "react";

// Custom hook to handle canvas drawing logic, including dragging the rectangle
function useCanvasDrawing(ctx: CanvasRenderingContext2D | null) {
  const [rectPosition, setRectPosition] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!ctx) return;

    // Set the background color to light gray
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the rectangle with a white outline
    ctx.fillStyle = 'red';
    ctx.fillRect(rectPosition.x, rectPosition.y, 200, 150);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(rectPosition.x, rectPosition.y, 200, 150);
  }, [ctx, rectPosition]); // Redraw whenever the rect position changes

  // Logic for dragging the rectangle
  const startDragging = (e: React.MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if the mouse click is inside the rectangle
    if (
      mouseX >= rectPosition.x &&
      mouseX <= rectPosition.x + 200 &&
      mouseY >= rectPosition.y &&
      mouseY <= rectPosition.y + 150
    ) {
      setIsDragging(true);
    }
  };

  const drag = (e: React.MouseEvent) => {
    if (!isDragging || !ctx) return;

    const canvas = e.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Move the rectangle as the mouse moves
    setRectPosition({ x: mouseX - 100, y: mouseY - 75 }); // Adjust the position relative to the top-left corner
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  // Return functions for handling the mouse events
  return { startDragging, drag, stopDragging };
}

export default useCanvasDrawing;
