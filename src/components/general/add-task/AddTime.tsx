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
  const [time, setTime] = useState<string>(moment().format("HH:mm"));
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const [editTime, setEditTime] = useState<string>("");
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleTimeChange = (timeValue: Moment | string) => {
    if (moment.isMoment(timeValue)) {
      const formattedTime = timeValue.format("HH:mm");
      setSelectedTime(timeValue);
      setTime(formattedTime);

      // Immediately update todos with the new time
      if (!editTime) {
        const updatedTodo = todos.map((item) => ({
          ...item,
          time: formattedTime,
        }));
        updateTodos(updatedTodo);
      }
    }
  };

  const getEditTimeValue = () => {
    editTodos.forEach((item) => {
      if (trackScreen === "completedTime") {
        if (item.time && item.time !== "") {
          const extractedTime = item.time.split("T")[1];
          setSelectedTime(moment(extractedTime, "HH:mm"));
          setTime(extractedTime);
          setEditTime(extractedTime);
        }
        return;
      }

      if (item.time && item.time !== "") {
        const extractedTime = item.time.split("T")[1];
        setSelectedTime(moment(extractedTime, "HH:mm"));
        setTime(extractedTime);
        setEditTime(extractedTime);
      } else {
        const currentTime = moment().format("HH:mm");
        setSelectedTime(moment());
        setTime(currentTime);
      }
    });
  };

  const handleSave = () => {
    const currentTime = selectedTime?.format("HH:mm") || time;

    if (duration && duration > 0 && completed) {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        completedTime: currentTime,
      }));
      updateEditTodos(updatedTodo);
      trackScreenFunc("confirm");
    } else if (editTime !== "") {
      const updatedTodo = editTodos.map((item) => ({
        ...item,
        time: currentTime,
      }));
      updateEditTodos(updatedTodo);
      trackScreenFunc("priority");
    } else {
      const updatedTodo = todos.map((item) => {
        const updated = {
          ...item,
          time: currentTime,
        };
        return updated;
      });

      updateTodos(updatedTodo);
      trackScreenFunc("priority");
    }
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  // Initialize with current time
  useEffect(() => {
    const currentTime = moment().format("HH:mm");
    setTime(currentTime);
    setSelectedTime(moment());

    // Initialize todos with current time if they don't have one
    if (todos.length > 0 && !todos[0].time) {
      const updatedTodo = todos.map((item) => ({
        ...item,
        time: currentTime,
      }));
      updateTodos(updatedTodo);
    }

    getEditTimeValue();

    editTodos.forEach((item) => {
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

  useEffect(() => {
    if (editTime && editTime !== "") {
      const parsedTime = moment(editTime, "HH:mm");
      setSelectedTime(parsedTime);
    }
  }, [editTime]);

  const value = selectedTime || moment();

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
