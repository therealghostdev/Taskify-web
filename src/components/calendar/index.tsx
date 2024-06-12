import { useThemeContext } from "../../utils/app_context/general";
import Calendar from "react-calendar";
import "../../styles/calendar.scss";
import { useEffect, useState } from "react";
import data from "../../utils/data/task_data.json";
import { TaskDataType } from "../../utils/types/todo";
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
import {
  useEditTodoContext,
  useTrackContext,
} from "../../utils/app_context/general";
import { getDefaultBgColor, formatDate } from "../../utils/reusable_functions/functions";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState<TaskDataType[] | null>(null);
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const [activeBtn, setActiveBtn] = useState<boolean>(false);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getTaskByDate = () => {
    const filteredTasks = data.filter((item) => {
      const completionDate = item.created_at;

      return (
        completionDate === selectedDate.toLocaleDateString("en-GB").toString()
      );
    });
    setFilteredData(filteredTasks);
    setActiveBtn(false);
  };

  const getTaskByCompleteStatus = () => {
    const filteredTask = data.filter((item) => {
      return (
        item.completed === true &&
        item.completion_date ===
          selectedDate.toLocaleDateString("en-GB").toString()
      );
    });

    setFilteredData(filteredTask);
    setActiveBtn(true);
  };

  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);

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

  const getTaskData = (item: TaskDataType) => {
    const updatedTodos = editTodos.map((content) => ({
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
  };

  useEffect(() => {
    getTaskByDate();
  }, [selectedDate]);

  return (
    <div className={`w-full h-auto flex flex-col gap-y-6 text-[#8687E7]`}>
      <div className="w-full">
        <Calendar
          className={`w-full border-none ${
            darkMode ? "text-white bg-[#363636]" : "text-black bg-[#bdbdbd]"
          }`}
          onChange={handleDateChange}
          value={selectedDate}
          maxDate={lastDateOfYear}
        />
      </div>

      <div className="w-full flex flex-col items-center px-6 overflow-y-auto">
        <div
          className={`lg:w-2/4 w-full flex justify-between items-center ${
            darkMode ? "bg-[#4C4C4C]" : "bg-[#c7c7c7]"
          }`}
        >
          <button
            onClick={getTaskByDate}
            className={`${
              !activeBtn ? "bg-[#8687E7] text-white" : ""
            } w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4`}
          >
            All
          </button>

          <button
            onClick={getTaskByCompleteStatus}
            className={`${
              activeBtn ? "bg-[#8687E7] text-white" : ""
            } w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4`}
          >
            Completed
          </button>
        </div>

        {filteredData && (
          <div className="w-full flex flex-col items-center md:h-[500px] h-[800px] overflow-auto my-8">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => getTaskData(item)}
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
                  <div className={`w-full flex items-baseline justify-center`}>
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
        )}

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
                No Task to display
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//{}
