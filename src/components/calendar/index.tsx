import {
  useThemeContext,
  useQueryContext,
} from "../../utils/app_context/general";
import Calendar from "react-calendar";
import "../../styles/calendar.scss";
import { useEffect, useState } from "react";
import { TaskDataType1 } from "../../utils/types/todo";
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
import {
  getDefaultBgColor,
  formatDate,
} from "../../utils/reusable_functions/functions";
import { getAllTasks } from "../../api";
import { queryParam } from "../../utils/reusable_functions/functions";
import { useMutation } from "../../../lib/tanstackQuery";
import axios from "../../../lib/axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../loading/loading1";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState<TaskDataType1[] | null>(
    null
  );
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const [activeBtn, setActiveBtn] = useState<boolean>(false);
  const [values, setValues] = useState<TaskDataType1[] | null>([]);
  const { updateQuery } = useQueryContext();

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const { isPending, mutate } = useMutation({
    mutationFn: (chosenDate: string) => {
      return getAllTasks(queryParam(chosenDate));
    },
    onSuccess: (data) => {
      setValues(data?.data?.data)
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response) {
        const message = err.response.data?.message;
        if (err.response.status === 404) {
          setValues([]);
        } else {
          notify(message || "An error occurred");
        }
      } else {
        notify("Something went wrong");
      }
    },
  });

  const getTaskByDate = () => {
    const filteredTasks = values?.filter((item: TaskDataType1) => {
      const itemCompletionDate = new Date(
        item.expected_completion_time
      ).toLocaleDateString("en-GB");
      const selectedCompletionDate = selectedDate.toLocaleDateString("en-GB");

      return itemCompletionDate === selectedCompletionDate;
    });
    setFilteredData(filteredTasks || null);
    setActiveBtn(false);
  };

  const getTaskByCompleteStatus = () => {
    const filteredTask = values?.filter((item: TaskDataType1) => {
      const expected_completion_time = new Date(item.expected_completion_time);
      return (
        item.completed === true &&
        expected_completion_time.toLocaleDateString("en-GB") ===
          selectedDate.toLocaleDateString("en-GB").toString()
      );
    });

    setFilteredData(filteredTask || null);
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

  const getTaskData = (item: TaskDataType1) => {
    const updatedTodos = editTodos.map((content) => {
      return {
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
      };
    });

    updateEditTodos(updatedTodos);
    updateQuery(updatedTodos);
    trackScreenFunc("name");
  };

  useEffect(() => {
    if (selectedDate) {
      const localDateString = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      mutate(localDateString);
    }
  }, [selectedDate, mutate]);

  useEffect(() => {
    getTaskByDate();
  }, [values]);

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

        {!isPending && filteredData && filteredData.length > 0 && (
          <div className="w-full flex flex-col items-center md:h-[500px] h-[800px] overflow-auto my-8">
            {filteredData.map((item) => (
              <div
                key={item.name}
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
                  <div className={`w-full flex items-baseline justify-center`}>
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
        )}

        {!isPending && (!filteredData || filteredData.length === 0) && (
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

        {isPending && (
          <div className="w-full lg:h-[200px] md:h-[500px] h-[400px] my-8 flex flex-col justify-center items-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
//{}
