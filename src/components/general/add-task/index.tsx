import { useEffect, useState } from "react";
import { Popup } from "../../../utils/types/todo";
import {
  // usePopupContext,
  useTrackContext,
  useTodoContext,
} from "../../../utils/app_context/general";
import AddTaskName from "./AddTaskName";
import AddDate from "./AddDate";

export default function AddTask() {
  // const { newTaskPopup, togglePopupState, setNewTaskPopup } = usePopupContext();
  const { todos } = useTodoContext();
  const { trackScreen, trackScreenFunc } = useTrackContext();
  

  return (
    <div
      className={`fixed flex justify-center items-center p-4 lg:w-2/4 md:w-3/4 w-full lg:top-32 md:top-52 top-36 left-0 h-2/4 lg:translate-x-1/2 
  md:translate-x-20 bg-transparent`}
    >
      {trackScreen === "name" ? (
        <AddTaskName />
      ) : trackScreen === "calendar" ? (
        <AddDate />
      ) : (
        ""
      )}
    </div>
  );
}
