import astronaut from "../../assets/images/backgrounds/astronaut.webp";
import styles from "./pagenotfound.module.css";
import { useNavigate } from "react-router-dom";
import earthPic from "../../assets/images/footerimages/earth2.png";
const PageNotfound = () => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("./home");
  };
  return (
    <>
      <div className={styles.Container}>
        <div className={styles.content1}>
          <img className={styles.earth} src={earthPic} alt="" />
        </div>

        <div className={styles.content}>
          <h1 className={styles.text404}>404 </h1>
          <img className={styles.astronautPic} src={astronaut} alt="" />
          <p className=" absolute
    top-[75%]
    left-1/2
    transform
    -translate-x-1/2
    z-[99999]
    text-[1vw]
    font-medium
    text-[rgb(254,243,124)]
    tracking-[1px]
    inline-flex
    font-[Montserrat]
    whitespace-nowrap

">
            <span className="mr-[2ch]">HERMES WE HAVE A PROBLEM</span>
          </p>
          <p className="
  absolute
  top-[76%]
  left-1/2
  transform
  -translate-x-1/2
  z-[999999]
  text-[5vw]
  font-medium
  font-[Audiowide]
  whitespace-nowrap
">
            <span className="mr-[0.5ch]">WE ARE LOST</span>
          </p>

          <button
            onClick={() => navigateToHome()}
            className={styles.homebutton}
          >
            TAKE ME HOME
          </button>
        </div>
      </div>
    </>
  );
};

export default PageNotfound;
