import {
  useTodoContext,
  useThemeContext,
  useTrackContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import Timer from "../../../assets/timer.svg";
import tag from "../../../assets/tag.svg";
import flag from "../../../assets/flag.svg";
import send from "../../../assets/send.svg";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { formValueTypes } from "../../../utils/types/todo";
import { motion } from "framer-motion";

export default function AddTaskName() {
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const { darkMode } = useThemeContext();
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const { editTodos, updateEditTodos } = useEditTodoContext();

  // update values in edit todo state
  const [editTaskname, setEditTaskname] = useState<formValueTypes>({
    taskname: "",
    taskdescription: "",
  });

  // form input
  const [formValues, setFormValues] = useState<formValueTypes>({
    taskname: "",
    taskdescription: "",
  });

  const [error, setError] = useState("");

  // checks if there's date in calendar page state.
  const getTaskDetailsformTodoState = () => {
    editTodos.map((item) => {
      if (item.task !== "" || item.task_description !== "") {
        setEditTaskname((prev) => ({
          ...prev,
          taskname: item.task,
          taskdescription: item.task_description,
        }));
      }
    });
  };

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

      // checks if calendar page was interacted with and state has been populated before Update all todos with the new values
      if (editTaskname.taskname === "" || editTaskname.taskdescription === "") {
        const updatedTodos = todos.map((todo) => ({
          ...todo,
          task: formValues.taskname,
          task_description: formValues.taskdescription,
        }));

        // Set the updated todos back to the context
        updateTodos(updatedTodos);
        trackScreenFunc("calendar");
      } else {
        const updatedCalendarTodos = editTodos.map((item) => ({
          ...item,
          task: formValues.taskname,
          task_description: formValues.taskdescription,
        }));

        updateEditTodos(updatedCalendarTodos);
        trackScreenFunc("calendar");
      }
    }
  };

  const containerRefClickHandler = (e: any) => {
    e.preventDefault();
    const target = e.target;

    // Check if the clicked element is an img element
    if (target.tagName === "IMG") {
      const alt = target.alt;
      // set screen
      if (alt === "timer") {
        trackScreenFunc("calendar");
      } else {
        trackScreenFunc(alt);
      }
    }
  };

  useEffect(() => {
    getTaskDetailsformTodoState();
  }, []);

  // populates inputs if calendar page state is not empty
  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      taskdescription: editTaskname.taskdescription,
      taskname: editTaskname.taskname,
    }));
  }, [editTaskname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
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
          <div
            className="flex items-center w-3/4"
            ref={buttonContainerRef}
            onClick={containerRefClickHandler}
          >
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

            <button className="mr-12" aria-label="send">
              <img src={flag} alt="priority" />
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
    </motion.div>
  );
}
