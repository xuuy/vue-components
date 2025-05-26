// asset-chat/src/utils/ChartRenderer.ts

interface ChartConfig {
  lineColor: string;
  lineWidth: number;
  shadowBlur: number;
  shadowColor: string;
  dotColor: string;
  dotSize: number;
  dotSpacingX: number;
  dotSpacingY: number;
  padding: number;
}

interface Point {
  x: number;
  y: number;
}

interface ChartDimensions {
  width: number;
  height: number;
  padding: number;
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

export function drawChartLine(
  ctx: CanvasRenderingContext2D,
  data: number[],
  config: ChartConfig,
  chartDimensions: ChartDimensions
): Point[] {
  const { width, height, padding } = chartDimensions;
  const linePoints: Point[] = [];

  if (data.length === 0) {
    return linePoints;
  }

  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue === 0 ? 1 : maxValue - minValue; // Avoid division by zero

  ctx.beginPath();
  ctx.strokeStyle = config.lineColor;
  ctx.lineWidth = config.lineWidth;
  ctx.shadowBlur = config.shadowBlur;
  ctx.shadowColor = config.shadowColor;

  for (let i = 0; i < data.length; i++) {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((data[i] - minValue) / range) * (height - 2 * padding);
    linePoints.push({ x, y });

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevPoint = linePoints[i - 1];
      const xc = (prevPoint.x + x) / 2;
      const yc = (prevPoint.y + y) / 2;
      ctx.quadraticCurveTo(prevPoint.x, prevPoint.y, xc, yc);
    }
  }
  // For the last segment
  if (data.length > 1) {
     const lastPoint = linePoints[data.length -1];
     const secondLastPoint = linePoints[data.length -2];
     ctx.quadraticCurveTo(secondLastPoint.x, secondLastPoint.y, lastPoint.x, lastPoint.y);
  } else if (data.length === 1) {
    // Draw a small circle if only one data point
    ctx.arc(linePoints[0].x, linePoints[0].y, config.lineWidth / 2, 0, 2 * Math.PI);
    ctx.fillStyle = config.lineColor; // Use line color for the dot
    ctx.fill();
  }


  ctx.stroke();
  ctx.shadowBlur = 0; // Reset shadow for other drawings

  return linePoints;
}

export function drawDotFill(
  ctx: CanvasRenderingContext2D,
  linePoints: Point[],
  config: ChartConfig,
  chartDimensions: ChartDimensions,
  canvasHeight: number // Full canvas height for correct y-positioning
): void {
  if (linePoints.length < 2) return; // Need at least two points to form a line segment

  const { width, padding } = chartDimensions; // Use chartDimension's width and padding
  const { dotColor, dotSize, dotSpacingX, dotSpacingY } = config;

  ctx.fillStyle = dotColor;

  // Create a function to get the line's y value at a given x
  // This function interpolates between the points of the linePoints array
  const getLineY = (xPos: number): number => {
    // Find the two points the xPos is between
    let p1: Point | null = null;
    let p2: Point | null = null;

    if (xPos <= linePoints[0].x) {
        return linePoints[0].y;
    }
    if (xPos >= linePoints[linePoints.length - 1].x) {
        return linePoints[linePoints.length - 1].y;
    }

    for (let i = 0; i < linePoints.length - 1; i++) {
      if (xPos >= linePoints[i].x && xPos <= linePoints[i + 1].x) {
        p1 = linePoints[i];
        p2 = linePoints[i + 1];
        break;
      }
    }

    if (p1 && p2) {
      // Linear interpolation
      const t = (xPos - p1.x) / (p2.x - p1.x);
      if (!isFinite(t)) return p1.y; // Avoid NaN if p1.x === p2.x
      return p1.y + t * (p2.y - p1.y);
    }
    return canvasHeight; // Default to bottom if something goes wrong
  };


  for (let x = padding; x < width - padding; x += dotSpacingX) {
    for (let y = padding; y < canvasHeight - padding; y += dotSpacingY) {
      const lineYatX = getLineY(x);
      if (y > lineYatX && y < canvasHeight - padding) { // Draw dot if it's below the line and above the bottom padding
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}


export function render(
  canvas: HTMLCanvasElement,
  data: number[],
  config: ChartConfig
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context");
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Scale context for HiDPI displays
  // ctx.scale(dpr, dpr); // This should be done when setting canvas width/height, not here

  clearCanvas(ctx, canvasWidth, canvasHeight);

  const chartDimensions: ChartDimensions = {
    width: canvasWidth / dpr, // Use logical width/height for chart calculations
    height: canvasHeight / dpr,
    padding: config.padding,
  };

  // Adjust for DPR in drawing functions if needed, or ensure canvas is prescaled
  // For now, assuming drawing functions expect logical coordinates

  const linePoints = drawChartLine(ctx, data, config, chartDimensions);

  if (linePoints.length > 0) {
    drawDotFill(ctx, linePoints, config, chartDimensions, chartDimensions.height);
  }
}
