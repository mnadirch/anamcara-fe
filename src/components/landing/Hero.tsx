import React, { useState, MouseEvent } from "react";
import { motion } from "framer-motion";

interface HeroProps {
    audio?: React.ReactNode;
}

const Hero: React.FC<HeroProps> = ({ audio }) => {
    const hoverRadius = 10;
    const [welcomeText] = useState("WELCOME");
    const [humanText] = useState("HUMAN  ...");
    const stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
    }));

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>, areaId: string) => {
        const area = document.getElementById(areaId);
        if (area) {
            const rect = area.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

            stars.forEach((star, i) => {
                const distance = Math.sqrt(Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2));
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
        <div className="relative w-full h-screen overflow-y-auto flex items-center justify-center">
            <div className="absolute inset-0 z-0" />
            <div className="relative z-10 flex w-full h-full justify-evenly items-center gap-[30rem] max-[1270px]:flex-col max-[1270px]:gap-0 max-[1270px]:h-[60%]">
                {/* Welcome Block */}
                <motion.div
                    className="relative flex justify-center items-center p-4 h-full w-auto max-[1270px]:w-full"
                    id="welcome-area"
                    onMouseMove={(e) => handleMouseMove(e, "welcome-area")}
                    onMouseLeave={() => handleMouseLeave("welcome-area")}
                >
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {stars.map((star, index) => (
                            <motion.div
                                key={`welcome-star-${index}`}
                                className="absolute w-2 h-2 rounded-full bg-transparent transition-colors duration-300 ease-in-out"
                                style={{ top: `${star.y}%`, left: `${star.x}%` }}
                                id={`welcome-area-star-${index}`}
                            />
                        ))}
                    </div>

                    <motion.h1 className="font-bold text-center whitespace-nowrap font-[Mowaq] text-[#a0ff06] text-[clamp(3rem,5vw,7rem)]">
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
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </motion.h1>
                </motion.div>

                {/* Human Block */}
                <motion.div
                    className="relative flex justify-center items-center p-4 h-full w-auto max-[1270px]:w-full"
                    id="human-area"
                    onMouseMove={(e) => handleMouseMove(e, "human-area")}
                    onMouseLeave={() => handleMouseLeave("human-area")}
                >
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {stars.map((star, index) => (
                            <motion.div
                                key={`human-star-${index}`}
                                className="absolute w-2 h-2 rounded-full bg-transparent transition-colors duration-300 ease-in-out"
                                style={{ top: `${star.y}%`, left: `${star.x}%` }}
                                id={`human-area-star-${index}`}
                            />
                        ))}
                    </div>
                    {audio}
                    <motion.h1 className="font-bold text-center whitespace-nowrap font-[Mowaq] text-[#a0ff06] text-[clamp(3rem,5vw,7rem)]">
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
                                }}
                            >
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
