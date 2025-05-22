import React, { useEffect, useRef } from "react";

const ResponsiveClock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getActualSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const viewportWidth = window.innerWidth;
      return Math.min(containerWidth, viewportWidth * 0.4);
    }
    return 200;
  };

  const getActualLineWidth = (actualSize: number) => {
    return actualSize * 0.15;
  };

  const drawClockFace = (ctx: CanvasRenderingContext2D, actualSize: number) => {
    ctx.clearRect(0, 0, actualSize, actualSize);
    ctx.beginPath();
    ctx.arc(actualSize / 2, actualSize / 2, actualSize / 2 - 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#D9D0C3";
    ctx.lineWidth = 1;
    ctx.stroke();

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

    const gradient = ctx.createLinearGradient(-maxRadius, 0, maxRadius, 0);
    gradient.addColorStop(0, `${primaryColor}80`);
    gradient.addColorStop(1, secondaryColor);

    ctx.beginPath();
    const arcRadius = maxRadius * 0.6;
    const arcStartAngle = Math.PI * 0.5;
    const arcEndAngle = Math.PI * 1.8;
    ctx.arc(0, 0, arcRadius, arcStartAngle, arcEndAngle, false);
    ctx.lineWidth = actualLineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = gradient;
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 10 * (actualSize / 200);
    ctx.stroke();
    ctx.shadowBlur = 0;
    const centerCircleRadius = 10 * (actualSize / 200);
    ctx.beginPath();
    ctx.arc(0, 0, centerCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  };

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

    const primaryColor = "#c4f017";
    const secondaryColor = "#c4f017";
    const lineDuration = 2000;
    const needleDuration = 50000;

    let animationFrame: number;
    let startTime: number | null = null;

    const handleResize = () => {
      const actualSize = getActualSize();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = actualSize * dpr;
      canvas.height = actualSize * dpr;
      canvas.style.width = `${actualSize}px`;
      canvas.style.height = `${actualSize}px`;

      if (containerRef.current) {
        containerRef.current.style.width = `${actualSize}px`;
        containerRef.current.style.height = `${actualSize}px`;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      drawClockFace(ctx, actualSize);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const lineRotation =
        ((elapsed % lineDuration) / lineDuration) * Math.PI * 2;
      const needleRotation =
        ((elapsed % needleDuration) / needleDuration) * Math.PI * 2;

      const actualSize = getActualSize();
      ctx.clearRect(0, 0, actualSize, actualSize);
      drawClockFace(ctx, actualSize);
      drawCurvedLine(ctx, lineRotation, actualSize, primaryColor, secondaryColor);
      drawNeedle(ctx, needleRotation, actualSize, secondaryColor);

      animationFrame = requestAnimationFrame(animate);
    };

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
