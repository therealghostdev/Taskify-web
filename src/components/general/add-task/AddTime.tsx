import { useState } from "react";
import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import "react-datetime/css/react-datetime.css";
import "./time.scss";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";

export default function AddTime() {
  const [selectedTime, setSelectedTime] = useState<Moment | null>(moment());
  const { darkMode } = useThemeContext();
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const [time, setTime] = useState<string>("");

  const handleTimeChange = (time: Moment | string) => {
    if (moment.isMoment(time)) {
      setSelectedTime(time);
      const formattedTime = time.format("HH:mm").toString();
      setTime(formattedTime);
    }
  };

  // Define the value to use based on whether selectedTime is null
  const value = selectedTime ? selectedTime : moment();

  const handleSave = () => {
    const updatedTodo = todos.map((item) => ({
      ...item,
      time,
    }));

    updateTodos(updatedTodo);
    trackScreenFunc("priority");
  };

  const cancel = () => {
    trackScreenFunc("");
  };

  return (
    <div
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
    </div>
  );
}
