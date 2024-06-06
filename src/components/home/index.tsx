import data from "../../utils/data/task_data.json";
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
import { TaskDataType } from "../../utils/types/todo";
import {
  getDefaultBgColor,
  formatDate,
} from "../../utils/reusable_functions/functions";
import { Button, Menu, MenuItem } from "@mui/material";
import { CleaningServicesTwoTone } from "@mui/icons-material";
import { ArrowDropDown } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import Popup from "./popup";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [width] = useState<number>(window.innerWidth);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  const [filteredData, setFilteredData] = useState<TaskDataType[] | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTask, setSearchTask] = useState<string>("");
  const [taskScreen, setTaskScreen] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [taskScreenData, setTaskScreenData] = useState<TaskDataType[] | null>(
    null
  );

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

  const getCurrentDayTasks = () => {
    const today = new Date();

    const filteredTasks = data
      .filter((item) => {
        const completionDate = item.created_at;

        return completionDate === today.toLocaleDateString("en-GB").toString();
      })
      .sort((a, b) => a.task_priority - b.task_priority);
    setFilteredData(filteredTasks);
    setIsFiltered(false);
  };

  useEffect(() => {
    getCurrentDayTasks();
  }, []);

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
      const today = new Date().toLocaleDateString("en-GB");
      if (filteredData) {
        const filtered = data.filter(
          (item) =>
            item.task_name.toLowerCase().includes(searchTask.toLowerCase()) &&
            item.created_at === today
        );
        setFilteredData(filtered);
      }
    };

    searchItem();
  }, [searchTask]);

  const handleMenuButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (category: string) => {
    let filtered;
    const today = new Date().toLocaleDateString("en-GB");

    if (category === "Completed") {
      filtered = data.filter(
        (item) => item.completed === true && item.created_at === today
      );
      setIsFiltered(true);
    } else if (category === "Priority less than 5") {
      filtered = data.filter(
        (item) => item.task_priority < 5 && item.created_at === today
      );
      setIsFiltered(true);
    } else if (category === "Priority greater than 5") {
      filtered = data.filter(
        (item) => item.task_priority > 5 && item.created_at === today
      );
      setIsFiltered(true);
    } else if (category === "All") {
      filtered = data.filter((item) => item.created_at === today);
      setIsFiltered(false);
    } else {
      filtered = data.filter((item) => item.created_at === today);
      setIsFiltered(false);
    }

    setFilteredData(filtered);
    handleMenuClose();
  };

  // Popup functions
  const closePopup = () => {
    setTaskScreen(false);
    setTaskScreenData(null);
  };

  const getTaskData = (item: TaskDataType[]) => {
    setTaskScreenData(item);
    setTaskScreen(true);
  };
  // End of popup functions

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
                      onChange={(e) => setSearchTask(e.target.value || "")}
                      type="text"
                      className={`rounded-md w-full px-14 ${
                        darkMode
                          ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                          : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                      } border-none outline-none px-4 py-3`}
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
                  onChange={(e) => setSearchTask(e.target.value || "")}
                  className={`rounded-sm md:w-3/4 w-full px-14 ${
                    darkMode
                      ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                      : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                  } border-none outline-none px-4 py-2`}
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
        {filteredData && filteredData?.length <= 0 && (
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
                {filteredData.length < 0
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

        {filteredData && filteredData.length > 0 && (
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
                  Prority less than 5
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick("Priority greater than 5")}
                >
                  Prority greater than 5
                </MenuItem>
              </Menu>
            </div>
            <div className="w-full flex flex-col items-center md:h-[500px] h-[800px] overflow-auto">
              {filteredData.map((item) => (
                <div
                  key={item.id}
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
                    <span className="my-2">{item.task_name}</span>
                    <span
                      className={`my-2 ${
                        darkMode ? "text-[#AFAFAF]" : "text-[#808080]"
                      }`}
                    >
                      Created: {formatDate(item.created_at)}
                    </span>
                  </div>
                  <div className="w-2/4 flex justify-center items-baseline">
                    <div
                      className={`w-full flex items-baseline justify-center`}
                    >
                      <div
                        className={`flex rounded-md items-center justify-center px-4 py-4 mx-4 ${getDefaultBgColor(
                          item.task_category
                        )}`}
                      >
                        <div className="flex flex-wrap">
                          <img
                            src={getIconRender(item.task_category)}
                            alt="category-icon"
                            className="mx-2"
                          />
                          {item.task_category}
                        </div>
                      </div>

                      <div className="w-[40px] h-[20px] flex items-center justify-center border px-2 py-4 border-[#8687E7] rounded-md">
                        <img
                          src={flagIcon}
                          alt="priority-icon"
                          className={`${darkMode ? "" : "filter-invert"}`}
                        />
                        <span>{item.task_priority}</span>
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
            className="fixed lg:bottom-32 md:right-24 md:bottom-72 bottom-28 right-12 rounded-md py-4 px-2"
            onClick={getCurrentDayTasks}
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
