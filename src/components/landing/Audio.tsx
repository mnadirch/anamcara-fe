import { useState, useRef, useEffect, useCallback } from "react";
import { robot_welcome, pause, play, replay } from "../../../public";

const Audio: React.FC = () => {
    const [audioState, setAudioState] = useState<"playing" | "paused" | "replay">("paused");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const icons = {
        paused: pause,
        playing: play,
        replay: replay,
    };

    const handleEnded = useCallback(() => {
        setAudioState("replay");
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const audio = new window.Audio(robot_welcome);
            audio.preload = "auto";
            audioRef.current = audio;

            // Delay the play call slightly to work around autoplay restrictions
            const playAudio = () => {
                audio.play()
                    .then(() => setAudioState("playing"))
                    .catch((err) => {
                        console.error("Audio play error:", err);
                    });
            };

            // Try to play the audio after a short delay
            const timeout = setTimeout(playAudio, 100); // 100ms delay to bypass autoplay restrictions

            audio.addEventListener("ended", handleEnded);

            return () => {
                clearTimeout(timeout); // Clean up timeout
                audio.pause();
                audio.removeEventListener("ended", handleEnded);
                audioRef.current = null;
            };
        }
    }, [handleEnded]);

    const handleAudioControl = useCallback(
        (e: React.MouseEvent<HTMLImageElement>) => {
            e.stopPropagation();
            const audio = audioRef.current;
            if (!audio) return;

            if (audioState === "playing") {
                audio.pause();
                setAudioState("paused");
            } else {
                if (audioState === "replay") {
                    audio.currentTime = 0;
                }
                audio
                    .play()
                    .then(() => setAudioState("playing"))
                    .catch((err) => {
                        console.error("Audio play error:", err);
                    });
            }
        },
        [audioState]
    );

    return (
        <div className="block absolute top-4 right-4 z-[99999] p-2" onClick={(e) => e.stopPropagation()}>
            <img
                src={icons[audioState]}
                alt={audioState}
                aria-label={
                    audioState === "paused"
                        ? "Pause Audio"
                        : audioState === "playing"
                            ? "Play Audio"
                            : "Replay Audio"
                }
                className="w-10 h-10 cursor-pointer"
                onClick={handleAudioControl}
            />
        </div>
    );
};

export default Audio;
