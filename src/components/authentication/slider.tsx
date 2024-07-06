import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import sliderData from "../../utils/data/slider_data.json";
import { SliderItem } from "../../utils/types/todo";

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 6000);
  };

  useEffect(() => {
    if (!isPaused) {
      startInterval();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const prevIndex = (currentIndex - 1 + sliderData.length) % sliderData.length;

  return (
    <div
      className="w-full px-8 py-6 flex flex-col h-full lg:justify-around justify-center items-center gap-6 bg-cover bg-center transition-all duration-500 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{
          backgroundImage: `url(${
            (sliderData[prevIndex] as SliderItem).image
          })`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col lg:justify-around justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-2/4 h-2/4 rounded-full"
          >
            <img
              src={(sliderData[currentIndex] as SliderItem).image}
              alt="slider"
              className="lg:w-80 lg:h-80 w-60 h-40 rounded-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
        <div className="max-w-2/4 flex flex-col justify-center items-center gap-y-6">
          <h1 className="text-2xl font-bold">
            {(sliderData[currentIndex] as SliderItem).description}
          </h1>
          <p className="text-lg font-light text-wrap text-center">
            {(sliderData[currentIndex] as SliderItem).highlight}
          </p>
        </div>
      </div>
    </div>
  );
}
