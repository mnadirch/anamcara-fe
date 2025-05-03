import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import "./style.css";

interface HeroProps {
  audio?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ audio }) => {
  const [welcomeText] = useState<string>("WELCOME");
  const [humanText] = useState<string>("HUMAN  ...");
  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));
  const hoverRadius = 10;
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, areaId: string) => {
    const area = document.getElementById(areaId);
    if (area) {
      const rect = area.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      stars.forEach((star, i) => {
        const distance = Math.sqrt(
          Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2)
        );
        const nearbyStar = document.getElementById(`${areaId}-star-${i}`);
        if (nearbyStar) {
          nearbyStar.style.backgroundColor = distance <= hoverRadius ? "white" : "#00000000";
        }
      });
    }
  };

  const handleMouseLeave = (areaId: string) => {
    stars.forEach((_, i) => {
      const starElement = document.getElementById(`${areaId}-star-${i}`);
      if (starElement) {
        starElement.style.backgroundColor = "#00000000";
      }
    });
  };
  return (
    <div className="hero-container">
      {/* Background */}
      <div className="hero-background"></div>
      {/* Main Content */}
      <div className="hero-content">
        {/* WELCOME Block */}
        <motion.div
          className="text-block welcome-block"
          id="welcome-area"
          onMouseMove={(e) => handleMouseMove(e, "welcome-area")}
          onMouseLeave={() => handleMouseLeave("welcome-area")}>
          {/* Stars */}
          <div className="stars-layer">
            {stars.map((star, index) => (
              <motion.div
                key={`welcome-star-${index}`}
                className="star"
                style={{ top: `${star.y}%`, left: `${star.x}%` }}
                id={`welcome-area-star-${index}`}
              />
            ))}
          </div>
          {/* WELCOME Text */}
          <motion.h1
          className="text">
            {welcomeText.split("").map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: (index) => ({
                  opacity: 1,
                  transition: { delay: index * 0.2 },
                }),
              }}>
              {letter}
            </motion.span>
          ))}
          </motion.h1>
        </motion.div>
        {/* HUMAN Block */}
        <motion.div
          className="text-block human-block"
          id="human-area"
          onMouseMove={(e) => handleMouseMove(e, "human-area")}
          onMouseLeave={() => handleMouseLeave("human-area")}
          //style={{right:"3%"}}
        >
          {/* Stars */}
          <div className="stars-layer">
            {stars.map((star, index) => (
              <motion.div
                key={`human-star-${index}`}
                className="star"
                style={{ top: `${star.y}%`, left: `${star.x}%` }}
                id={`human-area-star-${index}`}
              />
            ))}
          </div>
          {audio}
          {/* HUMAN Text */}
          <motion.h1
            className="text">
            {humanText.split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: (index) => ({
                    opacity: 1,
                    transition: { delay: 1.5 + index * 0.2 },
                  }),
                }}>
                {letter}
              </motion.span>
            ))}         
             </motion.h1>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
