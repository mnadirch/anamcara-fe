import { useState, useEffect, useRef } from "react";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";
import styles from "./fogAnimation.module.css";
const FogAnimation = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!(window as any).THREE) {
      (window as any).THREE = THREE;
    }

    if (!vantaEffect) {
      const effect = FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x0,
        midtoneColor: 0x1f9d49,
        lowlightColor: 0x17aa27,
        baseColor: 0x0,
        THREE: (window as any).THREE,
      });

      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={vantaRef} className={styles.vantaBackground}></div>;
};

export default FogAnimation;
