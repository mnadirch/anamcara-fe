import { useRef, useState } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";

extend({
  PlaneGeometry: THREE.PlaneGeometry,
  ShaderMaterial: THREE.ShaderMaterial,
  Mesh: THREE.Mesh,
});

// Custom JSX Intrinsic Elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: { [key: string]: any };
      planeGeometry: {
        args?: ConstructorParameters<typeof THREE.PlaneGeometry>;
      };
      shaderMaterial: {
        args?: ConstructorParameters<typeof THREE.ShaderMaterial>;
        [key: string]: any;
      };
    }
  }
}

export const FogShader: Omit<THREE.ShaderMaterialParameters, "extensions"> = {
  uniforms: {
    uTime: { value: 0.0 },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, 250), // Limit height to 200px
    },
    uAlpha: { value: 1 },
    uShift: { value: 1.6 },
    uSpeed: { value: new THREE.Vector2(0.35, 0.2) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;

    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uAlpha;
    uniform float uShift;
    uniform vec2 uSpeed;

    varying vec2 vUv;

    float rand(vec2 n) {
      return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 n) {
      const vec2 d = vec2(0.0, 1.0);
      vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(
        mix(rand(b), rand(b + d.yx), f.x),
        mix(rand(b + d.xy), rand(b + d.yy), f.x),
        f.y
      );
    }

    float fbm(vec2 n) {
      float total = 0.0, amplitude = 1.0;
      for (int i = 0; i < 4; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.5;
      }
      return total;
    }

    void main() {
      // Dark green color palette
      const vec3 c1 = vec3(0.0, 250.0 / 255.0, 0.0);  // Dark green
      const vec3 c2 = vec3(0.0, 102.0 / 255.0, 0.0); // Medium green
      const vec3 c3 = vec3(0.1, 0.2, 0.1);           // Dark greenish
      const vec3 c4 = vec3(0.0, 153.0 / 255.0, 0.0); // Bright green
      const vec3 c5 = vec3(0.2, 0.4, 0.2);           // Subtle dark green
      const vec3 c6 = vec3(0.0, 0.8, 0.0);           // Light green

      vec2 p = gl_FragCoord.xy * 4.0 / uResolution.x;
      float q = fbm(p - uTime * 0.05);
      vec2 r = vec2(
        fbm(p + q + uTime * uSpeed.x - p.x - p.y),
        fbm(p + q - uTime * uSpeed.y)
      );
      vec3 c =
        mix(c1, c2, fbm(p + r)) +
        mix(c3, c4, r.x) - 
        mix(c5, c6, r.y);
      float grad = gl_FragCoord.y / uResolution.y;
      gl_FragColor = vec4(c * cos(uShift * gl_FragCoord.y / uResolution.y), 1.0);
      gl_FragColor.xyz *= 2.0 - grad;
    }
  `,
};

const Fluid: React.FC = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const [viewportHeight] = useState(window.innerHeight);

  useFrame(({ clock }: { clock: THREE.Clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, -1, 0]} scale={[15, 1, 1]}>
      <planeGeometry
        args={[window.innerWidth / 100, viewportHeight / 6 / 10]}
      />
      <shaderMaterial ref={shaderRef} attach="material" {...FogShader} />
    </mesh>
  );
};

export default Fluid;
