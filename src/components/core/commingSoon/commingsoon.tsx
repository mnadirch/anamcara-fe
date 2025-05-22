import React from "react";
import { 
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import BlobCursor from "./BlobCursor";
import SpiralLoader from "./SpiralLoader";

const ComingSoon: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      <BlobCursor />
      <div
        className="relative mx-auto overflow-hidden border border-[#c4f017] gap-4 p-4 flex flex-col bg-black/50 backdrop-blur-sm"
        style={{ height: "60dvh", width: "80vw", maxWidth: "1200px" }}
      >
        {/* Clock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
          <SpiralLoader />
        </div>

        {/* Top Row: Heading & Coming Soon */}
        <div className="flex flex-col md:flex-row w-full justify-between font-mowaq z-[999] gap-4">
          <div className="text-[#c4f017] font-medium text-center md:text-left text-[clamp(1rem,5vw,4rem)] leading-tight">
            Good Things <br /> Take Time
          </div>
          <div className="text-transparent font-[850] text-center md:text-right text-[clamp(0.7rem,3vw,3rem)] [-webkit-text-stroke:1px_#c4f017]">
            Page Coming Soon
          </div>
        </div>

        {/* Bottom Row: Supporting Text & Social Icons */}
        <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-end mt-auto z-[999] gap-4">
          <div className="leading-[1.4] text-center md:text-left text-[#c4f017] text-[clamp(0.5rem,1vw,1rem)]">
            We're making sure everything is just right. <br />
            Stay tuned for what's next
          </div>
          <div className="flex gap-4 md:gap-8 lg:gap-12">
            {[
              { Icon: FaLinkedin, url: "#" },
              { Icon: FaFacebook, url: "#" },
              { Icon: FaTwitter, url: "#" },
              { Icon: FaInstagram, url: "#" },
              { Icon: FaYoutube, url: "#" }
            ].map(({ Icon, url }, index) => (
              <a 
                key={index} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#c4f017] hover:text-white transition-colors duration-300"
                aria-label={`Social media link ${index + 1}`}
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;