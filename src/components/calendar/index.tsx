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
import {
  useEditTodoContext,
  useTrackContext,
} from "../../utils/app_context/general";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState<TaskDataType[] | null>(null);
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreenFunc } = useTrackContext();

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const getTaskByDate = () => {
    const filteredTasks = data.filter((item) => {
      const completionDate = item.completion_date;

      return (
        completionDate === selectedDate.toLocaleDateString("en-GB").toString()
      );
    });
    setFilteredData(filteredTasks);
  };

  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);

  const formatDate = (date: string) => {
    const currentDate = new Date();
    const [day, month, year] = date.split("/");
    const formattedDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );

    if (formattedDate.toDateString() === currentDate.toDateString()) {
      return "Today";
    } else if (formattedDate.getDate() === currentDate.getDate() + 1) {
      return "Tomorrow";
    } else if (formattedDate.getDate() === currentDate.getDate() - 1) {
      return "Yesterday";
    } else {
      // Format date as "dd/mm/yyyy"
      return `${day}/${month}/${year}`;
    }
  };

  const getDefaultBgColor = (itemName: string) => {
    switch (itemName) {
      case "Grocery":
        return "bg-[#CCFF80]";
      case "Work":
        return "bg-[#FF9680]";
      case "Sports":
        return "bg-[#FF9680]";
      case "Design":
        return "bg-[#80FFD9]";
      case "University":
        return "bg-[#809CFF]";
      case "Social":
        return "bg-[#FF80EB]";
      case "Music":
        return "bg-[#FC80FF]";
      case "Health":
        return "bg-[#80FFA3]";
      case "Movie":
        return "bg-[#80D1FF]";
      case "Home":
        return "bg-[#FFCC80]";
      default:
        return "bg-[#80FFD1]";
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

    // return () => getTaskByDate();
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
            // onClick={cancel}
            className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
          >
            Today
          </button>

          <button
            // onClick={cancel}
            className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
          >
            Completed
          </button>
        </div>

        {filteredData && (
          <div className="w-full flex flex-col justify-center items-center">
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
      </div>
    </div>
  );
}
//{}
