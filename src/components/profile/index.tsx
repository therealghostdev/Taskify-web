import {
  useAuthContext,
  useThemeContext,
} from "../../utils/app_context/general";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InfoIcon from "@mui/icons-material/Info";
import QuizIcon from "@mui/icons-material/Quiz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BoltIcon from "@mui/icons-material/Bolt";
import LogoutIcon from "@mui/icons-material/Logout";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Switch } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import Popup from "./popup";
import userData from "../../utils/data/user_data.json";
import defaultImg from "../../assets/default-profile.png";
import taskData from "../../utils/data/task_data.json";
import { TaskDataType } from "../../utils/types/todo";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function Index() {
  const { authenticated, setAuthenticated } = useAuthContext();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [popup, setPopup] = useState<boolean>(false);
  const [singleInput, setSingleInput] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(false);
  const [popupText, setPopupText] = useState<string>("");
  let accountRef = useRef<HTMLSpanElement | null>(null);
  let passwordRef = useRef<HTMLSpanElement | null>(null);
  let imageRef = useRef<HTMLSpanElement | null>(null);
  const [filteredTask, setFilteredTask] = useState<TaskDataType[] | null>(null);
  const [completedTasks, setCompletedTasks] = useState<TaskDataType[] | null>(
    null
  );

  const closePopup = () => setPopup(false);

  const toggleTheme = () => {
    toggleDarkMode(!darkMode);
  };

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const filterTasksByCurrentDate = (tasks: TaskDataType[]) => {
    const currentDate = new Date().toLocaleDateString("en-GB");
    return tasks.filter((task) => task.completion_date === currentDate);
  };

  const returnCompletedTaskData = (tasks: TaskDataType[]) => {
    const currentDate = new Date().toLocaleDateString("en-GB");
    return tasks.filter(
      (task) => task.completed === true && task.completion_date === currentDate
    );
  };

  const getAccountRefTextValues = () => {
    if (accountRef.current) {
      const textContent = accountRef.current.textContent;
      const text = textContent?.split(" ").pop()?.toString();
      if (text) {
        setPopupText(text);
      }
    }

    setPopup(true);
    setSingleInput(true);
    setCamera(false);
  };

  const getPasswordRefTextValues = () => {
    if (passwordRef.current) {
      const textContent = passwordRef.current.textContent;
      const text = textContent?.split(" ").pop()?.toString();
      if (text) {
        setPopupText(text);
      }
    }

    setPopup(true);
    setSingleInput(false);
    setCamera(false);
  };

  const getImageRefTextValues = () => {
    if (imageRef.current) {
      const textContent = imageRef.current.textContent;
      const text = textContent?.split(" ").pop()?.toString();
      if (text) {
        setPopupText(text);
      }
    }

    setPopup(true);
    setSingleInput(false);
    setCamera(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    notify("logout success");
  };

  useEffect(() => {
    const filtered = filterTasksByCurrentDate(taskData);
    const completed = returnCompletedTaskData(taskData);

    setFilteredTask(filtered);
    setCompletedTasks(completed);
  }, []);

  return (
    <section
      className={`w-full px-6 py-4 flex justify-center items- flex-col ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {popup && (
        <div
          className={`flex items-center justify-center ${
            popup
              ? darkMode
                ? "dark-overlay fixed top-0 left-0"
                : "light-overlay fixed top-0 left-0 z-10"
              : ""
          }`}
        >
          <AnimatePresence>
            {popup && (
              <motion.div
                className="flex justify-center items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, type: "tween" }}
              >
                <Popup
                  singleInput={singleInput}
                  camera={camera}
                  text={popupText}
                  close={closePopup}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center md:w-2/4 px-4 py-2">
          {userData.map((user, index) => (
            <div
              key={index}
              className="w-full flex flex-col justify-center items-center"
            >
              <div className="w-40 h-40 flex justify-center items-center rounded-full">
                <img
                  src={user.image || defaultImg}
                  alt="profile-img"
                  className="w-full h-full rounded-full"
                />
              </div>
              {authenticated ? (
                <h1 className="text-2xl">{`${user.firstname} ${user.lastname}`}</h1>
              ) : (
                <h1 className="text-2xl">No name found</h1>
              )}
              <h2 className="text-lg">
                @{authenticated ? user.username : "no username found"}
              </h2>
            </div>
          ))}
        </div>

        <div className="md:w-2/4 w-full flex justify-center items-center my-5">
          <button
            disabled
            className={`rounded-md mx-2 ${
              darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
            } px-4 py-6 w-2/4`}
          >
            {filteredTask ? filteredTask.length : "0"} Task Left
          </button>
          <button
            disabled
            className={`rounded-md mx-2 ${
              darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
            } px-4 py-6 w-2/4`}
          >
            {completedTasks ? completedTasks.length : "0"} Task done
          </button>
        </div>
      </div>

      <section className="w-full flex flex-col justify-center items-center">
        <div className="md:w-2/4 w-full my-4 flex flex-col gap-4">
          <h1
            className={`${
              darkMode ? "text-[#bdbdbd]" : "text-[#363636]"
            } text-lg`}
          >
            General
          </h1>

          <button
            onClick={() => notify("coming soon")}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <NewReleasesIcon className="mr-4" />
              Change Language
            </span>
            <span>&gt;</span>
          </button>

          <div className={`text-2xl flex justify-between bg-transparent my-2`}>
            <span>
              {darkMode ? (
                <NightlightIcon className="mr-4" />
              ) : (
                <WbSunnyIcon className="mr-4" />
              )}
              Change Theme
            </span>
            <Switch checked={darkMode} onChange={toggleTheme} color="primary" />
            <span>&gt;</span>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col justify-center items-center">
        <div className="md:w-2/4 w-full my-4 flex flex-col gap-4">
          <h1
            className={`${
              darkMode ? "text-[#bdbdbd]" : "text-[#363636]"
            } text-lg`}
          >
            Account
          </h1>

          <button
            onClick={getAccountRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={accountRef}>
              <PersonIcon className="mr-4" />
              Change username
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={getPasswordRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={passwordRef}>
              <KeyIcon className="mr-4" />
              Change password
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={getImageRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={imageRef}>
              <CameraAltIcon className="mr-4" />
              Change image
            </span>
            <span>&gt;</span>
          </button>
        </div>
      </section>

      <section className="w-full flex flex-col justify-center items-center">
        <div className="md:w-2/4 w-full my-4 flex flex-col gap-4">
          <h1
            className={`${
              darkMode ? "text-[#bdbdbd]" : "text-[#363636]"
            } text-lg`}
          >
            Taskify
          </h1>

          <button
            onClick={() => notify("coming soon")}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <InfoIcon className="mr-4" />
              About us
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={() => notify("coming soon")}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <QuizIcon className="mr-4" />
              Faq
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={() => notify("coming soon")}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <BoltIcon className="mr-4" />
              Help & Feedback
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={() => notify("coming soon")}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <ThumbUpIcon className="mr-4" />
              Support us
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={() => logout()}
            className={`text-2xl flex justify-between text-[#FF4949] my-2`}
          >
            <span>
              <LogoutIcon className="mr-4" />
              Logout
            </span>
          </button>
        </div>
      </section>
    </section>
  );
}
