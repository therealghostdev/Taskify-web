import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Homepage from "./pages/homepage";
import Nav from "./components/general/navigation/navigation";
import Auth from "./pages/auth";
import Calendar from "./pages/calendar";
import Focus from "./pages/focus_page";
import Profile from "./pages/profile";
import {
  useThemeContext,
  useAuthContext,
  useTrackContext,
} from "./utils/app_context/general";
import { useEffect } from "react";
import { ProtectedRouteProps } from "./utils/types/todo";
import AddTask from "./components/general/add-task";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";
import Apptool from "./components/app_tools";
import NotFound from "./pages/not_found";

function App() {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const { authenticated } = useAuthContext();
  const { trackScreen } = useTrackContext();
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      toggleDarkMode(event.matches);
    };
    prefersDarkMode.addEventListener("change", listener);
    return () => {
      prefersDarkMode.removeEventListener("change", listener);
    };
  }, [toggleDarkMode]);

  return (
    <main
      className={`${
        darkMode ? "dark-theme" : "light-theme"
      } w-screen min-h-screen`}
    >
      <Router>
        {authenticated && <Nav />}
        {authenticated &&
          [
            "name",
            "calendar",
            "time",
            "priority",
            "category",
            "success",
            "question",
            "duration",
            "confirm",
            "completedAt",
            "completedTime"
          ].includes(trackScreen) && <AddTask />}

        {authenticated && <Apptool />}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/focus"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Focus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute authenticated={authenticated} redirectTo="/auth">
                <Profile />
              </ProtectedRoute>
            }
          />
          {!authenticated && <Route path="/auth" element={<Auth />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer autoClose={5000} hideProgressBar={false} />
    </main>
  );
}

function ProtectedRoute({
  authenticated,
  redirectTo,
  children,
}: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) {
      navigate(redirectTo);
    }
  }, [authenticated, redirectTo, navigate]);

  return authenticated ? <>{children}</> : null;
}

export default App;
