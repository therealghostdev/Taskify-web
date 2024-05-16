import { useEffect, useRef, useState } from "react";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
  useCalendarTodoContext,
} from "../../../utils/app_context/general";
import data from "../../../utils/data/priority_data.json";
import flagIcon from "../../../assets/flag.svg";
import { toast } from "react-toastify";

export default function AddPriority() {
  const { darkMode } = useThemeContext();
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const valueRef = useRef<HTMLSpanElement>(null);
  const [activebtn, setActiveBtn] = useState<number | null>(null);
  const [priority, setPriority] = useState<number>(0);
  const { calendarTodos, updateCalendarTodos } = useCalendarTodoContext();
  const [calendarPriority, setCalendarPriority] = useState<number>(0);

  const notify = (msg: string) =>
    toast(msg, { theme: darkMode ? "dark" : "light" });

  // check if calendar priority value isn't empty
  const getCalendarPriorityValue = () => {
    calendarTodos.map((item) => {
      if (item.task_priority !== 0) {
        setPriority(item.task_priority);
      }
    });
  };

  const handleSave = () => {
    if (calendarPriority !== 0) {
      const updatedTodo = calendarTodos.map((item) => ({
        ...item,
        task_priority: priority,
      }));
      updateCalendarTodos(updatedTodo);
      trackScreenFunc("category");
    } else {
      const updatedTodo = todos.map((item) => ({
        ...item,
        task_priority: priority,
      }));

      updateTodos(updatedTodo);
      todos.map(() => {
        if (priority === 0) {
          return notify("Add task priority");
        } else {
          trackScreenFunc("category");
        }
      });
    }
  };

  const priorityBtnClick = (index: number) => {
    setPriority(index + 1);
    setActiveBtn(index);
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  useEffect(() => {
    getCalendarPriorityValue();
    priorityBtnClick(priority);
  }, []);

  useEffect(() => {
    calendarTodos.map((item) => {
      if (item.task_priority !== 0) {
        setCalendarPriority(priority);
      }
    });
  }, [priority]);

  return (
    <div
      className={`w-full lg:h-[400px] h-full flex flex-col justify-center items-center gap-2 ${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      }`}
    >
      <div className="w-full border-b-[#ffffff] border-b flex justify-center items-center py-4 px-2 mb-4">
        <h1 className="text-lg">Task Priority</h1>
      </div>

      <div className="w-full flex flex-wrap lg:overflow-y-auto lg:h-[200px] h-auto custom-scrollbar items-center px-4 py-2">
        {data.map((item, index) => (
          <button
            onClick={() => priorityBtnClick(index)}
            key={index}
            className={`${
              activebtn === index ? "bg-[#8687E7]" : ""
            } bg-[#272727] hover:bg-[#8687E7] text-white flex flex-col items-center m-2 px-4 py-2 md:w-[100px] w-[60px] cursor-pointer`}
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
