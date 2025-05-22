import React, { useState, MouseEvent, useEffect, useMemo } from "react";
import { logo, logo_shine, robot_anim } from "../../../public";
import { motion } from "framer-motion";
import Hero from "../../components/landing/Hero";
import Landing from "../../components/landing/Landing";
import Survey from "../../components/landing/Survery";
import Audio from "../../components/landing/Audio";
import CusrorEffect from "../../components/landing/CusrorEffect";
import RobotAnimation from "../../components/landing/RobotAnimation";

interface windowSizeProps {
    width: number | null;
    height: number | null;
}

type Phase = "hero" | "landing" | "survey";

const IntroHome: React.FC = () => {
    const hoverRadius = 10;
    const [phase, setPhase] = useState<Phase>("hero");
    const [paddingTop, setPaddingTop] = useState("300px");
    const [windowSize, setWindowSize] = useState<windowSizeProps>({
        width: null,
        height: null,
    });

    const stars = useMemo(() => (
        Array.from({ length: 150 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
    ), []);

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

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleResize = () => {
            const width = window.innerWidth;
            setWindowSize({ width, height: window.innerHeight });
            let padding = "300px";

            if (width <= 300) {
                padding = "600px";
            } else if (width <= 400) {
                padding = "500px";
            } else if (width < 500) {
                padding = "350px";
            } else if (width <= 600) {
                padding = "400px";
            } else if (width <= 1000) {
                padding = "50px";
            } else if (width <= 1260) {
                padding = "450px";
            }

            setPaddingTop(padding);
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen w-full relative bg-star overflow-x-hidden">
            {windowSize.width !== null && windowSize.width > 1270 && (
                <motion.div
                    id="robot-area"
                    className={`relative w-full h-[50vh] md:absolute md:top-0 md:left-0 md:w-1/2 md:h-full flex justify-center items-center overflow-hidden z-10`}
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
                    <CusrorEffect areaId="robot-area" />

                    <div className="relative z-10 w-full max-w-[950px] aspect-square">
                        <video
                            autoPlay
                            muted
                            className="pt-10"
                            controls={false}
                            disablePictureInPicture
                        >
                            <source src={robot_anim} type="video/mp4" />
                        </video>
                        <img
                            src={logo_shine}
                            alt="Shine Logo"
                            className="absolute animate-blink-shine top-[30%] left-[51%] -translate-1/2 w-[450px] pointer-events-none"
                        />
                        <img
                            src={logo}
                            alt="Dull Logo"
                            className="absolute animate-blink-dull top-[30%] left-[51%] -translate-1/2 w-[90px] pointer-events-none"
                        />
                    </div>
                </motion.div>
            )}

            <div>
                {/* Hero Section */}
                {phase === "hero" && (
                    windowSize.width !== null && windowSize.width <= 1270 ? (
                        <div
                            id="hero-area"
                            onMouseMove={(e) => handleMouseMove(e, "hero-area")}
                            onMouseLeave={() => handleMouseLeave("hero-area")}
                            onClick={() => handlePhaseChange("landing")}
                        >
                            <CusrorEffect areaId="hero-area" />

                            <div style={{ paddingTop: "30px" }}></div>
                            <RobotAnimation />
                            <Audio />
                            <Hero />
                        </div>
                    ) : (
                        <motion.div
                            id="hero-area"
                            className="relative w-full h-full flex-1 flex flex-col items-center justify-center"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            onMouseMove={(e) => handleMouseMove(e, "hero-area")}
                            onMouseLeave={() => handleMouseLeave("hero-area")}
                            onClick={() => handlePhaseChange("landing")}
                        >
                            <CusrorEffect areaId="hero-area" />
                            <Hero audio={<Audio />} />
                        </motion.div>
                    )
                )}

                {/* Landing Section */}
                {phase === "landing" && (
                    windowSize.width !== null && windowSize.width < 1270 ? (
                        <motion.div
                            key={windowSize.width}
                            id="landing-area"
                            className=" absolute top-0 left-0 w-full  text-white space-y-6"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            onMouseMove={(e) => handleMouseMove(e, "landing-area")}
                            onMouseLeave={() => handleMouseLeave("landing-area")}
                        >
                            <CusrorEffect areaId="landing-area" />
                            <RobotAnimation />
                            <Landing
                                onProceed={() => handlePhaseChange("survey")}
                                onSkipToMain={() => handlePhaseChange("hero")}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            id="landing-area"
                            className=" absolute h-full w-1/2 right-0 text-white flex-1 flex flex-col items-center justify-center"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            onMouseMove={(e) => handleMouseMove(e, "landing-area")}
                            onMouseLeave={() => handleMouseLeave("landing-area")}
                            style={{ right: "7%" }}
                        >
                            <CusrorEffect areaId="landing-area" />
                            <Landing
                                onProceed={() => handlePhaseChange("survey")}
                                onSkipToMain={() => handlePhaseChange("hero")}
                            />
                        </motion.div>
                    )
                )}

                {/* Survey Section */}
                {phase === "survey" && (
                    <>
                        {windowSize.width !== null && windowSize.width <= 1270 ? (
                            <motion.div
                                key={windowSize.width}
                                id="survey-area"
                                className="survey-area relative w-full h-auto"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                onMouseMove={(e) => handleMouseMove(e, "survey-area")}
                                onMouseLeave={() => handleMouseLeave("survey-area")}
                            >
                                <CusrorEffect areaId="survey-area" />

                                <div className="blank" style={{ paddingTop }} ></div>
                                <RobotAnimation />

                                <Survey onSkipToMain={() => handlePhaseChange("hero")} />
                            </motion.div>
                        ) : (
                            <motion.div
                                id="survey-area"
                                className="absolute w-1/2 left-0 h-full flex flex-1 flex-col items-center justify-center text-white space-y-6"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                onMouseMove={(e) => handleMouseMove(e, "survey-area")}
                                onMouseLeave={() => handleMouseLeave("survey-area")}
                            >
                                <CusrorEffect areaId="survey-area" />
                                <Survey onSkipToMain={() => handlePhaseChange("hero")} />
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default IntroHome;