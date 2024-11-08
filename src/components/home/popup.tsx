import {
  DeleteTaskQuery,
  TaskDataType1,
  TaskScreenPropType,
  Todo,
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
import {
  formatDate,
  formatTime,
} from "../../utils/reusable_functions/functions";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { DeleteTask, updateTasks } from "../../api";
import { useMutation, useQueryClient } from "../../../lib/tanstackQuery";
import { AxiosError } from "axios";
import LoadingSpinner2 from "../loading/loading2";
import Timer from "../../assets/timer.svg";

export default function Popup(props: TaskScreenPropType) {
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const popupRef = useRef<HTMLSelectElement | null>(null);
  const { updateQuery } = useQueryContext();
  const [isRoutineBtn, setIsRoutineBtn] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<string>("");
  const [routine_error, setRoutine_error] = useState<string>("");

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
      time: item.expected_completion_time.toString(),
      expected_date_of_completion: item.expected_completion_time.toString(),
    }));
    updateEditTodos(updatedTodos);
    updateQuery(updatedTodos);
    trackScreenFunc("name");
    props.close();
  };

  const makeTaskRoutine = () => {
    setIsRoutineBtn(true);
  };

  const jumpToScreen = (item: string, item2: TaskDataType1) => {
    editTask(item2);
    trackScreenFunc(item);
    props.close();
    console.log(item2);
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

  const handleDelete = () => {
    if (!props.data || props.data.length === 0) {
      notify("No task data available for deletion.");
      return;
    }

    // Create delete params directly
    const deleteParams = props.data.map((item) => ({
      name: item.name,
      priority: item.priority,
      category: item.category,
      description: item.description,
      completed: item.completed,
      createdAt: item.createdAt,
      expected_completion_time: item.expected_completion_time.toString(),
    }));

    mutate({
      isDelete: true,
      data: deleteParams,
    });
  };

  const requestTypehelper = async (
    isDelete: boolean,
    deleteParams?: DeleteTaskQuery[],
    updateParams?: Todo[],
    body?: Todo[]
  ) => {
    if (isDelete && deleteParams) {
      return DeleteTask(deleteParams);
    } else if (!isDelete && updateParams && body) {
      return updateTasks(updateParams, body);
    } else {
      notify("Empty values provided");
    }
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: {
      isDelete: boolean;
      data: DeleteTaskQuery[] | Todo[];
      body?: Todo[];
    }) => {
      const { isDelete, data, body } = payload;
      return requestTypehelper(
        isDelete,
        isDelete ? (data as DeleteTaskQuery[]) : undefined,
        !isDelete ? (data as Todo[]) : undefined,
        !isDelete ? (body as Todo[]) : undefined
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      props.close();
      const cachedData = queryClient.getQueryData<TaskDataType1[]>(["task"]);
      if (!cachedData || cachedData.length === 0) {
        props.refetch();
      }
    },
    onError: (err: AxiosError) => {
      const data = err.response?.data as { message?: string };
      notify(data?.message || "An unexpected error occurred");
    },
  });

  const handleSelectInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setRecurrence(e.target.value);
  };

  const handleAbortBtnClick = () => {
    setIsRoutineBtn(false);
    setRecurrence("");
  };

  const convertTaskToTodo = (task: TaskDataType1): Todo => {
    const [date, time] = task.expected_completion_time.split("T");
    const formattedTime = time.slice(0, 5);

    return {
      name: task.name,
      description: task.description,
      priority: task.priority,
      category: task.category,
      completed: task.completed,
      expected_date_of_completion: new Date(date).toLocaleDateString("en-GB"),
      time: formattedTime,
    };
  };

  const handleContinueBtnClick = (items: TaskDataType1[]) => {
    if (recurrence === "" || !isRoutineBtn) {
      setRoutine_error("Please choose a recurrence option");
      return;
    }

    const todos = items.map(convertTaskToTodo);

    // updated todos with routine info
    const updatedTodos = todos.map((item) => ({
      ...item,
      isRoutine: isRoutineBtn,
      recurrence: recurrence,
    }));

    // query params values
    const queryParams = items.map((item) => {
      const timeParts = item.expected_completion_time.split("T")[1].split(":");
      const time = `${timeParts[0]}:${timeParts[1]}`;

      const formattedDate = new Date(
        item.expected_completion_time
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

    // Update states and make API call
    Promise.all([updateEditTodos(updatedTodos), updateQuery(todos)]).then(
      () => {
        mutate({
          isDelete: false,
          data: queryParams,
          body: updatedTodos,
        });
      }
    );
  };

  return (
    <section
      ref={popupRef}
      className="flex flex-col justify-center items-center rounded-lg lg:w-2/4 md:w-3/4 w-[98%] 
       h-full overflow-auto px-8 py-4"
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
                  <p className="text-lg">Created:</p>
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
                  <span>{formatDate(item.createdAt)}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={timer} alt="time" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Expected Completion Date:</p>
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
                  <span>{formatDate(item.expected_completion_time)}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={timer} alt="time" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Expected Completion Time:</p>
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
                  <span>{formatTime(item.expected_completion_time)}</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
              <div className="flex justify-between items-center w-1/4 mr-4">
                <span className="inline-block w-2/4">
                  <img src={tag} alt="category" />
                </span>

                <span className="inline-block w-2/4">
                  <p className="text-lg">Category:</p>
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
                  <p className="text-lg">Priority:</p>
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

            <div className="flex justify-between items-center w-full my-6">
              <Button
                onClick={handleDelete}
                className="flex justify-between items-center"
                style={{
                  backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                  color: "#FF4949",
                }}
              >
                <Delete className="text-[#FF4949]" />
                <span>Delete Task</span>

                {isPending && <LoadingSpinner2 />}
              </Button>

              <Button
                onClick={makeTaskRoutine}
                className="flex justify-between items-center"
                style={{
                  backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                  color: "green",
                }}
              >
                <img
                  src={Timer}
                  alt="timer"
                  className={`${darkMode ? "" : "filter-invert"} mr-2`}
                />
                <span>
                  {item.isRoutine
                    ? "Remove Task as Routine"
                    : "Make Task A Routine"}
                </span>

                {isPending && <LoadingSpinner2 />}
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

            {isRoutineBtn && (
              <div
                className={`flex flex-col justify-center items-center gap-y-3 h-2/4 lg:w-2/4 w-full fixed top-[20%] lg:left-[25%] 
            left-[2%]
            ${darkMode ? "bg-[#000000fd]" : "bg-[#999999fd]"}`}
              >
                <h1
                  className={`${
                    darkMode ? "text-white" : "text-black"
                  } text-2xl mb-2`}
                >
                  Set Routine Occurence
                </h1>
                <select
                  name="recurrence"
                  id=""
                  onChange={handleSelectInput}
                  className={`py-3 px-3 rounded-md outline-none border-none w-3/4 ${
                    darkMode
                      ? "bg-[#363636] text-white"
                      : "bg-[#bdbdbd] text-black"
                  } ${routine_error !== "" ? "border-red-500" : ""}`}
                >
                  <option value="">Select an occurence</option>
                  <option value="daliy">daily</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                </select>

                {routine_error !== "" && (
                  <small className="text-red-500 text-sm my-2">
                    {routine_error}
                  </small>
                )}
              </div>
            )}

            {isRoutineBtn && recurrence !== "" && (
              <div
                className={`flex flex-col justify-center items-center gap-y-3 h-2/4 lg:w-2/4 w-full fixed top-[20%] lg:left-[25%] 
            left-[2%]
            ${darkMode ? "bg-[#000000fd]" : "bg-[#999999fd]"}`}
              >
                <h1
                  className={`${
                    darkMode ? "text-white" : "text-black"
                  } text-2xl mb-2`}
                >
                  Confirm This action
                </h1>
                <div className="flex w-full gap-x-10 my-2">
                  <button
                    onClick={handleAbortBtnClick}
                    className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
                  >
                    Abort
                  </button>

                  <button
                    onClick={() => handleContinueBtnClick(Array(item))}
                    className="z-10 cursor-pointer bg-[#8687E7] py-6 px-4 w-2/4 h-2/4 text-white flex justify-center items-center"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </section>
    </section>
  );
}
