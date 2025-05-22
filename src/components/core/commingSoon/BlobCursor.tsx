import { useTrail, animated } from "@react-spring/web";
import { useRef, useEffect, useCallback } from "react";
import "./BlobCursor.css";

const fast = { tension: 1200, friction: 40 };
const slow = { mass: 10, tension: 200, friction: 50 };
const trans = (x: number, y: number) => `translate3d(${x}px,${y}px,0) translate3d(-50%,-50%,0)`;

export default function BlobCursor({
  blobType = "circle",
  fillColor = "#d9ff0f",
}) {
  const [trail, api] = useTrail(3, (i) => ({
    xy: [0, 0],
    config: i === 0 ? fast : slow,
  }));

  const ref = useRef<HTMLDivElement | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  const getRandomPosition = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    return [x, y];
  };

  const moveRandomly = useCallback(() => {
    const [x, y] = getRandomPosition();
    api.start({ xy: [x, y] });
  }, [api]);

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (idleTimeoutRef.current !== null) {
      clearTimeout(idleTimeoutRef.current);
    }

    const x = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const y = "clientY" in e ? e.clientY : e.touches[0].clientY;
    api.start({ xy: [x, y] });

    idleTimeoutRef.current = window.setTimeout(moveRandomly, 2000);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);

    const initialRandomMove = setInterval(moveRandomly, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      clearInterval(initialRandomMove);
      if (idleTimeoutRef.current !== null) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [moveRandomly]);

  return (
    <div>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="blob">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10"
          />
        </filter>
      </svg>
      <div ref={ref} className="main">
        {trail.map((props, index) => (
          <animated.div
            key={index}
            style={{
              transform: props.xy.to(trans),
              borderRadius: blobType === "circle" ? "50%" : "0%",
              backgroundColor: fillColor,
            }}
          />
        ))}
      </div>
    </div>
  );
}
