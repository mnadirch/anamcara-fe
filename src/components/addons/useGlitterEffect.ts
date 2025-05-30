"use client";
import { useEffect } from "react";
import gsap from "gsap";

export const useGlitterEffect = (
  buttonRef: React.RefObject<HTMLButtonElement>,
  glitterRef: React.RefObject<HTMLDivElement>,
  glitterColors: string[] = ["#00FFFF", "#00CCFF", "#66FFFF", "#33CCFF"],
  glowColor: string = "rgba(0, 255, 255, 0.3)"
) => {
  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    let glitterTimeout: NodeJS.Timeout | null = null;
    let isHovering = false;

    const createGlitter = () => {
      if (!glitterRef.current) return;
      if (!isHovering) return; // Stop creating if not hovering

      for (let i = 0; i < 15; i++) {
        const glitter = document.createElement("div");
        glitter.style.position = "absolute";
        glitter.style.width = "3px";
        glitter.style.height = "3px";
        glitter.style.backgroundColor =
          glitterColors[Math.floor(Math.random() * glitterColors.length)];
        glitter.style.borderRadius = "50%";
        glitter.style.pointerEvents = "none";
        glitter.style.opacity = "0";
        glitter.style.filter = "blur(0.5px)";

        const startX = Math.random() * button.offsetWidth;
        const startY = Math.random() * button.offsetHeight;

        glitter.style.left = `${startX}px`;
        glitter.style.top = `${startY}px`;

        glitterRef.current.appendChild(glitter);

        gsap.to(glitter, {
          x: (Math.random() - 0.5) * 40,
          y: (Math.random() - 0.5) * 40,
          opacity: 0.8,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(glitter, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => glitter.remove(),
            });
          },
        });
      }

      glitterTimeout = setTimeout(createGlitter, 100);
    };

    const handleMouseEnter = () => {
      isHovering = true;
      glitterRef.current?.replaceChildren();
      createGlitter();
      gsap.to(button, {
        boxShadow: `0 0 30px ${glowColor}`,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      // Stop creating new glitter after 500ms delay to allow existing glitter to fade out smoothly
      if (glitterTimeout) clearTimeout(glitterTimeout);
      glitterTimeout = setTimeout(() => {
        glitterRef.current?.replaceChildren();
      }, 500);
      gsap.to(button, {
        boxShadow: `0 0 20px ${glowColor}`,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    gsap.set(button, { boxShadow: `0 0 20px ${glowColor}` });

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (glitterTimeout) clearTimeout(glitterTimeout);
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [buttonRef, glitterRef, glitterColors, glowColor]);
};
