import {
//   usePopupContext,
  useTodoContext,
  useThemeContext,
  useTrackContext,
} from "../../../utils/app_context/general";
import Timer from "../../../assets/timer.svg";
import tag from "../../../assets/tag.svg";
import flag from "../../../assets/flag.svg";
import send from "../../../assets/send.svg";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { formValueTypes } from "../../../utils/types/todo";

export default function AddTaskName() {
//   const { newTaskPopup, togglePopupState } = usePopupContext();
  const { todos, updateTodos } = useTodoContext();
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const { darkMode } = useThemeContext();
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  const [formValues, setFormValues] = useState<formValueTypes>({
    taskname: "",
    taskdescription: "",
  });

  const [error, setError] = useState("");

  const validateInputs = () => {
    let error = false;
    if (formValues.taskname === "" || formValues.taskdescription === "") {
      error = true;
    }

    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInputs()) {
      setError("Form field(s) invalid");
      if (formValues.taskname === "") {
        input1Ref.current?.focus();
      } else if (formValues.taskdescription === "") {
        input2Ref.current?.focus();
      } else {
      }
    } else {
      setError("");

      // Update all todos with the new values
      const updatedTodos = todos.map((todo) => ({
        ...todo,
        task: formValues.taskname,
        task_description: formValues.taskdescription,
      }));

      // Set the updated todos back to the context
      updateTodos(updatedTodos);
      trackScreenFunc("calendar");
    }
  };

  return (
    <div
      className={`w-full h-full ${
        darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
      } px-4 py-2 flex flex-col justify-around`}
    >
      <h1
        className={`${darkMode ? "text-[#ffffff]" : "text-[#000000]"} text-2xl`}
      >
        Add New Task
      </h1>

      <form className="w-full flex justify-between flex-col">
        <div className="w-full my-2">
          <label htmlFor="task-name" hidden></label>
          <input
            ref={input1Ref}
            type="text"
            placeholder="Task name"
            id="task-name"
            onChange={handleChange}
            name="taskname"
            value={formValues.taskname}
            className={`border-[#ffffff] rounded-sm w-3/4 ${
              darkMode
                ? "bg-[#363636] text-[#AFAFAF] focus:outline-[#ffffff]"
                : "bg-[#bdbdbd] text-[#000000] focus:outline-[#000000]"
            } border-none outline-none
            px-4 py-2`}
          />
        </div>

        <div className="w-full my-2">
          <label htmlFor="task-description" hidden></label>
          <input
            ref={input2Ref}
            type="text"
            placeholder="Task description"
            id="task-description"
            name="taskdescription"
            onChange={handleChange}
            value={formValues.taskdescription}
            className={`border-[#ffffff] rounded-sm w-3/4 border-none outline-none  ${
              darkMode
                ? "bg-[#363636] text-[#AFAFAF] focus:outline-[#ffffff]"
                : "bg-[#bdbdbd] text-[#000000] focus:outline-[#000000]"
            } px-4 py-2`}
          />
        </div>
        {error !== "" && (
          <small className={darkMode ? "text-[#8687E7]" : "text-[#4042bd]"}>
            {error}
          </small>
        )}

        <div className="w-full flex justify-center items-center my-4">
          <div className="flex items-center w-3/4">
            <button className="mr-12">
              <img
                src={Timer}
                alt="timer"
                className={darkMode ? "" : "filter-invert"}
              />
            </button>

            <button className="mr-12">
              <img
                src={tag}
                alt="category"
                className={darkMode ? "" : "filter-invert"}
              />
            </button>

            <button className="mr-12">
              <img
                src={flag}
                alt="priority"
                className={darkMode ? "" : "filter-invert"}
              />
            </button>
          </div>

          <div className="w-1/4 flex justify-center items-center">
            <button onClick={handleSubmit}>
              <img
                src={send}
                alt="send"
                className={darkMode ? "" : "filter-invert"}
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
