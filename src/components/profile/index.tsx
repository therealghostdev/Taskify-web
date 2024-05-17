import {
  useAuthContext,
  useThemeContext,
} from "../../utils/app_context/general";
import profileImg from "../../assets/default-profile.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import InfoIcon from "@mui/icons-material/Info";
import QuizIcon from "@mui/icons-material/Quiz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BoltIcon from "@mui/icons-material/Bolt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useRef } from "react";
import Popup from "./popup";

export default function Index() {
  const authenticated = useAuthContext();
  const { darkMode } = useThemeContext();
  const [popup, setPopup] = useState<boolean>(false);
  const [singleInput, setSingleInput] = useState<boolean>(false);
  const [camera, setCamera] = useState<boolean>(false);
  const [popupText, setPopupText] = useState<string>("");
  let accountRef = useRef<HTMLSpanElement | null>(null);
  let passwordRef = useRef<HTMLSpanElement | null>(null);
  let imageRef = useRef<HTMLSpanElement | null>(null);

  const closePopup = () => setPopup(false);

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

  return (
    <section
      className={`w-full px-6 py-4 flex justify-center items- flex-col ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      {popup && (
        <div
          className={`${
            popup
              ? darkMode
                ? "dark-overlay fixed top-0 left-0"
                : "light-overlay fixed top-0 left-0 z-10"
              : ""
          }`}
        >
          <Popup
            singleInput={singleInput}
            camera={camera}
            text={popupText}
            close={closePopup}
          />
        </div>
      )}

      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center md:w-2/4 px-4 py-2">
          <div className="w-40 h-40 flex justify-center items-center rounded-full">
            <img
              src={profileImg}
              alt="profile-img"
              className="w-full h-full rounded-full"
            />
          </div>
          <h1 className={`text-2xl`}>Marth Hays</h1>
        </div>

        <div className="md:w-2/4 w-full flex justify-center items-center my-5">
          <button
            disabled
            className={`rounded-md mx-2 ${
              darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
            } px-4 py-6 w-2/4`}
          >
            10 Task Left
          </button>
          <button
            disabled
            className={`rounded-md mx-2 ${
              darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
            } px-4 py-6 w-2/4`}
          >
            5 Task done
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
            Account
          </h1>

          <button
            onClick={getAccountRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={accountRef}>
              <PersonIcon className="mr-4" />
              Change account name
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={getPasswordRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={passwordRef}>
              <KeyIcon className="mr-4" />
              Change account password
            </span>
            <span>&gt;</span>
          </button>

          <button
            onClick={getImageRefTextValues}
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span ref={imageRef}>
              <CameraAltIcon className="mr-4" />
              Change account image
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
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <InfoIcon className="mr-4" />
              About us
            </span>
            <span>&gt;</span>
          </button>

          <button
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <QuizIcon className="mr-4" />
              Faq
            </span>
            <span>&gt;</span>
          </button>

          <button
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <BoltIcon className="mr-4" />
              Help & Feedback
            </span>
            <span>&gt;</span>
          </button>

          <button
            className={`text-2xl flex justify-between bg-transparent my-2`}
          >
            <span>
              <ThumbUpIcon className="mr-4" />
              Support us
            </span>
            <span>&gt;</span>
          </button>

          <button
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
