// import React, { ReactNode } from "react";
// import Navbar from "../navbar/navbar";
// import Footer from "../footer/footer";
// import styles from "./layout.module.css";
// import { Suspense } from "react";
// import Loading from "../loading/loading";
// import { Outlet, useLocation } from "react-router-dom";

// interface LayoutProps {}

// const Layout: React.FC<LayoutProps> = () => {
//   const location = useLocation();
//   const hideFooter = location.pathname === "/resources/blogs";
//   return (
//     <div className={styles.mainContainer}>
//       <Navbar />

//       <div className={styles.childContent}>
//         <Suspense fallback={<Loading />}>
//           <Outlet />
//         </Suspense>
//       </div>

//       {!hideFooter && <Footer />}
//     </div>
//   );
// };

// export default Layout;


import React, { ReactNode } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import styles from "./layout.module.css";
import { Suspense } from "react";
import Loading from "../loading/loading";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideFooter = location.pathname === "/resources/blogs";
  return (
    <div className={styles.mainContainer}>
       <Navbar />
      <div className={styles.childContent}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
