import React, { useEffect, useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { surveryData } from "../../constants";
import { startup } from "../../../public";

interface Question {
    question: string;
    answers: string[];
}

interface SurveyProps {
    onSkipToMain: () => void;
}

const Survey: React.FC<SurveyProps> = ({ onSkipToMain }) => {
    const [tfQuestion, setTFQuestion] = useState<Question | null>(null);
    const [mcqQuestion, setMCQQuestion] = useState<Question | null>(null);
    const [hoveredOption, setHoveredOption] = useState<number | null>(null);
    const [selectedTF, setSelectedTF] = useState<string | null>(null);
    const [selectedMCQ, setSelectedMCQ] = useState<number | null>(null);
    const [selectedSave, setSelectedSave] = useState<string | null>(null);

    const [showVideo, setShowVideo] = useState(false); // NEW
    const navigate = useNavigate();

    const stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
    }));

    const hoverRadius = 2;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const surveyArea = document.getElementById("survey-area");
        if (surveyArea) {
            const rect = surveyArea.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

            stars.forEach((star, i) => {
                const distance = Math.sqrt(
                    Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2)
                );
                const starElement = document.getElementById(`survey-star-${i}`);
                if (starElement) {
                    if (distance <= hoverRadius) {
                        starElement.style.backgroundColor = "white";
                    } else {
                        starElement.style.backgroundColor = "#00000000";
                    }
                }
            });
        }
    };

    const handleMouseLeave = () => {
        stars.forEach((_, i) => {
            const starElement = document.getElementById(`survey-star-${i}`);
            if (starElement) {
                starElement.style.backgroundColor = "#00000000";
            }
        });
    };

    useEffect(() => {
        const randomTF = surveryData.tf[Math.floor(Math.random() * surveryData.tf.length)];
        const randomMCQ = surveryData.mcq[Math.floor(Math.random() * surveryData.mcq.length)];

        setTFQuestion(randomTF);
        setMCQQuestion(randomMCQ);
    }, []);

    const handleButtonClick = () => {
        setShowVideo(true);
        setTimeout(() => {
            navigate("/startup-page");
        }, 1000); // 1 second
    };

    return (
        <div
            id="survey-area"
            className="relative p-4 md:p-8 lg:p-16 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* VIDEO OVERLAY */}
            {showVideo && (
                <div className="fixed inset-0 z-50 bg-black flex justify-center items-center">
                    <video
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src={startup} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            {/* Stars Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {stars.map((star, index) => (
                    <div
                        key={index}
                        id={`survey-star-${index}`}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            top: `${star.y}%`,
                            left: `${star.x}%`,
                            backgroundColor: "#00000000",
                            transition: "background-color 0.3s ease",
                        }}
                    ></div>
                ))}
            </div>

            {/* Survey Content */}
            <div className="survey-content relative z-10 space-y-12 max-w-screen-md w-full">

                {/* TF Question */}
                {tfQuestion && (
                    <div className="true flex flex-col space-y-6">
                        <h1 className="text-white text-3xl sm:text-2xl lg:text-2xl font-bold text-left">
                            {tfQuestion.question}
                        </h1>
                        <div className="flex flex-wrap gap-4">
                            {tfQuestion.answers.map((answer, idx) => {
                                const isSelected = selectedTF === answer;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedTF(answer)}
                                        className={`w-32 text-center px-6 py-2 text-lg font-medium rounded-full transition-all 
                    ${isSelected
                                                ? "bg-[#ADFF00] text-black border-2 border-black"
                                                : "bg-transparent text-[#ADFF00] border-2 border-[#BCFF9D] hover:bg-[#ADFF00] hover:text-black hover:border-black"
                                            }`}
                                    >
                                        {answer}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* MCQ Question */}
                {mcqQuestion && (
                    <div className="mcq flex flex-col space-y-6">
                        <h1 className="mcq-q text-white text-2xl sm:text-3xl lg:text-2xl font-bold text-left">
                            {mcqQuestion.question}
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {mcqQuestion.answers.map((answer, idx) => {
                                const optionLetter = String.fromCharCode(65 + idx);
                                const isSelected = selectedMCQ === idx;
                                const isHovered = hoveredOption === idx;
                                const isActive = isSelected || isHovered;

                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center space-x-4 cursor-pointer group"
                                        onClick={() => setSelectedMCQ(idx)}
                                        onMouseEnter={() => setHoveredOption(idx)}
                                        onMouseLeave={() => setHoveredOption(null)}
                                    >
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all
                      ${isActive
                                                    ? "bg-[#ADFF00] text-black border-black"
                                                    : "bg-transparent text-[#ADFF00] border-[#BCFF9D]"
                                                }`}
                                        >
                                            {optionLetter}
                                        </div>
                                        <p className="text-lg font-medium text-white">{answer}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Static Question */}
                <div className="static flex flex-col space-y-6">
                    <h1 className="text-white text-2xl sm:text-3xl lg:text-2xl font-bold text-left">
                        Who would you rather save?
                    </h1>
                    <div className="option flex flex-wrap gap-4">
                        {["Self", "Partner", "Friend", "Parent"].map((answer, idx) => {
                            const isSelected = selectedSave === answer;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSave(answer)}
                                    className={`w-32 text-center px-6 py-2 text-lg font-medium rounded-full transition-all
                    ${isSelected
                                            ? "bg-[#ADFF00] text-black border-2 border-black"
                                            : "bg-transparent text-[#ADFF00] border border-[#BCFF9D] hover:bg-[#ADFF00] hover:text-black"
                                        }`}
                                >
                                    {answer}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Final Button */}
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleButtonClick}
                        className="px-4 sm:px-6 py-2 text-sm sm:text-lg font-bold text-black bg-[#ADFF00] rounded-lg hover:bg-black hover:text-white border-2 border-[#BCFF9D] transition-all"
                        style={{ boxShadow: "0px 0px 15px #3FA604" }}
                    >
                        I HAVE OBLIGED
                    </button>
                    <Link
                        onClick={onSkipToMain}
                        className="text-white text-sm sm:text-lg font-medium cursor-pointer"
                        to={"/home"}
                    >
                        SKIP TO MAIN PAGE →
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Survey;