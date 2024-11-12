import {
  useTrackContext,
  useEditTodoContext,
  useThemeContext,
  useTodoContext,
  useQueryContext,
} from "../../../utils/app_context/general";
import AddTaskName from "./AddTaskName";
import AddDate from "./AddDate";
import { useEffect, useRef } from "react";
import AddTime from "./AddTime";
import AddPriority from "./AddPriority";
import AddCategory from "./AddCategory";
import Confirm from "./confirm";
import Success from "./success";
import { AnimatePresence } from "framer-motion";
import { updateTasks, createTask } from "../../../api";
import { useMutation, useQueryClient } from "../../../../lib/tanstackQuery";
import { toast } from "react-toastify";
import { Todo } from "../../../utils/types/todo";
import axios from "axios";
import LoadingSpinner from "../../loading/loading1";
import Question from "./question";
import Duration from "./duration";

export default function AddTask() {
  const { todos, updateTodos } = useTodoContext();
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const flowContainerRef = useRef<HTMLDivElement>(null);
  const { darkMode } = useThemeContext();
  const { query, updateQuery } = useQueryContext();

  const customId = "1";
  const notify = (message: string) => {
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });
  };

  const queryParams = (): Todo[] => {
    return query.map((item) => {
      const timeParts = item.expected_date_of_completion
        .split("T")[1]
        .split(":");
      const time = `${timeParts[0]}:${timeParts[1]}`;

      const formattedDate = new Date(
        item.expected_date_of_completion
      ).toLocaleDateString("en-GB");

      return {
        name: item.name,
        description: item.description,
        category: item.category,
        priority: item.priority,
        expected_date_of_completion: formattedDate,
        completed: item.completed,
        createdAt: item.createdAt,
        time: time,
      };
    });
  };

  const validateReqBody = async (data: Todo[]): Promise<unknown> => {
    const validEditTodos = editTodos.filter(
      (item) =>
        item.name !== "" &&
        item.category !== "" &&
        item.createdAt !== "" &&
        item.priority > 0 &&
        item.expected_date_of_completion !== "" &&
        item.time !== "" &&
        item.description !== ""
    );

    const validTodos = todos.filter(
      (item) =>
        item.name !== "" &&
        item.category !== "" &&
        item.priority > 0 &&
        item.expected_date_of_completion !== "" &&
        item.time !== "" &&
        item.description !== ""
    );

    if (validEditTodos.length > 0) {
      await updateTasks(queryParams(), data);
    }

    if (validTodos.length > 0) {
      console.log(validTodos, "is todo");
      await createTask(validTodos);
    }

    if (validEditTodos.length === 0 && validTodos.length === 0) {
      notify("No data to update");
    }

    return Promise.resolve();
  };

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: validateReqBody,
    onSuccess: () => {
      clearState();
      trackScreenFunc("success");
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const message = err.response.data?.message;
        notify(message);
      } else {
        notify("Something went wrong");
        console.log(err);
      }
    },
  });

  const task_update = (data: Todo[]) => {
    console.log(editTodos, "at update request");
    mutate(data);
  };

  const clearState = () => {
    const resetEditTodos = editTodos.map((item) => ({
      ...item,
      name: "",
      category: "",
      description: "",
      priority: 0,
      expected_date_of_completion: "",
      time: "",
      completed: false,
      createdAt: "",
    }));

    updateEditTodos(resetEditTodos);
    updateQuery(resetEditTodos);

    if (trackScreen === "success") {
      const resetTodos = todos.map((item) => ({
        ...item,
        name: "",
        category: "",
        description: "",
        priority: 0,
        expected_date_of_completion: "",
        time: "",
        createdAt: "",
        completed: false,
      }));

      updateTodos(resetTodos);
    }

    trackScreenFunc("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        flowContainerRef.current &&
        !flowContainerRef.current.contains(e.target as Node)
      ) {
        clearState();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editTodos, todos, trackScreen, trackScreenFunc]);

  return [
    "name",
    "calendar",
    "time",
    "priority",
    "category",
    "question",
    "duration",
    "confirm",
    "success",
    "completedAt",
    "completedTime",
  ].includes(trackScreen) && !isPending ? (
    <div
      className={`${
        darkMode ? "dark-overlay" : "light-overlay"
      } fixed top-0 left-0`}
    >
      <div
        ref={flowContainerRef}
        className={`fixed flex justify-center items-center p-4 lg:w-2/4 md:w-3/4 w-full lg:top-16 md:top-52 top-36 left-0 h-auto lg:translate-x-1/2 
        md:translate-x-20 bg-transparent`}
      >
        <AnimatePresence>
          {trackScreen === "name" ? (
            <AddTaskName />
          ) : trackScreen === "calendar" || trackScreen === "completedAt" ? (
            <AddDate />
          ) : trackScreen === "time" || trackScreen === "completedTime" ? (
            <AddTime />
          ) : trackScreen === "priority" ? (
            <AddPriority />
          ) : trackScreen === "category" ? (
            <AddCategory />
          ) : trackScreen === "question" ? (
            <Question />
          ) : trackScreen === "duration" ? (
            <Duration />
          ) : trackScreen === "confirm" ? (
            <Confirm
              request={() =>
                editTodos.length > 0
                  ? task_update(editTodos)
                  : createTask(todos)
              }
            />
          ) : trackScreen === "success" ? (
            <Success />
          ) : (
            ""
          )}
        </AnimatePresence>
      </div>
    </div>
  ) : (
    <div
      className={`fixed flex justify-center items-center p-4 md:h-[400px] min-h-screen lg:w-2/4 md:w-3/4 w-full lg:top-16 md:top-52 top-36 left-0 lg:translate-x-1/2 
        md:translate-x-20 ${darkMode ? "bg-[#000000]" : "bg-[#ffffff]"}`}
    >
      <LoadingSpinner text="updating" />
    </div>
  );
}
