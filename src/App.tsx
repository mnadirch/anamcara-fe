import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/layout/layout";
import Blog from "./pages/blog/blog";
const Main = lazy(() => import("./pages/main/main"));
const StartUpPage = lazy(() => import("./components/startup/startup"));
const Home = lazy(() => import("./pages/home/home"));
const CommingSoon = lazy(() => import("./components/commingSoon/commingsoon"));
const ReachOut = lazy(() => import("./components/reachout/reachout"));
// const PageNotFound = lazy(
//   () => import("./components/pagenotfound/pagenotfound"));
const OurSolution = lazy(() => import("./pages/ourSolutions/oursolution"));
const Features = lazy(() => import("./pages/features/features"));
const Resources = lazy(() => import("./pages/resources/resources"));
const About = lazy(() => import("./pages/about/about"));
import Loading from "./components/loading/loading";
import styles from "./components/layout/layout.module.css";
import Dashboard from "./components/Dashboard/dashbaord";
import FluidClock from "./components/commingSoon/SpiralLoader";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyEmail from "./components/auth/VerifyEmail";
import AuthCallback from './components/auth/AuthCallback';
import { ChatProvider } from './components/context/ChatContext';
import BlogDashboard from './components/blog_dashboard/BlogDashboard';
import BlogRoutes from './Routes/BlogRoutes';
import NotFound from './components/NotFound';

// import { ChatProvider } from '../src/components/context/ChatContext'; // ✅ Add this

// const withSuspense = (component: JSX.Element) => (
//   <Suspense fallback={<Loading />}>{component}</Suspense>
// );

// const appRouter = createBrowserRouter([
//   {
//     path: "/dashboard/blogs",
//     element: (
//       <ProtectedRoute requiredRole="superadmin">
//         <BlogDashboard />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: "/auth",
//     element: <Layout />,
//     errorElement: withSuspense(<PageNotFound />),
//     children: [
//       { path: "login", element: withSuspense(<LoginForm />) },
//       { path: "register", element: withSuspense(<RegisterForm />) },
//       { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
//       { path: "reset-password", element: withSuspense(<ResetPassword />) },
//       { path: "verify", element: withSuspense(<VerifyEmail />) },
//       { path: "callback", element: withSuspense(<AuthCallback />) },
//     ],
//   },
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: withSuspense(<PageNotFound />),
//     children: [
//       { path: "", element: withSuspense(<Main />) },
//       { path: "StartUpPage", element: withSuspense(<StartUpPage />) },
//       { path: "clock", element: withSuspense(<FluidClock />)},
//       { path: "home", element: withSuspense(<Home />) },
//       { path: "ai-robotics", element: withSuspense(<CommingSoon />) },
//       { path: "solutions", element: withSuspense(<OurSolution />) },
//       { path: "features", element: withSuspense(<Features />) },
//       { path: "resources", element: withSuspense(<Resources />) },
//       { path: "about", element: withSuspense(<About />) },
//       { path: "reachout", element: withSuspense(<ReachOut />) },
//       {
//         path: "membership",
//         element: (
//           <ProtectedRoute requiredRole="user">
//             <ChatProvider>
//               <Dashboard />
//             </ChatProvider>
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "resources/blog",
//         element: withSuspense(
//           <Layout>
//             <Blog />
//           </Layout>
//         ),
//       },
//     ],
//   },
// ]);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/register" element={<RegisterForm />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/"
            element={
              <Suspense>
                <Main />
              </Suspense>
            }
          />
          <Route
            path="/StartUpPage"
            element={
              <div className={styles.childContent}>
                <Suspense fallback={<Loading />}>
                  <StartUpPage />
                </Suspense>
              </div>
            }
          />
          <Route>
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/ai-robotics"
              element={
                <Layout>
                  <CommingSoon />
                </Layout>
              }
            />

            <Route
              path="/solutions"
              element={
                <Layout>
                  <OurSolution />
                </Layout>
              }
            />

            <Route
              path="/membership"
              element={
                <ProtectedRoute requiredRole="user">
                  <ChatProvider>
                    <Dashboard />
                  </ChatProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/clock"
              element={
                <FluidClock />
              }
            />

            <Route
              path="/features"
              element={
                <Layout>
                  <Features />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/resources"
              element={
                <Layout>
                  <Resources />
                </Layout>
              }
            />
            <Route
              path="/reachout"
              element={
                <Layout>
                  <ReachOut />
                </Layout>
              }
            />
          </Route>

          <Route
            path="/dashboard/blogs"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <BlogDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources/blogs"
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />

          {BlogRoutes()}

          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;