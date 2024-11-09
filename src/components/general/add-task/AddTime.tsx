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
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const [time, setTime] = useState<string>("");
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const [editTime, setEditTime] = useState<string>("");

  // state variables for when user tries to mark task as completed
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleTimeChange = (time: Moment | string) => {
    if (moment.isMoment(time)) {
      setSelectedTime(time);
      const formattedTime = time.format("HH:mm").toString();
      setTime(formattedTime);
    }
  };

  // checks if edit time state isn't empty
  const getEditTimeValue = () => {
    editTodos.forEach((item) => {
      // For completion time update
      if (trackScreen === "completedTime") {
        if (item.time && item.time !== "") {
          const extractedTime = item.time.split("T")[1];
          setSelectedTime(moment(extractedTime, "HH:mm"));
          setTime(moment(extractedTime, "HH:mm").toString());
          setEditTime(moment(extractedTime, "HH:mm").toString());
          console.log("it ran1");
        } else {
          console.log("it ran2");
          setSelectedTime(moment());
        }
        return;
      }

      // For regular time edit
      if (item.time !== "") {
        const extractedTime = item.time.split("T")[1];
        setSelectedTime(moment(extractedTime, "HH:mm"));
        setTime(extractedTime);
        setEditTime(extractedTime);
      } else {
        setSelectedTime(moment());
        setEditTime(moment().toString())
        setTime(moment().toString())
      }
    });
  };

  // Define the value to use based on whether selectedTime is null
  const value = selectedTime ? selectedTime : moment();

  const handleSave = () => {
    if (duration && duration > 0 && completed) {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        completedTime: selectedTime ? selectedTime?.format("HH:mm") : editTime,
      }));
      updateEditTodos(updatedTodo);
      console.log(
        editTodos.map((item) => item.time),
        "is time"
      );
      trackScreenFunc("confirm");
    } else if (editTime && editTime !== "") {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        time: editTime,
      }));
      console.log(
        editTodos.map((item) => item.time),
        "is time2"
      );
      console.log(value, "is value");

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
    console.log(editTodos, "1");

    editTodos.map((item) => {
      if (
        item.duration &&
        item.duration > 0 &&
        item.completed &&
        trackScreen === "completedTime"
      ) {
        setDuration(item.duration);
        setCompleted(item.completed);
      }
    });
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
