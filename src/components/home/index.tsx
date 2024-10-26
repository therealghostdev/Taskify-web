import data1 from "../../utils/data/task_data.json";
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
import {
  useThemeContext,
  useTrackContext,
} from "../../utils/app_context/general";
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

export default function Index() {
  const { darkMode } = useThemeContext();
  const [width] = useState<number>(window.innerWidth);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const [filteredData, setFilteredData] = useState<TaskDataType1[] | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTask, setSearchTask] = useState<string>("");
  const [taskScreen, setTaskScreen] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [taskScreenData, setTaskScreenData] = useState<TaskDataType1[] | null>(
    null
  );

  // const { trackScreenFunc } = useTrackContext();

  // useEffect(() => {
  //   trackScreenFunc("confirm");
  // }, []);

  const queryParam = (
    query1: string,
    query2?: string
  ): Record<string, string> => {
    const queryParams: Record<string, string> = {
      filter_by_date: query1,
    };

    if (query2) {
      queryParams.status = query2;
    }

    return queryParams;
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["task", filteredData],
    queryFn: async () => {
      const currentDate = new Date()?.toISOString()?.split("T")[0];
      return await getAllTasks(queryParam(currentDate));
    },
    staleTime: 60000,
  });

  useEffect(() => {
    const updateViewValue = () => {
      if (width < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    updateViewValue();
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
      if (data?.data.data) {
        const filtered = data?.data?.data?.filter((item: TaskDataType1) =>
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
    const tasks = data?.data?.data;

    if (!tasks) {
      console.error("No tasks data available");
      return;
    }

    let filtered: TaskDataType1[];

    if (category === "Completed") {
      filtered = tasks.filter((item: TaskDataType1) => item.completed === true);
    } else if (category === "Priority less than 5") {
      filtered = tasks.filter((item: TaskDataType1) => item.priority < 5);
    } else if (category === "Priority greater than 5") {
      filtered = tasks.filter((item: TaskDataType1) => item.priority > 5);
    } else if (category === "All") {
      filtered = [...tasks];
    } else {
      filtered = [...tasks];
      setIsFiltered(false);
      setFilteredData(null);
      handleMenuClose();
      return;
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

  // const { mutate, isPending } = useMutation({
  //   mutationFn: async () => {
  //     const url = queryParam("2024-10-10");
  //     return await getAllTasks(url);
  //   },
  //   onSuccess: (val) => {
  //     const tasks = val.data1.data1;
  //     // setData(tasks);
  //   },
  //   onError: (err: AxiosError) => {
  //     console.error("Error:", err.response ? err.response.data1 : err.message);
  //   },
  // });

  // useEffect(() => {
  //   mutate();
  // }, []);

  const tasksToDisplay = isFiltered ? filteredData : data?.data?.data;
  console.log(tasksToDisplay);
  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

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
                className="flex justify-center items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, type: "tween" }}
              >
                <Popup data={taskScreenData} close={closePopup} />
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
        {tasksToDisplay && tasksToDisplay?.length <= 0 && (
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
                {tasksToDisplay?.length <= 0
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
        )}

        {tasksToDisplay && tasksToDisplay?.length > 0 && (
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
                  onClick={() => getTaskData(Array(item))}
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
                    <div
                      className={`w-full flex items-baseline justify-center`}
                    >
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
        )}

        {isFiltered && (
          <button
            className="fixed lg:bottom-40 md:right-24 md:bottom-72 bottom-52 right-12 rounded-md py-4 px-2 z-10"
            onClick={reset}
          >
            <CleaningServicesTwoTone
              style={{ width: "50px", height: "50px" }}
            />
          </button>
        )}
      </section>
    </section>
  );
}
