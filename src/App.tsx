import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Homepage from "./pages/homepage";
import Nav from "./components/general/navigation";
import Auth from "./pages/auth";
import Calendar from "./pages/calendar";
import Focus from "./pages/focus_page";
import Profile from "./pages/profile";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route element={<Auth />} index path="/auth" />
          <Route element={<Homepage />} path="/" />
          <Route element={<Calendar />} path="/calendar" />
          <Route element={<Focus />} path="/focus" />
          <Route element={<Profile />} path="/page3" />
          {/* <Route element={<Page4 />} path="/page4" /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
