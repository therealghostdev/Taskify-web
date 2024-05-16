import {
  useTrackContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import AddTaskName from "./AddTaskName";
import AddDate from "./AddDate";
import { useEffect, useRef } from "react";
import AddTime from "./AddTime";
import AddPriority from "./AddPriority";
import AddCategory from "./AddCategory";
import Success from "./success";

export default function AddTask() {
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const flowContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        flowContainerRef.current &&
        !flowContainerRef.current.contains(e.target as Node)
      ) {
        trackScreenFunc("");
        const reset = editTodos.map((item) => ({
          ...item,
          task: "",
          category: "",
          task_description: "",
          task_priority: 0,
          expected_date_of_completion: "",
          time: "",
        }));

        updateEditTodos(reset);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    ["name", "calendar", "time", "priority", "category", "success"].includes(
      trackScreen
    ) && (
      <div
        ref={flowContainerRef}
        className={`fixed flex justify-center items-center p-4 lg:w-2/4 md:w-3/4 w-full lg:top-16 md:top-52 top-36 left-0 h-auto lg:translate-x-1/2 
        md:translate-x-20 bg-transparent`}
      >
        {trackScreen === "name" ? (
          <AddTaskName />
        ) : trackScreen === "calendar" ? (
          <AddDate />
        ) : trackScreen === "time" ? (
          <AddTime />
        ) : trackScreen === "priority" ? (
          <AddPriority />
        ) : trackScreen === "category" ? (
          <AddCategory />
        ) : trackScreen === "success" ? (
          <Success />
        ) : (
          ""
        )}
      </div>
    )
  );
}
