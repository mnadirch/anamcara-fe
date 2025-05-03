import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null, // Initially null to prevent SSR issues
    height: null,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  

  return windowSize;
}

export default useWindowSize;
