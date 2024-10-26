import {
  TaskDataType1,
  TaskScreenPropType,
} from "../../utils/types/todo";
import {
  useEditTodoContext,
  useQueryContext,
  useThemeContext,
  useTrackContext,
} from "../../utils/app_context/general";
import Close from "@mui/icons-material/Close";
import { Refresh, Delete } from "@mui/icons-material";
import { Button } from "@mui/material";
import editIcon from "../../assets/edit.svg";
import timer from "../../assets/timer.svg";
import tag from "../../assets/tag.svg";
import groceryIcon from "../../assets/grocery.svg";
import workIcon from "../../assets/briefcase.svg";
import sportIcon from "../../assets/sport.svg";

import designIcon from "../../assets/design.svg";
import universityIcon from "../../assets/education.svg";
import socialIcon from "../../assets/social.svg";
import musicIcon from "../../assets/music.svg";
import healthIcon from "../../assets/heartbeat.svg";
import movieIcon from "../../assets/video-camera.svg";
import homeIcon from "../../assets/home.svg";
import addIcon from "../../assets/add.svg";
import flag from "../../assets/flag.svg";
import { formatDate } from "../../utils/reusable_functions/functions";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Popup(props: TaskScreenPropType) {
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const popupRef = useRef<HTMLSelectElement | null>(null);
  const { updateQuery } = useQueryContext();

  const getIconRender = (item: string) => {
    let icon;
    switch (item) {
      case "Grocery":
        icon = groceryIcon;
        break;
      case "Work":
        icon = workIcon;
        break;
      case "Sports":
        icon = sportIcon;
        break;
      case "Design":
        icon = designIcon;
        break;
      case "University":
        icon = universityIcon;
        break;
      case "Social":
        icon = socialIcon;
        break;
      case "Music":
        icon = musicIcon;
        break;
      case "Health":
        icon = healthIcon;
        break;
      case "Movie":
        icon = movieIcon;
        break;
      case "Home":
        icon = homeIcon;
        break;
      default:
        icon = addIcon;
        break;
    }
    return icon;
  };

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const editTask = (item: TaskDataType1) => {
    const updatedTodos = editTodos.map((content) => ({
      ...content,
      id: item._id,
      name: item.name,
      priority: item.priority,
      category: item.category,
      description: item.description,
      completed: item.completed,
      createdAt: item.createdAt,
      time: item.createdAt.toString(),
      expected_date_of_completion: item.expected_completion_time.toString(),
    }));
    updateEditTodos(updatedTodos);
    updateQuery(updatedTodos);
    trackScreenFunc("name");
    props.close();
  };

  const jumpToScreen = (item: string, item2: TaskDataType1) => {
    editTask(item2);
    trackScreenFunc(item);
    props.close();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef && !popupRef.current?.contains(e.target as Node)) {
        props.close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section
      ref={popupRef}
      className="flex flex-col justify-center items-center rounded-lg lg:w-2/4 md:w-3/4 w-[98%] h-full overflow-auto px-8 py-4"
    >
      <section className="w-full flex justify-between">
        <div>
          <Button onClick={props.close}>
            <Close className={`${darkMode ? "text-white" : "text-black"}`} />
          </Button>
        </div>

        <div>
          <Button>
            <Refresh className={`${darkMode ? "text-white" : "text-black"}`} />
          </Button>
        </div>
      </section>

      <section className="w-full flex flex-col justify-between relative md:px-6">
        {props.data?.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h1 className="text-3xl my-4">{item.name}</h1>
                <p>{item.description}</p>
              </div>

              <div className="">
                <Button
                  onClick={() => jumpToScreen("name", item)}
                  className="flex justify-between items-center"
                  style={{
                    backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                    color: "#FFFFFF",
                  }}
                >
                  <img src={editIcon} alt="edit" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={timer} alt="time" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Task Time:</p>
                </span>
              </div>

              <div className="w-3/4 flex justify-end">
                <Button
                  className="flex justify-between items-center"
                  onClick={() => jumpToScreen("time", item)}
                  style={{
                    backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                    color: "#FFFFFF",
                  }}
                >
                  <span>{formatDate(item.createdAt)}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={tag} alt="category" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Task Category:</p>
                </span>
              </div>

              <div className="w-3/4 flex justify-end">
                <Button
                  onClick={() => jumpToScreen("category", item)}
                  className="flex justify-between items-center"
                  style={{
                    backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                    color: "#FFFFFF",
                  }}
                >
                  <span className="mx-2">
                    <img src={getIconRender(item.category)} alt="" />
                  </span>

                  <span>{item.category}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={flag} alt="priority" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Task Priority:</p>
                </span>
              </div>

              <div className="w-3/4 flex justify-end">
                <Button
                  onClick={() => jumpToScreen("priority", item)}
                  className="flex justify-between items-center"
                  style={{
                    backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                    color: "#FFFFFF",
                  }}
                >
                  <span className="mx-2">
                    <img src={flag} alt={item.priority.toString()} />
                  </span>

                  <span>{item.priority}</span>
                </Button>
              </div>
            </div>

            <div>
              <Button
                onClick={() => notify("coming soon")}
                className="flex justify-between items-center"
                style={{
                  backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                  color: "#FF4949",
                }}
              >
                <Delete className="text-[#FF4949]" />
                <span>Delete Task</span>
              </Button>
            </div>

            <div className="w-full absolute -bottom-28 px-4 py-6">
              <Button
                onClick={() => editTask(item)}
                className="flex justify-center items-center w-full"
                style={{
                  backgroundColor: "#8687E7",
                  color: "#FFFFFF",
                  padding: "3% 0%",
                }}
              >
                Edit Task
              </Button>
            </div>
          </React.Fragment>
        ))}
      </section>
    </section>
  );
}
