import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";

const AddDate = () => {
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const { todos, updateTodos } = useTodoContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Calculate the last date of the current year
  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  const handleSave = () => {
    const updatedTodos = todos.map((item) => ({
      ...item,
      expected_date_of_completion: selectedDate.toLocaleDateString("en-GB"),
    }));

    updateTodos(updatedTodos);
    trackScreenFunc("time");
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  return (
    <div
      className={`w-full h-full text-[#8687E7] ${
        darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
      }`}
    >
      <Calendar
        className={`w-full border-none ${
          darkMode ? "text-white bg-[#363636]" : "text-black bg-[#bdbdbd]"
        }`}
        onChange={handleDateChange}
        value={selectedDate}
        maxDate={lastDateOfYear}
      />
      <div className="flex justify-center items-center">
        <button
          onClick={cancel}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-2 my-6 mx-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-2 my-6 mx-4"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddDate;
