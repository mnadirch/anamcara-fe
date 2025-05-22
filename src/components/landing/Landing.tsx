import React, { MouseEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface LandingProps {
  onProceed: () => void;
  onSkipToMain: () => void;
}

const Landing: React.FC<LandingProps> = ({ onProceed, onSkipToMain }) => {
  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  const hoverRadius = 10; 

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const landingArea = document.getElementById("landing-area");
    if (landingArea) {
      const rect = landingArea.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      stars.forEach((star, i) => {
        const distance = Math.sqrt(
          Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2)
        );
        const starElement = document.getElementById(`landing-star-${i}`);
        if (starElement) {
          if (distance <= hoverRadius) {
            starElement.style.backgroundColor = "white"; // Highlight star
          } else {
            starElement.style.backgroundColor = "black"; // Reset to black
          }
        }
      });
    }
  };

  return (
    <motion.div
    id="landing-area"
    className=" landing relative w-full h-auto flex flex-col justify-center items-start pl-10 overflow-hidden"
    onMouseMove={handleMouseMove}
  >
    {/* Stars Layer */}
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={index}
          id={`landing-star-${index}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            backgroundColor: "black", // Initial color
            transition: "background-color 0.3s ease", // Smooth transition
          }}
        ></div>
      ))}
    </div>

    {/* Content Section */}
    <div
      className=" relative z-10 space-y-6 lg:right-[10%]"
      style={{
        right: "1%",
      }}
    >
      {/* Heading Section */}
      <h1 className=" landing-title text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-left">
        SHARE YOUR{" "} 
        <span
          style={{
            color: "#a0ff06",
          }}
        >
          THOUGHTS
        </span>
      </h1>
      <h1
        className=" landing-title text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-left"
        style={{
          whiteSpace: "nowrap", // Ensure this stays on one line
        }}
      >
        TO MAGNIFY MY INTELLIGENCE.
      </h1>

      {/* Proceed Button */}
      <motion.button
        onClick={onProceed}
        className="text-black font-bold px-6 py-3 rounded-lg transition-all duration-300"
        style={{
          backgroundColor:  "#a0ff06", // Lime-green background
          border: "2px solid #BCFF9D", // Lime-green border
          boxShadow: 'initial', // Glow effect on corners
        }}
        whileHover={{
          backgroundColor: "black", // Black background on hover
          color: "white", // White text on hover
          boxShadow: '0px 0px 15px #3FA604', // Retain glowing corners
        }}
      >
        PROCEED TO QUESTIONS
      </motion.button>

      {/* Skip Link */}
      <div>
        <Link
          onClick={onSkipToMain}
          className="text-white text-sm font-medium mt-4 block cursor-pointer"
          style={{
            textDecoration: "none",
          }} to={"/home"}          >
          SKIP TO MAIN PAGE →
        </Link>
      </div>
    </div>
  </motion.div>
  );
};

export default Landing;