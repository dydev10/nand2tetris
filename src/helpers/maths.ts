export const distanceToPoint = (x: number, y: number, targetX: number, targetY: number): number =>{
  return Math.sqrt((x - targetX) ** 2 + (y - targetY) ** 2);
}

export const distanceToLine = (x: number, y: number, fromX: number, fromY: number, toX: number, toY: number): number =>{
  return Math.abs((toY - fromY) * x - (toX - fromX) * y + toX * fromY - toY * fromX)
    / Math.sqrt((toY - fromY) ** 2 + (toX - fromX) ** 2);
}

export const generateBinaryPermutations = (n: number): number[][] => {
  const result: number[][] = [];
  
  function backtrack(current: number[], length: number) {
      if (length === n) {
          result.push([...current]); // Save a copy of the current array
          return;
      }
      
      // Add 0 and recurse
      current.push(0);
      backtrack(current, length + 1);
      current.pop();
      
      // Add 1 and recurse
      current.push(1);
      backtrack(current, length + 1);
      current.pop();
  }
  
  backtrack([], 0); // Start the recursion
  return result;
};
