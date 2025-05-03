import { useState, useRef, useEffect, useCallback } from "react";
import playIcon from "../../assets/images/audio/Type=Play.png";
import pauseIcon from "../../assets/images/audio/Type=Pause.png";
import replayIcon from "../../assets/images/audio/Type=Replay.png";
import audioFile from "../../assets/audio/Beth-2024_12_31-6.wav";

const Audio: React.FC = () => {
  const [audioState, setAudioState] = useState<"playing" | "paused" | "replay">("paused");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const icons = {
    playing: pauseIcon,
    paused: playIcon,
    replay: replayIcon,
  };

  useEffect(() => {
    const initializeAudio = async () => {
      if (!audioRef.current) {
        audioRef.current = new window.Audio(audioFile) as HTMLAudioElement;
        audioRef.current.preload = "auto";
        audioRef.current.muted = true;  

        try {
          await audioRef.current.play();
          audioRef.current.muted = false;  
          setAudioState("playing");
        } catch (error) {
          console.error("Autoplay blocked:", error);
          setAudioState("paused");
        }

        audioRef.current.addEventListener("ended", () => setAudioState("replay"));
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", () => setAudioState("replay"));
        audioRef.current = null;
      }
    };
  }, []);




  const handleAudioControl = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (audioState === "playing") {
      audioRef.current.pause();
      setAudioState("paused");
    } else {
      audioRef.current.currentTime = audioState === "replay" ? 0 : audioRef.current.currentTime;
      audioRef.current
        .play()
        .then(() => setAudioState("playing"))
        .catch((error) => console.error("Audio play error:", error));
    }
  }, [audioState]);

  return (
    <div className="block absolute top-4 right-4 z-[99999] p-2"
      onClick={(e) => e.stopPropagation()}>
      <img
        src={icons[audioState]}
        alt={audioState}
        aria-label={audioState === "playing" ? "Pause Audio" : audioState === "paused" ? "Play Audio" : "Replay Audio"}
        className="w-10 h-10 cursor-pointer"
        onClick={handleAudioControl}
      />
    </div>
  );
};

export default Audio;
