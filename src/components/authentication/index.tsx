import { useEffect, useState, useRef } from "react";
import Login from "./Login";
import Register from "./Register";
import Slider from "./slider";
import { Button } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useThemeContext } from "../../utils/app_context/general";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { AnimatePresence, motion } from "framer-motion";

export default function Index() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const { darkMode } = useThemeContext();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 150),
        y: Math.min(prev.y, window.innerHeight - 50),
      }));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loginSwap = () => {
    setIsLogin(!isLogin);
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: Math.max(0, Math.min(touch.clientX, window.innerWidth - 150)),
        y: Math.max(0, Math.min(touch.clientY, window.innerHeight - 50)),
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex md:flex-row flex-col justify-center items-center w-full md:h-screen md:overflow-y-hidden">
      <div className="md:w-2/4 w-full md:max-h-full h-screen flex flex-col justify-center items-center">
        <Slider />
      </div>
      {!isMobile ? (
        isLogin ? (
          <Login registerSwap={loginSwap} />
        ) : (
          <Register loginSwap={loginSwap} />
        )
      ) : (
        <>
          <motion.div
            ref={draggableRef}
            drag
            dragConstraints={draggableRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
              touchAction: "none",
              cursor: "move",
              zIndex: 1000,
              transition: isDragging ? "none" : "all 0.3s ease",
            }}
          >
            <Button
              style={{ backgroundColor: "#8687e7", color: "#ffffff" }}
              variant="contained"
              onClick={handleClick}
              startIcon={<DragIndicatorIcon />}
            >
              Login/Register
            </Button>
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className={`fixed inset-0 z-50 flex items-center justify-center w-full ${
                  darkMode ? "dark-theme" : "light-theme"
                }`}
              >
                <div className="p-4 rounded-lg">
                  <Button onClick={handleClose}>
                    <ArrowBackIosIcon
                      style={{ color: darkMode ? "#fff" : "#000" }}
                    />
                  </Button>
                  {isLogin ? (
                    <AnimatePresence>
                      {isLogin && <Login registerSwap={loginSwap} />}
                    </AnimatePresence>
                  ) : (
                    <AnimatePresence>
                      {!isLogin && <Register loginSwap={loginSwap} />}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
