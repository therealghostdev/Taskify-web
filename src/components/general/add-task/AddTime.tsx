import { useEffect, useState } from "react";
import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import "react-datetime/css/react-datetime.css";
import "../../../styles/time.scss";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
  useEditTodoContext,
} from "../../../utils/app_context/general";
import { motion } from "framer-motion";

export default function AddTime() {
  const [selectedTime, setSelectedTime] = useState<Moment | null>(moment());
  const { darkMode } = useThemeContext();
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const [time, setTime] = useState<string>("");
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const [editTime, setEditTime] = useState<string>("");

  const handleTimeChange = (time: Moment | string) => {
    if (moment.isMoment(time)) {
      setSelectedTime(time);
      const formattedTime = time.format("HH:mm").toString();
      setTime(formattedTime);
    }
  };

  // checks if edit time state isn't empty
  const getEditTimeValue = () => {
    editTodos.map((item) => {
      if (item.time !== "") {
        setEditTime(item.time);
      } else {
        if (item.expected_date_of_completion !== "") {
          const timeParts = item.expected_date_of_completion
            .split("T")[1]
            .split(":");
          const time = `${timeParts[0]}:${timeParts[1]}`;
          setEditTime(time);
        }
      }
    });
  };

  // Define the value to use based on whether selectedTime is null
  const value = selectedTime ? selectedTime : moment();

  const handleSave = () => {
    if (editTime && editTime !== "") {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        time: selectedTime ? selectedTime?.format("HH:mm") : "",
      }));
      updateEditTodos(updatedTodo);
      trackScreenFunc("priority");
    } else {
      const updatedTodo = todos.map((item) => ({
        ...item,
        time,
      }));

      updateTodos(updatedTodo);
      trackScreenFunc("priority");
    }
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  useEffect(() => {
    getEditTimeValue();
  }, []);

  // updates time value
  useEffect(() => {
    if (editTime && editTime !== "") {
      const parsedTime = moment(editTime, "HH:mm");
      setSelectedTime(parsedTime);
    }
  }, [editTime]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, type: "tween" }}
      className={`${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      }`}
    >
      <div className="w-full border-b-[#ffffff] border-b flex justify-center items-center py-4 px-2 mb-4">
        <h1 className="text-lg">Choose Time</h1>
      </div>

      <div className="w-full">
        <Datetime
          input={false}
          dateFormat={false}
          onChange={handleTimeChange}
          value={value}
          className={`${
            darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
          }`}
        />
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={cancel}
          className="z-50 w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="z-50 w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
}
