import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
// import hourGlass from "../../assets/animation/hourglass.json";
import BlobCursor from "./BlobCursor";
import SpiralLoader from "./SpiralLoader";

const CommingSoon: React.FC = () => {
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: hourGlass,
  // };

  return (
    <>
      <BlobCursor />
      <div
        className="relative mx-auto overflow-hidden border border-[#c4f017] gap-4 p-4 flex flex-col"
        style={{ height: "60dvh", width: "80vw" }}
      >
        {/* Clock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
          <SpiralLoader />
        </div>

        {/* Top Row: Heading & Coming Soon */}
        <div className="flex flex-col md:flex-row w-full justify-between font-mowaq z-[999] gap-4">
          <div className="text-[#c4f017] font-medium text-center md:text-left  text-[1rem] md:text-[3.5rem] xl:text-[4rem]">
            Good Things <br /> Take Time
          </div>
          <div className="text-transparent font-[850] text-center md:text-right text-[0.7rem] md:text-[1rem] lg:text-[2rem] min-xl:text-[3rem] [-webkit-text-stroke:1px_#c4f017]">
            Page Coming Soon
          </div>
        </div>

        {/* Bottom Row: Supporting Text & Social Icons */}
        <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-end mt-auto z-[999] gap-4">
          <div
            className="leading-[1.4] text-center md:text-left text-[#c4f017]"
            style={{ fontSize: "clamp(0.5rem, 1vw, 1rem)" }}
          >
            We're making sure everything is just right. <br />
            Stay tuned for what's next
          </div>
          <div className="flex gap-4 md:gap-8 lg:gap-12 hover:cursor-pointer">
            <LinkedInIcon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            <FacebookIcon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            <TwitterIcon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            <InstagramIcon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
            <YouTubeIcon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
          </div>
        </div>
      </div>

    </>
  );
};

export default CommingSoon;
