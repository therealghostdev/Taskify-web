import TodoIcon from "../../../assets/todo-list.svg";
import {
  useThemeContext,
  useTrackContext,
  useTodoContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import SuccessIcon from "../../../assets/success.svg";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

export default function Success() {
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const { todos, updateTodos } = useTodoContext();
  const { editTodos, updateEditTodos } = useEditTodoContext();

  const closeBtnClick = () => {
    trackScreenFunc("");

    const reset = todos.map((item) => ({
      ...item,
      task: "",
      category: "",
      task_description: "",
      task_priority: 0,
      expected_date_of_completion: "",
      time: "",
    }));

    updateTodos(reset);

    const reset2 = editTodos.map((item) => ({
      ...item,
      task: "",
      category: "",
      task_description: "",
      task_priority: 0,
      expected_date_of_completion: "",
      time: "",
    }));

    updateEditTodos(reset2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
      className={`w-full h-full flex justify-center items-center relative bg-transparent ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      <button
        onClick={closeBtnClick}
        className="z-10 cursor-pointer bg-[#8687E7] w-8 h-8 rounded-full text-white flex justify-center items-center absolute top-0 right-0"
      >
        <CloseIcon />
      </button>
      <div
        className={`w-full h-[400px] flex flex-col justify-center items-center py-6 relative`}
      >
        <div className="w-full h-full flex justify-center absolute -top-2">
          <img
            src={TodoIcon}
            alt="todo icon"
            width={100}
            height={100}
            className={`w-2/4 h-full`}
          />
        </div>
        <div className="w-full h-full flex justify-center absolute -bottom-20">
          <img
            src={SuccessIcon}
            alt="success icon"
            width={100}
            height={100}
            className={`w-1/4 h-full`}
          />
        </div>
        <p className="z-50 text-[#8687E7] font-bold text-3xl">Successful</p>
      </div>
    </motion.div>
  );
}
