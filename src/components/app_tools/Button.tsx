import { Fab } from "@mui/material";
import { Build, Clear } from "@mui/icons-material";
import React, { useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  display?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, display }) => {
  const displayIcon = (
    <div className="contents">
      <div
        className={`absolute transition-opacity duration-500 ${
          display ? "opacity-100" : "opacity-0"
        }`}
      >
        <Build />
      </div>
      <div
        className={`absolute transition-opacity duration-500 ${
          display ? "opacity-0" : "opacity-100"
        }`}
      >
        <Clear fontSize="large" />
      </div>
    </div>
  );

  const iconSize = 50;

  const x = useMotionValue(window.innerWidth - iconSize);
  const y = useMotionValue(window.innerHeight * 0.8);

  useEffect(() => {
    const handleResize = () => {
      x.set(window.innerWidth - iconSize);
      y.set(window.innerHeight * 0.8);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [x, y]);

  const handleDragEnd = () => {
    const { innerWidth, innerHeight } = window;
    const distanceToLeft = x.get();
    const distanceToRight = innerWidth - distanceToLeft - iconSize;
    const distanceToTop = y.get();
    const distanceToBottom = innerHeight - y.get() - iconSize;

    const minDistance = Math.min(
      distanceToLeft,
      distanceToRight,
      distanceToTop,
      distanceToBottom
    );

    if (minDistance === distanceToLeft) {
      x.set(0);
    } else if (minDistance === distanceToRight) {
      x.set(innerWidth - iconSize);
    } else if (minDistance === distanceToTop) {
      y.set(0);
    } else if (minDistance === distanceToBottom) {
      y.set(innerHeight - iconSize);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        left: -innerWidth + iconSize,
        right: 0,
        top: -innerHeight + iconSize + iconSize + 10,
        bottom: 0,
      }}
      onDragEnd={handleDragEnd}
      style={{
        position: "fixed",
        top: y,
        left: x,
        cursor: "grab",
        zIndex: 1000,
      }}
      onClick={onClick}
    >
      <Fab
        color="primary"
        aria-label="tools"
        sx={{ transition: "ease-in-out" }}
      >
        {displayIcon}
      </Fab>
    </motion.div>
  );
};

export default Button;
