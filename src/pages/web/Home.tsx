import { useState, useEffect } from "react";
import { GiSailboat } from "react-icons/gi";
import { MdMotionPhotosPaused } from "react-icons/md";
import { GiTwirlyFlower } from "react-icons/gi";
import { home } from "../../../public";

function Home() {
  const [_menuOpen, setMenuOpen] = useState(false);
  const [_isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubscribe = () => {
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setMenuOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full lg:h-screen flex flex-col items-center justify-center relative overflow-auto">
      <video autoPlay loop muted className="fixed top-0 left-0 w-full h-full object-cover z-0 ">
        <source src={home} type="video/mp4" />
      </video>

      <div className="md:w-4/5 w-11/12 pt-20 lg:pt-10 h-full">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 relative w-full">
          {/* Content Box */}
          <div className="relative px-5 py-4 md:py-7 lg:w-1/2 w-full max-w-[600px] h-fit font-mowaq bg-[rgba(51,255,0,0.01)] backdrop-blur-md shadow-xl rounded-xl border-glow text-center">
            <h1 className="text-white pt-5 font-bold 2xl:text-3xl lg:text-2xl md:text-xl text-lg">
              Beyond Human Connection,
            </h1>

            <h1 className="text-white font-bold 2xl:text-2xl lg:text-2xl md:text-xl text-lg mt-2">
              Empowering Every Individual
            </h1>

            <h1 className="text-white 2xl:text-xl lg:text-xl md:text-lg text-base mt-4">
              Transform Your Experience
            </h1>
            <h3
              className="text-white mt-4 xl:text-xl lg:text-lg md:text-lg text-base font-sans"
            >
              ANAMCARA AI transforms everyday interactions into personalized
              experiences that inspire and empower.
            </h3>

            {/* Input Box */}
            <div className="flex justify-center items-center font-bold mt-6 gap-2">
              <input
                className="rounded-md py-2 px-3 w-2/3 md:w-1/2 text-white/70 bg-black/20"
                type="text"
                placeholder="Enter email"
              />


              <button
                type="button"
                className="py-2 px-4 rounded-lg cursor-pointer text-black bg-[#ADFF00]"
                onClick={handleSubscribe}
              >
                Subscribe Now!
              </button>
            </div>

            {/* Icons */}
            <div className="flex justify-center gap-4 py-4 text-3xl md:text-4xl text-[#ADFF00]">
              <GiSailboat />
              <MdMotionPhotosPaused />
              <GiTwirlyFlower />
            </div>
          </div>

          {/* Video Section */}
          <video
            autoPlay
            loop
            muted
            className="lg:w-1/2 lg:block hidden w-full h-auto lg:h-[600px] rounded-xl lg:rounded-full opacity-70"
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
          >
            <source src="/vid5.mp4" type="video/mp4" />
          </video>

          {showNotification && (
            <div className={`fixed z-50 bottom-20 right-6`}>
              <div className="bg-black text-white px-4 py-2 text-sm rounded-lg shadow-lg border-2 border-[#ff6fff] animate-fade-in-out transition-opacity duration-500 w-max">
                ✅ Subscription successful!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;