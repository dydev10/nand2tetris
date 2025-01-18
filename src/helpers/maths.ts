export const distanceToPoint = (x: number, y: number, targetX: number, targetY: number): number =>{
  return Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
}

export const distanceToLine = (x: number, y: number, fromX: number, fromY: number, toX: number, toY: number): number =>{
  return Math.abs((toY - fromY) * x - (toX - fromX) * y + toX * fromY - toY * fromX)
    / Math.sqrt((toY - fromY) ** 2 + (toX - fromX) ** 2);
}
