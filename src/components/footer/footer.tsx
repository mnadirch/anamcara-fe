import { useState, FC } from "react";
import styles from "./footer.module.css";
import Ai_bottom from "../../assets/images/footerimages/AI_bottom.png";
import metaverse from "../../assets/images/footerimages/Metaverse_bottom.png";
import robotics from "../../assets/images/footerimages/Robot_bottom.jpeg";
import logo from "../../assets/images/navabarlogo/ANAMCARA AI LOGO ICON TRANSPARENT 2.png";
import { useNavigate } from "react-router-dom";
// import aiTabAnimation from "../../assets/animation/footerlockanimations/aiTab.json";
import metaverseTabAnimation from "../../assets/animation/footerlockanimations/metaverseTab.json";
// import roboticsTabAnimation from "../../assets/animation/footerlockanimations/roboticsTab.json";
import Lottie from "react-lottie";

const Footer: FC = () => {
  const [activeIndex, _setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();
  const updateStatus = (index: number) => {
    if (index === 0) navigate("/");
  };

  const defaultOptions = [
    {
      loop: true,
      autoplay: true,
      animationData: "",
    },
    {
      loop: true,
      autoplay: true,
      animationData: metaverseTabAnimation,
    },
    {
      loop: true,
      autoplay: true,
      animationData: metaverseTabAnimation,
    },
    {
      loop: true,
      autoplay: true,
      animationData: metaverseTabAnimation,
    },
  ];

  const data = [
    {
      id: 1,
      title: "AI",
      desc: "Cognitive Evolution",
      hasLock: false,
      img: logo,
    },
    {
      id: 2,
      title: "Metaverse",
      desc: "Immersive Realities",
      hasLock: true,
      img: Ai_bottom,
    },
    {
      id: 3,
      title: "Robotics",
      desc: "Revolutionary Automation",
      hasLock: true,
      img: metaverse,
    },
    {
      id: 4,
      title: "Quantum",
      desc: "Infinite Possibilities",
      hasLock: true,
      img: robotics,
    },
  ]

  return (
    <div className={styles.footer}>
      <div className={styles.footerContainer}>
        {data.map((item, index) => (
          <div
            key={index}
            onClick={() => updateStatus(index)}
            className={`${styles.content} relative w-full h-full`}
          //   activeIndex === index ? : styles.content
          // }
          >
            <div className={styles.imageContainer}>
              <img
                src={item.img}
                alt={`img${item.title}`}
                className={styles.img1}
              />
            </div>

            <div className={styles.textContainer}>
              <h1
                className={activeIndex === index ? styles.text : styles.text}
              >
                {item.title}
              </h1>
              <p
                className={`${styles.secondaryText} ${activeIndex === index
                  ? styles.secondaryText
                  : styles.secondaryText
                  }`}
              >
                {item.desc}
              </p>
            </div>

            {item.hasLock && (
              <div className={`absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2`}>
                <Lottie
                  options={defaultOptions[1]}
                  key={item.id}
                  height={40}
                  width={40}
                  isClickToPauseDisabled={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;