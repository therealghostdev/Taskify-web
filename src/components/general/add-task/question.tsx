import {
  useThemeContext,
  useEditTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";
import { motion } from "framer-motion";

export default function Question() {
  const { darkMode } = useThemeContext();
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreenFunc } = useTrackContext();

  const handleYesClick = () => {
    const updatedTodos = editTodos.map((item) => ({
      ...item,
      completed: true,
    }));

    updateEditTodos(updatedTodos);
    trackScreenFunc("duration");
  };

  const handleNoClick = () => {
    trackScreenFunc("confirm");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
      className={`w-full h-full flex flex-col justify-center items-center relative bg-transparent ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      <div
        className={`w-full h-[400px] flex flex-col justify-center items-center py-6 relative`}
      >
        <h1
          className={`${
            darkMode ? "text-[#ffffff]" : "text-[#000000]"
          } lg:text-3xl md:text-2xl text-xl z-10 font-bold`}
        >
          Did you complete this task?
        </h1>
      </div>

      <div className="flex w-full gap-x-10 my-2">
        <button
          onClick={handleNoClick}
          className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
        >
          NO
        </button>

        <button
          onClick={handleYesClick}
          className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
        >
          YES
        </button>
      </div>
    </motion.div>
  );
}
