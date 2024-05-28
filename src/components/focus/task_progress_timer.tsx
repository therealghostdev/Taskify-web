import { useEffect, useState } from "react";
import { useThemeContext } from "../../utils/app_context/general";
import data from "../../utils/data/task_data.json";
import Focus_pop from "./focus_pop";
import { TaskDataType, focusDetails } from "../../utils/types/todo";
import { toast } from "react-toastify";
import Focus_duration from "./focus_duration";

export default function Task_progress_timer() {
  const { darkMode } = useThemeContext();
  const [popup, setPopup] = useState<boolean>(false);
  const [popupContents, setPopupContents] = useState<TaskDataType[]>([]);
  const [durationScreen, setDurationScreen] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left in seconds

  const [focusDetails, setFocusDetails] = useState<focusDetails>({
    name: [],
    duration: 0,
    expired: ""
  });

  const customId = "1";
  const notify = (message: string) => {
    toast(message, { toastId: customId, theme: darkMode ? "dark" : "light" });
  };

  const handleStartFocusClick = () => {
    const focus = localStorage.getItem("tasks");
    const date = new Date();
    if (!focus) {
      const popupItems = data.filter((item) => {
        const createdToday = item.created_at;

        return (
          createdToday === date.toLocaleDateString("en-GB").toString() &&
          item.completed === false
        );
      });

      if (!popupItems || popupItems.length === 0) {
        notify("No task found, kindly add a task to begin focus");
      } else {
        setPopupContents(popupItems);
        setPopup(true);
        setDurationScreen("initial");
      }
    } else {
      localStorage.removeItem("tasks");
      setIsFocused(false);
      setTimeLeft(0); // Reset the timer
      notify("Focus mode deactivated!");
    }
  };

  const changeScreen = (value: string) => {
    setDurationScreen(value);
  };

  const updateFocusItem = (items: focusDetails) => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + items.duration * 60000); // Set the expiry time
    items.expired = expiryTime.toISOString();

    setFocusDetails(items);
    setTimeLeft(items.duration * 60); // Set the timer in seconds
  };

  const closePopup = () => {
    setPopup(false);
  };

  const popupNotify = (val: string) => {
    return notify(val);
  };

  const activateFocusMode = () => {
    const focus = localStorage.getItem("tasks");
    if (
      !focus &&
      focusDetails.duration !== 0 &&
      focusDetails.name.length !== 0 &&
      focusDetails.name
    ) {
      localStorage.setItem("tasks", JSON.stringify(focusDetails));
      notify("Focus mode activated on mobile device!");
      setIsFocused(true);
    }
  };

  useEffect(() => {
    activateFocusMode();
  }, [focusDetails.duration]);

  useEffect(() => {
    const focus = localStorage.getItem("tasks");
    if (!focus) {
      setIsFocused(false);
    } else {
      const storedDetails = JSON.parse(focus) as focusDetails;

      const now = new Date();
      const expiryTime = new Date(storedDetails.expired);
      const remainingTime = Math.max((expiryTime.getTime() - now.getTime()) / 1000, 0); // Calculate remaining time in seconds

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setFocusDetails(storedDetails);
        setIsFocused(true);
      } else {
        // If the current time is past the expiry time, reset focus mode
        setIsFocused(false);
        setTimeLeft(0);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isFocused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);
    } else if (timeLeft === 0 && isFocused) {
      setIsFocused(false);
      localStorage.removeItem("tasks");
      notify("Focus mode completed!");
    }

    return () => clearInterval(timer);
  }, [isFocused, timeLeft]);

  const formatTimeLeft = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}h : ${minutes}m : ${seconds}s`;
  };

  const getBorderColor = (percentage: number) => {
    const filled = Math.min(percentage, 100);
    return `conic-gradient(#8687E7 ${filled}%, #A5A5A5 ${filled}%)`;
  };

  return (
    <>
      <div className="w-full h-[500px] flex flex-col justify-center items-center px-6 py-4">
        <div className="w-[200px] h-[200px] mb-8 text-2xl font-bold rounded-full flex justify-center items-center relative box">
          <div
            className={`w-full h-full rounded-full flex justify-center items-center ${
              !isFocused ? "border-8 border-[#A5A5A5]" : ""
            }`}
          >
            {isFocused ? formatTimeLeft(timeLeft) : "START"}
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
        .box::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 8px;
          background: ${
            isFocused
              ? getBorderColor(
                  ((focusDetails.duration * 60 - timeLeft) /
                    (focusDetails.duration * 60)) *
                    100
                )
              : "none"
          };
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `,
            }}
          />
        </div>

        <div
          className={`w-full h-1/4 flex flex-col items-center justify-center gap-y-2 break-words ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <div className="md:w-2/4 flex flex-col justify-center items-center w-full break-words text-wrap">
            <p className="text-lg text-center">
              While your focus mode is on, all of your notifications will be off
            </p>
            <small className="mb-2 text-center text-wrap break-words text-[#FF4949]">
              NOTE: while this feature isn't available on web version, focus
              mode will be activated on your mobile device automatically if app
              version installed
            </small>
          </div>

          <button
            className="rounded-md px-4 py-2 bg-[#8687E7]"
            onClick={handleStartFocusClick}
          >
            {!isFocused ? "Start Focusing" : "Stop Focusing"}
          </button>
        </div>
      </div>
      {popup && durationScreen === "initial" && (
        <div
          className={`fixed top-0 left-0 flex flex-col justify-center items-center z-50 ${
            darkMode ? "dark-overlay" : "light-overlay"
          }`}
        >
          <Focus_pop
            contents={popupContents}
            screen={durationScreen}
            changeScreen={changeScreen}
            details={focusDetails}
            updateDetails={updateFocusItem}
            close={closePopup}
            notify={popupNotify}
          />
        </div>
      )}

      {popup && durationScreen === "time" && (
        <div
          className={`fixed top-0 left-0 flex flex-col justify-center items-center z-50 ${
            darkMode ? "dark-overlay" : "light-overlay"
          }`}
        >
          <Focus_duration
            contents={popupContents}
            screen={durationScreen}
            changeScreen={changeScreen}
            details={focusDetails}
            updateDetails={updateFocusItem}
            close={closePopup}
            notify={popupNotify}
          />
        </div>
      )}
    </>
  );
}
