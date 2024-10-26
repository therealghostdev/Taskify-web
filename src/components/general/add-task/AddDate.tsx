import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "../../../styles/calendar.scss";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import { motion } from "framer-motion";

const AddDate = () => {
  const { darkMode } = useThemeContext();
  const { trackScreenFunc } = useTrackContext();
  const { todos, updateTodos } = useTodoContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const [editTodoState, setEditTodoState] = useState<Date | null>(null);

  // Calculate the last date of the current year
  const currentYear = new Date().getFullYear();
  const lastDateOfYear = new Date(currentYear, 11, 31);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };

  // checks for edit task details
  const updatedSelectedDate = () => {
    editTodos.forEach((item) => {
      if (item.expected_date_of_completion !== "") {
        const extractedDate = item.expected_date_of_completion;
        const extractedTime = item.expected_date_of_completion.split("T")[1];
        item.time = extractedTime;
        

        const dateObject = new Date(extractedDate);

        const day = dateObject.getDate();
        const month = dateObject.getMonth();
        const year = dateObject.getFullYear();

        const date = new Date(year, month, day);

        setSelectedDate(date);
      }
    });
  };

  const handleSave = () => {
    if (editTodoState && editTodoState instanceof Date) {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        expected_date_of_completion: editTodoState.toLocaleDateString("en-GB"),
      }));
      updateEditTodos(updatedTodo);
      trackScreenFunc("time");
    } else {
      const updatedTodos = todos.map((item) => ({
        ...item,
        expected_date_of_completion: selectedDate.toLocaleDateString("en-GB"),
      }));

      updateTodos(updatedTodos);
      trackScreenFunc("time");
    }
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  useEffect(() => {
    updatedSelectedDate();
  }, []);

  useEffect(() => {
    editTodos.map((item) => {
      if (item.expected_date_of_completion !== "") {
        setEditTodoState(selectedDate);
      }
    });
  }, [selectedDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
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
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default AddDate;
