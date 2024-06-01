import { TaskDataType, TaskScreenPropType } from "../../utils/types/todo";
import {
  useEditTodoContext,
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
import React, { useEffect } from "react";

export default function Popup(props: TaskScreenPropType) {
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { darkMode } = useThemeContext();
  const { trackScreenFunc, trackScreen } = useTrackContext();

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

  const editTask = (item: TaskDataType) => {
    if (props.data) {
      const updatedTodos = props.data.map((content) => ({
        ...content,
        id: item.id,
        task: item.task_name,
        task_priority: item.task_priority,
        category: item.task_category,
        task_description: item.task_title,
        time: item.completion_time,
        expected_date_of_completion: item.completion_date,
      }));
      updateEditTodos(updatedTodos);

      trackScreenFunc("name");
      props.close();
    }
  };

  const jumpToScreen = (item: string, item2: TaskDataType) => {
    editTask(item2);
    trackScreenFunc(item);
    props.close();
  };

  return (
    <section className="flex flex-col justify-center items-center lg:w-2/4 md:w-3/4 w-full h-full overflow-auto px-8 py-4">
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

      <section className="w-full flex flex-col justify-between relative px-6">
        {props.data?.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between items-center w-full">
              <div className="">
                <h1 className="text-3xl my-4">{item.task_name}</h1>
                <p>{item.task_title}</p>
              </div>

              <div className="">
                <img src={editIcon} alt="edit" />
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
                  style={{
                    backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                    color: "#FFFFFF",
                  }}
                >
                  <span>{formatDate(item.created_at)}</span>
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
                    <img src={getIconRender(item.task_category)} alt="" />
                  </span>

                  <span>{item.task_category}</span>
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
                    <img src={flag} alt={item.task_priority.toString()} />
                  </span>

                  <span>{item.task_priority}</span>
                </Button>
              </div>
            </div>

            <div>
              <Button
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

            <div className="w-full absolute -bottom-28 px-4">
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
