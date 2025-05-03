import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function Particle() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    console.log("init");
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (): Promise<void> => {
    return Promise.resolve();
  };

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          style={{
            zIndex: -1,
          }}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push", //pause pull trail emitter bubble
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                push: {
                  quantity: 2,
                },
                repulse: {
                  distance: 170,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#d9ff0f",
              },
              links: {
                color: "#38b000",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1.2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                },
                value: 200,
              },
              opacity: {
                value: 0.3,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </>
  );
}
