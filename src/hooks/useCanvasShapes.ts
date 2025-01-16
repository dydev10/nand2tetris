import { useEffect } from "react";

// Custom hook to handle canvas rendering logic
function useCanvasShapes(
  ctx: CanvasRenderingContext2D | null,
  boxes: { x: number; y: number; width: number; height: number }[]
) {
  useEffect(() => {
    if (!ctx) return;

    // Set the background color to light gray
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw each box in the boxes array
    boxes.forEach((box) => {
      ctx.fillStyle = 'red';
      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  }, [ctx, boxes]); // Redraw whenever the boxes array changes
}

export default useCanvasShapes;
