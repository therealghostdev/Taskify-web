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

  const [focusDetails, setFocusDetails] = useState<focusDetails>({
    name: [],
    duration: 0,
  });

  const customId = "1";
  const notify = (message: string) => {
    toast(message, { toastId: customId, theme: darkMode ? "dark" : "light" });
  };
  const handleStartFocusClick = () => {
    const date = new Date();
    const popupItems = data.filter((item) => {
      const createdToday = item.created_at;

      return (
        createdToday === date.toLocaleDateString("en-GB").toString() &&
        item.completed === true
      );
    });

    if (!popupItems || popupItems.length === 0) {
      notify("No task found!");
    } else {
      setPopupContents(popupItems);
      setPopup(true);
      setDurationScreen("initial");
    }
  };

  const changeScreen = (value: string) => {
    setDurationScreen(value);
  };

  const updateFocusItem = (items: focusDetails) => {
    setFocusDetails(items);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const popupNotify = (val: string) => {
    return notify(val);
  };

  useEffect(() => {
    console.log(popupContents);
  }, [popupContents]);

  useEffect(() => {
    console.log(focusDetails);
  }, [focusDetails]);

  return (
    <>
      <div className="w-full h-[500px] flex flex-col justify-center items-center px-6 py-4">
        <div className="w-[200px] h-[200px] text-2xl font-bold rounded-full border-8 border-[#A5A5A5] flex justify-center items-center">
          <h1>START</h1>
        </div>

        <div
          className={`w-full h-1/4 flex flex-col items-center justify-center gap-y-6 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <p className="text-lg text-center">
            While your focus mode is on, all of your notifications will be off
          </p>

          <button
            className="rounded-md px-4 py-2 bg-[#8687E7]"
            onClick={handleStartFocusClick}
          >
            Start Focusing
          </button>
        </div>
      </div>
      {popup && durationScreen === "initial" && (
        <div
          className={`fixed top-0 left-0 flex flex-col justify-center items-center ${
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
          className={`fixed top-0 left-0 flex flex-col justify-center items-center ${
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
