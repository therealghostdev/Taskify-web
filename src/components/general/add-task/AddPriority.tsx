import { useRef } from "react";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";
import data from "../../../utils/data/priority_data.json";
import flagIcon from "../../../assets/flag.svg";

export default function AddPriority() {
  const { darkMode } = useThemeContext();
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const valueRef = useRef<HTMLSpanElement>(null);

  const handleSave = () => {
    console.log(valueRef.current?.textContent);

    const updatedTodo = todos.map((item) => ({
      ...item,
      task_priority: Number(valueRef.current?.textContent),
    }));

    updateTodos(updatedTodo);
    trackScreenFunc("category");
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  return (
    <div
      className={`w-full lg:h-[400px] overflow-y-auto h-full flex flex-col justify-center items-center gap-2 ${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      }`}
    >
      <div className="w-full border-b-[#ffffff] border-b flex justify-center items-center py-4 px-2 mb-4">
        <h1 className="text-lg">Task Priority</h1>
      </div>

      <div className="w-full flex flex-wrap items-center px-4 py-2">
        {data.map((item, index) => (
          <button
            key={index}
            className="bg-[#272727] hover:bg-[#8687E7] text-white flex flex-col items-center m-2 px-4 py-2 md:w-[100px] w-[60px] cursor-pointer"
          >
            <span>
              <img src={(item.icon = flagIcon)} alt="priority-icon" />
            </span>
            <span ref={valueRef}>{item.priority_value}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center w-full">
        <button
          onClick={cancel}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Save
        </button>
      </div>
    </div>
  );
}
