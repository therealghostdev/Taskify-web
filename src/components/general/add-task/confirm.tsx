import TodoIcon from "../../../assets/todo-list.svg";
import { motion } from "framer-motion";
import {
  useThemeContext,
  useTrackContext,
  useTodoContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import { ConfirmPropTypes } from "../../../utils/types/todo";

export default function Confirm(props: ConfirmPropTypes) {
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const { todos, updateTodos } = useTodoContext();
  const { editTodos, updateEditTodos } = useEditTodoContext();

  const cancelBtnClick = () => {
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
      className={`w-full h-full flex flex-col justify-center items-center relative bg-transparent ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
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
        <h1 className="text-[#000000] lg:text-3xl md:text-2xl text-xl z-10 font-bold">
          Confirm Action
        </h1>
      </div>

      <div className="flex w-full gap-x-10 my-2">
        <button
          onClick={cancelBtnClick}
          className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
        >
          Abort
        </button>

        <button
          onClick={props.request}
          className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
        >
          Confirm
        </button>
      </div>
    </motion.div>
  );
}
