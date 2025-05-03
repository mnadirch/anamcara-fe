import React, { useState, MouseEvent, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../../components/main/hero";
import Landing from "../../components/main/landing";
import Survey from "../../components/main/survey";
import robotFace from "../../assets/images/main/robot.png";
import dullLogo from "../../assets/images/main/dull.png";
import shineLogo from "../../assets/images/main/ANAMCARA AI LOGO ICON TRANSPARENT 1.png";
import starryBg from "../../assets/images/main/stars.png";
import useWindowSize from "./useWindowSIze";
import Audio from "../../components/main/audio";
import "./style.css";


type Phase = "hero" | "landing" | "survey";

const Main: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("hero");
  const [paddingTop, setPaddingTop] = useState("300px"); // Default padding

  // 1) Use custom hook to detect screen width
  const { width } = useWindowSize();


  // Generate stars for the background
  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  useEffect(() => {
    const updatePadding = () => {
      if (width !== null && width <= 300) {
        setPaddingTop("600px");
      }
      else if (width !== null && width <= 400) {
        setPaddingTop("500px");
      }
      else if (width !== null && width < 500) {
        setPaddingTop("350px");
      } else if (width !== null && width <= 600) {
        setPaddingTop("400px");
      } else if (width !== null && width <= 1000) {
        setPaddingTop("50px");
      }
      else if (width !== null && width <= 1260) {
        setPaddingTop("450px");
      }
    };
    updatePadding(); // Set padding on initial render
  }, [width]);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto"; // Reset after component unmounts
    };
  }, []);

  // Hover radius for stars
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
        const starElement = document.getElementById(`${areaId}-star-${i}`);
        if (starElement) {
          starElement.style.backgroundColor =
            distance <= hoverRadius ? "white" : "#00000000";
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

  const handlePhaseChange = (newPhase: Phase) => {
    setPhase(newPhase);
  };

  // Helper to render stars in a given area
  const renderStarsLayer = (areaId: string) => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, index) => (
        <div
          key={index}
          id={`${areaId}-star-${index}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            backgroundColor: "#00000000",
            transition: "background-color 0.3s ease",
          }}
        ></div>
      ))}
    </div>
  );

  // This will be rendered only when width <= 1270.
  const renderRobot = () => (
    <div
      id="robot-element"
      className="relative w-full h-auto flex justify-center items-center"
      onMouseMove={(e) => handleMouseMove(e, "robot-element")}
      onMouseLeave={() => handleMouseLeave("robot-element")}
    >
      {renderStarsLayer("robot-element")}
      <div className="relative z-10 flex justify-center items-center pt-5">
        <img
          src={robotFace}
          alt="Robot"
          className="w-[300px] h-[300px] object-contain"
        />
        <img
          src={shineLogo}
          alt="Shine Logo"
          className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blink-shine"
          style={{ width: "250px", pointerEvents: "none" }}
        />
        <img
          src={dullLogo}
          alt="Dull Logo"
          className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blink-dull"
          style={{ width: "50px", height: "50px", pointerEvents: "none" }}
        />
      </div>
    </div>
  );

  return (
    <div
      className="
         min-h-screen w-screen
    relative
  "
      style={{
        backgroundImage: `url(${starryBg})`,
      }}
    >
      {width !== null && width > 1270 && (
        <motion.div
          id="robot-area"
          className={`
      relative w-full h-[50vh]
      md:absolute md:top-0 md:left-0 md:w-1/2 md:h-full
      flex justify-center items-center
      overflow-hidden z-10
    `}
          initial={{ x: "50%" }}
          animate={{
            x:
              phase === "hero"
                ? "50%"
                : phase === "landing"
                  ? "-10%"
                  : "100%",
          }}
          transition={{ duration: 1 }}
          onMouseMove={(e) => handleMouseMove(e, "robot-area")}
          onMouseLeave={() => handleMouseLeave("robot-area")}
        >
          {renderStarsLayer("robot-area")}
          {/* <video
            autoPlay
            
            muted
            className=""
            controlsList=""
            disablePictureInPicture
          >
            <source src="/AI VID 0.mp4" type="video/mp4" />
          </video> */}
          <div className="relative z-10 w-full max-w-[950px] aspect-square">
            <video
            autoPlay
            
            muted
            className="pt-10"
            controlsList=""
            disablePictureInPicture
          >
            <source src="/AI VID 0.mp4" type="video/mp4" />
          </video>
            <img
              src={shineLogo}
              alt="Shine Logo"
              className="absolute animate-blink-shine"
              style={{
                top: "30%",
                left: "51%",
                transform: "translate(-50%, -50%)",
                width: "450px",
                pointerEvents: "none",
              }}
            />
            <img
              src={dullLogo}
              alt="Dull Logo"
              className="absolute animate-blink-dull"
              style={{
                top: "30%",
                left: "51%",
                transform: "translate(-50%, -50%)",
                width: "90px",
                pointerEvents: "none",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* RIGHT SECTION (Hero, Landing, Survey) */}
      <div >
        {/* Hero Section */}
        {phase === "hero" && (
          width !== null && width <= 1270 ? (
            // Mobile rendering: no motion
            <div
              id="hero-area"
              onMouseMove={(e) => handleMouseMove(e, "hero-area")}
              onMouseLeave={() => handleMouseLeave("hero-area")}
              onClick={() => handlePhaseChange("landing")}
            >
              {renderStarsLayer("hero-area")}
              {/* Render robot only on mobile */}
              <div style={{ paddingTop: "30px" }}></div>
              {renderRobot()}
              <Audio />
              <Hero />
            </div>
          ) : (
            // Desktop rendering: with motion
            <motion.div
              id="hero-area"
              className="relative w-full h-full 
          flex-1
          flex
          flex-col
          items-center
          justify-center 
        "
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              onMouseMove={(e) => handleMouseMove(e, "hero-area")}
              onMouseLeave={() => handleMouseLeave("hero-area")}
              onClick={() => handlePhaseChange("landing")}
            >
              {renderStarsLayer("hero-area")}
              <Hero audio={<Audio />} />
            </motion.div>
          )
        )}

        {/* Landing Section */}
        {phase === "landing" && (
          <>
            {width !== null && width < 1270 ? (
              /* MOBILE / TABLET (under 768px): Absolute positioning with scrolling */
              <motion.div
                key={width} // Forces re-render on width change
                id="landing-area"
                className="
    absolute
    top-0
    left-0
    w-full
    text-white
    space-y-6 
  "
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                onMouseMove={(e) => handleMouseMove(e, "landing-area")}
                onMouseLeave={() => handleMouseLeave("landing-area")}
              >
                {renderStarsLayer("landing-area")}
                {renderRobot()}
                <Landing
                  onProceed={() => handlePhaseChange("survey")}
                  onSkipToMain={() => handlePhaseChange("hero")}
                />
              </motion.div>
            )
              : (
                /* DESKTOP (≥768px): Relative positioning, or whatever layout you need */
                <motion.div
                  id="landing-area"
                  className="
        absolute
        h-full
        w-1/2
        right-0
        text-white
      flex-1
      flex
      flex-col
      items-center
      justify-center 
    "
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  onMouseMove={(e) => handleMouseMove(e, "landing-area")}
                  onMouseLeave={() => handleMouseLeave("landing-area")}
                  style={{ right: "7%" }}
                >
                  {renderStarsLayer("landing-area")}
                  <Landing
                    onProceed={() => handlePhaseChange("survey")}
                    onSkipToMain={() => handlePhaseChange("hero")}
                  />
                </motion.div>
              )}
          </>
        )}
        {/* Survey Section */}
        {phase === "survey" && (
          <>
            {width !== null && width <= 1270 ? (
              <motion.div
                key={width}
                id="survey-area"
                className="survey-area relative w-full
             h-auto "
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                onMouseMove={(e) => handleMouseMove(e, "survey-area")}
                onMouseLeave={() => handleMouseLeave("survey-area")}
              >
                {renderStarsLayer("survey-area")}

                <div className="blank" style={{ paddingTop }} ></div>
                {renderRobot()}

                <Survey onSkipToMain={() => handlePhaseChange("hero")} />
              </motion.div>
            ) : (
              <motion.div
                id="survey-area"
                className="
                absolute
                w-1/2
                left-0
                h-full
                flex
                flex-1
                flex-col
                items-center
                justify-center
                text-white
                space-y-6
              "
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                onMouseMove={(e) => handleMouseMove(e, "survey-area")}
                onMouseLeave={() => handleMouseLeave("survey-area")}
              >
                {renderStarsLayer("survey-area")}
                <Survey onSkipToMain={() => handlePhaseChange("hero")} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Main;