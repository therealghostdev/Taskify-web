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
import flagIcon from "../../assets/flag.svg";

import noItem from "../../assets/Checklist-rafiki 1.svg";
import userData from "../../utils/data/user_data.json";
import defaultImg from "../../assets/default-profile.png";
import filterIcon from "../../assets/filter-icon.svg";
import { useThemeContext } from "../../utils/app_context/general";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, useRef } from "react";
import { TaskDataType1 } from "../../utils/types/todo";
import {
  getDefaultBgColor,
  formatDate,
} from "../../utils/reusable_functions/functions";
import { Button, Menu, MenuItem } from "@mui/material";
import { CleaningServicesTwoTone } from "@mui/icons-material";
import { ArrowDropDown } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import Popup from "./popup";
import { getAllTasks } from "../../api";
import { useQuery } from "../../../lib/tanstackQuery";
import LoadingSpinner from "../loading/loading1";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { queryParam } from "../../utils/reusable_functions/functions";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [width] = useState<number>(window.innerWidth);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const [filteredData, setFilteredData] = useState<TaskDataType1[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTask, setSearchTask] = useState<string>("");
  const [taskScreen, setTaskScreen] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [taskScreenData, setTaskScreenData] = useState<TaskDataType1[] | null>(
    null
  );
  const [taskValues, setTaskValues] = useState<TaskDataType1[]>([]);

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const { isLoading, data, error, refetch, isFetching } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const currentDate = new Date();
      const localDateString = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

      return await getAllTasks(queryParam(localDateString));
    },
    staleTime: 60000,
  });

  useEffect(() => {
    if (error && error instanceof AxiosError) {
      if (error.status === 404) {
        setTaskValues([]);
      } else {
        if (error.response && error.response.data) {
          const data = error.response.data as { message?: string };
          notify(data.message || "An unexpected error occurred");
        } else {
          notify("Network error or no response from the server.");
        }
      }
    } else {
      if (error?.message === "task not found") {
        setTaskValues([]);
      }
    }
  }, [error]);

  useEffect(() => {
    setTaskValues(data?.data?.data);
  }, [data]);

  useEffect(() => {
    setIsMobileView(width < 768);
  }, [width]);

  const showInputOnMobileDevices = () => {
    setDisplayInput(!displayInput);
  };

  useEffect(() => {
    const clickOutsideinputContainer = (e: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target as Node)
      ) {
        setDisplayInput(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideinputContainer);

    return () => {
      document.removeEventListener("mousedown", clickOutsideinputContainer);
    };
  }, []);

  const reset = () => {
    setFilteredData([]);
    setIsFiltered(false);

    if (searchTask.length > 0 || searchTask === " ") {
      setSearchTask("");
    }
  };

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

  useEffect(() => {
    const searchItem = () => {
      if (taskValues && taskValues.length > 0) {
        const filtered = taskValues.filter((item: TaskDataType1) =>
          item.name.toLowerCase().includes(searchTask.toLowerCase())
        );
        setFilteredData(filtered);
      }
    };

    searchItem();
  }, [searchTask, data]);

  const handleMenuButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (category: string) => {
    if (!taskValues || taskValues.length === 0) return;

    let filtered: TaskDataType1[];

    if (category === "Completed") {
      filtered = taskValues.filter((item) => item.completed === true);
    } else if (category === "Priority less than 5") {
      filtered = taskValues.filter((item) => item.priority < 5);
    } else if (category === "Priority greater than 5") {
      filtered = taskValues.filter((item) => item.priority > 5);
    } else if (category === "All") {
      reset();
      handleMenuClose();
      return;
    } else {
      filtered = [...taskValues];
      reset();
      handleMenuClose();
    }

    setFilteredData(filtered);
    setIsFiltered(true);
    handleMenuClose();
  };

  // Popup functions
  const closePopup = () => {
    setTaskScreen(false);
    setTaskScreenData(null);
  };

  const getTaskData = (item: TaskDataType1[]) => {
    setTaskScreenData(item);
    setTaskScreen(true);
  };
  // End of popup functions

  const tasksToDisplay = isFiltered ? filteredData : taskValues;
  const loading = isLoading || isFetching;

  return (
    <section
      className={`flex flex-col px-6 py-3 ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {taskScreen && (
        <div
          className={`flex items-center justify-center ${
            taskScreen
              ? darkMode
                ? "dark-overlay fixed top-0 left-0"
                : "light-overlay fixed top-0 left-0"
              : ""
          }`}
        >
          <AnimatePresence>
            {taskScreen && (
              <motion.div
                className="flex justify-center items-center w-full lg:h-full overflow-auto flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, type: "tween" }}
              >
                <Popup
                  data={taskScreenData}
                  close={closePopup}
                  refetch={refetch}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <section
        className={`w-full flex justify-center items-center md:px-4 py-2 bg-transparent`}
      >
        <div
          className={`w-full flex justify-between items-center rounded-full backdrop-blur-lg bg-opacity-80 border ${
            darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
          }`}
        >
          <div className="w-1/3 flex items-center justify-center relative">
            {isMobileView && (
              <div className="relative" ref={inputContainerRef}>
                <span
                  className="flex w-full justify-center items-center"
                  onClick={showInputOnMobileDevices}
                >
                  <img
                    src={filterIcon}
                    alt="filter-task"
                    className="w-80 h-2/4"
                  />
                </span>
                {isMobileView && displayInput && (
                  <div className="absolute top-32 left-2 w-[280px]">
                    <span className="absolute left-2 top-2">
                      <SearchIcon />
                    </span>
                    <label htmlFor="search" hidden></label>
                    <input
                      ref={mobileInputRef}
                      id="search"
                      name="searchTask"
                      value={searchTask}
                      onChange={(e) => {
                        setSearchTask(e.target.value || "");
                        setIsFiltered(true);
                      }}
                      type="text"
                      className={`rounded-md w-full px-16 ${
                        darkMode
                          ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                          : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                      } border-none outline-none py-3`}
                    />
                  </div>
                )}
              </div>
            )}

            {!isMobileView && (
              <>
                <span className="absolute lg:left-16 left-8">
                  <SearchIcon />
                </span>
                <label htmlFor="search" hidden></label>
                <input
                  id="search"
                  type="text"
                  name="searchTask"
                  value={searchTask}
                  onChange={(e) => {
                    setSearchTask(e.target.value || "");
                    setIsFiltered(true);
                  }}
                  className={`rounded-sm md:w-3/4 w-full px-16 ${
                    darkMode
                      ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                      : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                  } border-none outline-none py-2`}
                />
              </>
            )}
          </div>

          <div className="w-1/3 flex items-center justify-center mx-2">
            <h1 className="md:text-3xl text-lg text-center">
              Todays Task List
            </h1>
          </div>

          <div className="w-1/3 h-full flex items-center justify-center">
            <div className="w-full flex flex-col justify-center items-center md:w-2/4 px-4 py-2">
              {userData.map((user, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col justify-center items-center"
                >
                  <div className="w-20 h-20 flex justify-center items-center rounded-full">
                    <img
                      src={user.image || defaultImg}
                      alt="profile-img"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        {!loading && (!tasksToDisplay || tasksToDisplay.length === 0) ? (
          <div className="px-4 py-6 flex flex-col justify-center items-center w-full md:h-[400px]">
            <div className="w-full flex flex-col justify-center items-center">
              <img
                src={noItem}
                alt="no-item"
                width={100}
                height={100}
                className="h-full md:w-1/4 w-full"
              />
              <h1
                className={`text-2xl ${
                  darkMode ? "text-[#AFAFAF]" : "text-[#808080]"
                }`}
              >
                {tasksToDisplay && tasksToDisplay?.length <= 0
                  ? "What do you want to do today"
                  : "No task found"}
              </h1>
              <p
                className={`text-lg mt-4 ${
                  darkMode ? "text-[#AFAFAF]" : "text-[#808080]"
                }`}
              >
                Tap + to add your tasks
              </p>
            </div>
          </div>
        ) : !loading ? (
          <div className="my-6 overflow-hidden">
            <div className="w-full px-12 py-5 my-8">
              <Button
                className="flex justify-between items-center"
                aria-controls="tasks"
                aria-haspopup="true"
                onClick={handleMenuButtonClick}
                style={{
                  backgroundColor: darkMode ? "#363636" : "#bdbdbd",
                  color: "#FFFFFF",
                }}
              >
                <span>Filter</span>
                <span className="ml-4">
                  <ArrowDropDown />
                </span>
              </Button>
              <Menu
                id="tasks"
                keepMounted
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleMenuItemClick("All")}>
                  All
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("Completed")}>
                  Completed
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick("Priority less than 5")}
                >
                  Priority less than 5
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick("Priority greater than 5")}
                >
                  Priority greater than 5
                </MenuItem>
              </Menu>
            </div>
            <div className="w-full flex flex-col items-center md:h-[500px] h-[800px] overflow-auto">
              {tasksToDisplay.map((item: TaskDataType1) => (
                <div
                  key={item._id}
                  onClick={() => {
                    getTaskData(Array(item));
                  }}
                  className={`${
                    darkMode
                      ? "bg-[#4C4C4C] text-white"
                      : "bg-[#c7c7c7] text-black"
                  } lg:w-2/4 w-full flex justify-between items-center py-6 my-4 rounded-md px-2 cursor-pointer`}
                >
                  <div className="w-[20px] mr-4">
                    <input type="radio" disabled />
                  </div>
                  <div className="w-2/4 flex flex-col text-wrap">
                    <span className="my-2">{item.name}</span>
                    <span
                      className={`my-2 ${
                        darkMode ? "text-[#AFAFAF]" : "text-[#808080]"
                      }`}
                    >
                      Created: {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="w-2/4 flex justify-center items-baseline">
                    <div className="w-full flex items-baseline justify-center">
                      <div
                        className={`flex rounded-md items-center justify-center px-4 py-4 mx-4 ${getDefaultBgColor(
                          item.category
                        )}`}
                      >
                        <div className="flex flex-wrap">
                          <img
                            src={getIconRender(item.category)}
                            alt="category-icon"
                            className="mx-2"
                          />
                          {item.category}
                        </div>
                      </div>
                      <div className="w-[40px] h-[20px] flex items-center justify-center border px-2 py-4 border-[#8687E7] rounded-md">
                        <img
                          src={flagIcon}
                          alt="priority-icon"
                          className={`${darkMode ? "" : "filter-invert"}`}
                        />
                        <span>{item.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full md:h-[500px] h-[600px] my-8 flex flex-col justify-center items-center">
            <LoadingSpinner />
          </div>
        )}
      </section>

      {isFiltered && (
        <button
          className="fixed lg:bottom-40 md:right-24 md:bottom-72 bottom-52 right-12 rounded-md py-4 px-2 z-10"
          onClick={reset}
        >
          <CleaningServicesTwoTone style={{ width: "50px", height: "50px" }} />
        </button>
      )}
    </section>
  );
}
