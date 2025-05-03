

import { useState, useEffect } from "react";
// import { FaBars } from 'react-icons/fa';
// import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../App.css";
import { GiSailboat } from "react-icons/gi";
import { MdMotionPhotosPaused } from "react-icons/md";
import { GiTwirlyFlower } from "react-icons/gi";


function Home() {
  const [_menuOpen, setMenuOpen] = useState(false);
  const [_isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [showNotification, setShowNotification] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribe = () => {
    // Show the notification
    setShowNotification(true);

    // Hide the notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };



  return (
    <div className="w-screen min-h-screen flex flex-col relative overflow-auto">
      Video Background
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0 ">
        <source src="/Robortbg.mp4" type="video/mp4" />
      </video>
      <main>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6  px-16 lg:px-36 pt-16 lg:pt-32 relative">
          {/* Content Box */}
          <div className="relative px-5 py-8 md:py-12 w-full md:w-[600px] h-[500px] font-mowaq lg:w-[700px] bg-[rgba(51,255,0,0.01)] backdrop-blur-md shadow-xl rounded-xl border-glow text-center">
            <h1 className="text-white pt-14 font-bold text-3xl md:text-4xl">
              Beyond Human Connection,
            </h1>
            <h1 className="text-white font-bold text-xl md:text-3xl mt-2">
              Empowering Every Individual
            </h1>
            <h1 className="text-white text-lg md:text-2xl mt-4">
              Transform Your Experience
            </h1>
            <h3
              className="text-white mt-4 text-[26px] font-sans"
            >
              ANAMCARA AI transforms everyday interactions into personalized
              experiences that inspire and empower.
            </h3>

            {/* Input Box */}
            <div className="flex justify-center items-center font-bold mt-6 gap-2">
              <input
                className="rounded-md py-2 px-3 w-2/3 md:w-1/2 text-black"
                type="text"
                placeholder="Enter email"
              />
              {/* <button className="py-2 px-4 rounded-lg text-black bg-[#ADFF00]">
                Subscribe Now!
              </button> */}

              <button
                type="button"
                className="py-2 px-4 rounded-lg text-black bg-[#ADFF00]"
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
            className="w-full md:w-[500px] lg:w-[720px] h-auto lg:h-[600px] rounded-xl lg:rounded-full opacity-70"
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
      </main>
    </div>
  );
}

export default Home;