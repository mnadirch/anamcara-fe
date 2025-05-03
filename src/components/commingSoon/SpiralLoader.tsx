import React, { useEffect, useRef } from "react";

const ResponsiveClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate the size to use for the clock.
  // Uses the container's width or 80% of the viewport width, whichever is smaller.
  const getActualSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const viewportWidth = window.innerWidth;
      return Math.min(containerWidth, viewportWidth * 0.4);
    }
    return 200;
  };

  // Calculate line width relative to the actual size.
  const getActualLineWidth = (actualSize: number) => {
    return actualSize * 0.15;
  };

  // Draw the clock face (outer circle, tick marks, decorative rectangles).
  const drawClockFace = (ctx: CanvasRenderingContext2D, actualSize: number) => {
    // Clear any previous drawing.
    ctx.clearRect(0, 0, actualSize, actualSize);

    // Draw outer circle (leaving a 10px margin from the edge).
    ctx.beginPath();
    ctx.arc(actualSize / 2, actualSize / 2, actualSize / 2 - 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#D9D0C3";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw tick marks (12 hour marks around the circle).
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const innerRadius = actualSize / 2 - 15;
      const outerRadius = i % 3 === 0 ? actualSize / 2 - 5 : actualSize / 2 - 10;

      ctx.beginPath();
      ctx.moveTo(
        actualSize / 2 + innerRadius * Math.cos(angle),
        actualSize / 2 + innerRadius * Math.sin(angle)
      );
      ctx.lineTo(
        actualSize / 2 + outerRadius * Math.cos(angle),
        actualSize / 2 + outerRadius * Math.sin(angle)
      );
      ctx.strokeStyle = "#D9D0C3";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Scale decorative elements based on a base size of 200.
    const scale = actualSize / 200;

    // For the outer circle, the top is at y = 10 (since radius = actualSize/2 - 10).
    // We want a decorative rectangle whose bottom edge aligns with y = 10.
    const rectHeight = 10 * scale;
    const rectY = 10 - rectHeight; // So its bottom is at y = 10

    ctx.fillStyle = "#D9D0C3";
    // Main rectangle (centered horizontally)
    ctx.fillRect(actualSize / 2 - 25 * scale, rectY, 50 * scale, rectHeight);

    // Additional decorative rectangles (positioned on the left and right)
    ctx.fillRect(actualSize / 2 - 50 * scale, 5 * scale, 15 * scale, 8 * scale);
    ctx.fillRect(actualSize / 2 + 35 * scale, 5 * scale, 15 * scale, 8 * scale);
  };

  // Draw a curved line that rotates around the center.
  const drawCurvedLine = (
    ctx: CanvasRenderingContext2D,
    rotation: number,
    actualSize: number,
    primaryColor: string,
    secondaryColor: string
  ) => {
    const actualLineWidth = getActualLineWidth(actualSize);
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const maxRadius = actualSize / 2 - 20;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Create a gradient for the curved line.
    const gradient = ctx.createLinearGradient(-maxRadius, 0, maxRadius, 0);
    gradient.addColorStop(0, `${primaryColor}80`); // Semi-transparent start.
    gradient.addColorStop(1, secondaryColor);

    // Draw an arc (curved line) that doesn’t start at the center.
    ctx.beginPath();
    const arcRadius = maxRadius * 0.6; // Adjust arc radius as needed.
    const arcStartAngle = Math.PI * 0.5; // Start at the bottom.
    const arcEndAngle = Math.PI * 1.8;   // End almost after a full circle.
    ctx.arc(0, 0, arcRadius, arcStartAngle, arcEndAngle, false);
    ctx.lineWidth = actualLineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = gradient;

    // Add a subtle glow via shadow.
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 10 * (actualSize / 200);
    ctx.stroke();

    // Reset shadow for subsequent drawings.
    ctx.shadowBlur = 0;

    // Draw a small white center circle.
    const centerCircleRadius = 10 * (actualSize / 200);
    ctx.beginPath();
    ctx.arc(0, 0, centerCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  };

  // Draw the needle that rotates separately.
  const drawNeedle = (
    ctx: CanvasRenderingContext2D,
    needleRotation: number,
    actualSize: number,
    secondaryColor: string
  ) => {
    const spiralRadius = actualSize / 2 - 20;
    ctx.save();
    ctx.translate(actualSize / 2, actualSize / 2);
    ctx.rotate(needleRotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(spiralRadius - 20, 0);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2 * (actualSize / 200);
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Define colors and animation durations.
    const primaryColor = "#c4f017";
    const secondaryColor = "#c4f017";
    const lineDuration = 2000; // Duration for the curved line rotation (ms)
    const needleDuration = 50000; // Duration for the needle rotation (ms)

    let animationFrame: number;
    let startTime: number | null = null;

    // Handle canvas resizing and responsive adjustments.
    const handleResize = () => {
      const actualSize = getActualSize();
      const dpr = window.devicePixelRatio || 1;

      // Set canvas dimensions with device pixel ratio for sharpness.
      canvas.width = actualSize * dpr;
      canvas.height = actualSize * dpr;
      canvas.style.width = `${actualSize}px`;
      canvas.style.height = `${actualSize}px`;

      // Update container dimensions.
      if (containerRef.current) {
        containerRef.current.style.width = `${actualSize}px`;
        containerRef.current.style.height = `${actualSize}px`;
      }

      // Reset transformation and scale context for crisp drawing.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Draw the static clock face.
      drawClockFace(ctx, actualSize);
    };

    // Animation function for the moving parts (curved line and needle).
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate rotation values based on elapsed time.
      const lineRotation =
        ((elapsed % lineDuration) / lineDuration) * Math.PI * 2;
      const needleRotation =
        ((elapsed % needleDuration) / needleDuration) * Math.PI * 2;

      const actualSize = getActualSize();

      // Clear the canvas and redraw everything.
      ctx.clearRect(0, 0, actualSize, actualSize);
      drawClockFace(ctx, actualSize);
      drawCurvedLine(ctx, lineRotation, actualSize, primaryColor, secondaryColor);
      drawNeedle(ctx, needleRotation, actualSize, secondaryColor);

      animationFrame = requestAnimationFrame(animate);
    };

    // Initial drawing and animation setup.
    handleResize();
    animationFrame = requestAnimationFrame(animate);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default ResponsiveClock;
