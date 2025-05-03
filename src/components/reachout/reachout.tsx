import styles from "./reachout.module.css";
import { useEffect, useRef } from "react";
import Fluid from "webgl-fluid";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RedditIcon from '@mui/icons-material/Reddit';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ReachOutForm from "./childs/form/form";
import Game from "./childs/game/game";
// import SmokeAnimation from "../footer/childs/component/smokeComponent/smoke";
import arrow from "../../assets/icons/Vector (13).png";


const ReachOut = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(function () {
    let c = canvasRef.current;
    Fluid(c, {
      SPLAT_RADIUS: 0.1, //fluid radius
      DENSITY_DISSIPATION: 1, //how fast fluid disappear
      PRESSURE_ITERATIONS: 300, //speed of fluid
    });
  }, []);

  useEffect(() => {
    const container = document.querySelector(`.${styles.container}`);

    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const simulatedEvent = new MouseEvent("mousemove", {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        canvasRef.current.dispatchEvent(simulatedEvent);
      }
    };

    container?.addEventListener("mousemove", handleMouseMove as EventListener);

    return () =>
      container?.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
  }, []);

  return (
    <>
      <div className={styles.container}>
        {/* <SmokeAnimation /> */}
        <canvas
          className={styles.canvasLayer}
          ref={canvasRef}
          style={{ width: "100%", height: "100%", background: "" }}
        ></canvas>

        <div className="w-1/2 flex flex-col  md:items-center text-center md:pl-5 font-sans">
          <div>
            <h1 className="relative w-full group inline-block px-8 py-3 font-bold uppercase text-black tracking-wide rounded-lg shadow-lg mt-24 md:mt-20 lg:mt-8 overflow-hidden cursor-pointer text-lg">
              {/* Base gradient layer */}
              <span className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-l from-lime-400 to-[#15c14a] group-hover:opacity-0"></span>

              {/* Hover gradient layer */}
              <span className="absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-l from-[#15c14a] to-lime-400 group-hover:opacity-100"></span>

              {/* Button text */}
              <span className="relative block transition-colors duration-500 text-xl max-sm:text-xs md:text-lg group-hover:animate-fadeLeftRight group-hover:text-black-500">
                REACH OUT TO US!
              </span>
            </h1>
          </div>

          {/* MESSAGE TEXT */}
          <p className="text-white text-base max-sm:text-sm md:text-lg max-lg:text-xl font-medium leading-snug sm:leading-normal md:leading-relaxed">
            Have an idea, question, or want to partner with us?
            <span className=""><br /></span>
            Send us a message and hit
            <span className="font-bold text-white tracking-wide text-base sm:text-xl md:text-2xl" > REACH OUT!</span>
            </p>



          {/* GO SOCIALS BUTTON */}
          <button className="relative px-6 py-2 mt-10 font-bold uppercase text-black tracking-wide rounded-lg shadow-lg overflow-hidden cursor-pointer group text-lg max-sm:text-sm md:text-xl">
            {/* Base gradient layer */}
            <span className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-l from-lime-400 to-green-400 group-hover:opacity-0"></span>

            {/* Hover gradient layer */}
            <span className="absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-l from-green-400 to-lime-400 group-hover:opacity-100"></span>

            {/* Button text with custom wipe effect and color transition */}
            <span className="relative block text-center transition-colors duration-500 group-hover:animate-fadeLeftRight group-hover:text-black-500">
              GO SOCIALS
            </span>
          </button>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center gap-3 my-2 mt-5 ">
            <LinkedInIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <FacebookIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <TwitterIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <InstagramIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <YouTubeIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <RedditIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
            <PinterestIcon className={`bg-black text-white rounded-full p-2 ${styles.icons}`} />
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-3/4 md:w-3/4 lg:w-1/2 gap-2 sm:gap-4 max-sm:mt-10 md:mt-10 mb-5">
          <div className="relative flex flex-row items-center justify-center">
            <Game />
            <div className="absolute bottom-0 translate-x-[-150%] flex flex-col items-center z-20 mb-[-30px]">
              <img
                src={arrow}
                alt="Arrow pointing to game"
                width="30"
                height="30"
                className="transform -scale-x-100"
              />
              <p className="text-white text-sm pt-1">Try me</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-3/4 md:3/4 lg:w-1/2">
          <ReachOutForm />
        </div>
      </div>
    </>
  );
};

export default ReachOut;