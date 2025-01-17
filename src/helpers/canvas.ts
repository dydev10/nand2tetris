import { CONNECTION_THICKNESS, NODE_BORDER_THICKNESS } from "./constants";

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string = 'black',
  thickness: number = CONNECTION_THICKNESS,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string = 'black',
) => {
  ctx.fillStyle = color; // Active: green, Inactive: gray
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
};

export const drawBox = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = 'gray',
  text: string | null | undefined = null,
  borderThickness: number | null | undefined = null,
) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);

  if (text?.length) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, y + height / 2);
  }

  if (borderThickness) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = NODE_BORDER_THICKNESS;
    ctx.strokeRect(x, y, width, height);
  }
};
