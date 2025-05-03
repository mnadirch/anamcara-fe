import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const StartUpPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();

  const handleEnterClick = async () => {
    // Phase 1: Slight zoom in
    await controls.start({
      scale: 1.1,
      transition: { duration: 0.3 },
    });

    // Phase 2: Collapse vertically (like old TV)
    await controls.start({
      scaleY: 0.03,
      scaleX: 1.3,
      transition: { duration: 0.3, ease: "easeInOut" },
    });

    // Phase 3: Quick white flash then fade out
    await controls.start({
      opacity: 0,
      transition: { duration: 0.4 },
    });

    navigate("/home");
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <motion.video
        autoPlay
        loop
        initial={{ scale: 1, opacity: 1 }}
        animate={controls}
        className="absolute top-0 left-0 w-full h-full object-cover origin-center"
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
      >
        <source src="/Earth. startuppage.mp4" type="video/mp4" />
      </motion.video>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col gap-4 z-10">
        <button
          onClick={handleEnterClick}
          className="flex py-4 px-6 text-3xl rounded-lg border-glow hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Click To Enter
        </button>
      </div>
    </div>
  );
};

export default StartUpPage;