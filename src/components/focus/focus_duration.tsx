import { useState } from "react";
import Datetime from "react-datetime";
import moment, { Moment } from "moment";
import "react-datetime/css/react-datetime.css";
import "../../styles/time.scss";
import { useThemeContext } from "../../utils/app_context/general";
import { motion } from "framer-motion";
import { FocusPopupProps, PopupFocusDetails } from "../../utils/types/todo";

export default function Focus_duration(props: FocusPopupProps) {
  const [selectedTime, setSelectedTime] = useState<Moment | null>(moment());
  const { darkMode } = useThemeContext();

  const handleTimeChange = (time: Moment | string) => {
    if (moment.isMoment(time)) {
      setSelectedTime(time);
    }
  };

  const handleSave = () => {
    const currentTime = moment();
    if (selectedTime) {
      const duration = moment.duration(selectedTime.diff(currentTime));
      const durationInMinutes = duration.asMinutes();

      if (durationInMinutes <= 0) {
        props.notify("Selected time must be later than the current time.");
      } else {
        // Update the focusDetails with the calculated duration
        const updatedDetails: PopupFocusDetails = {
          ...props.details,
          duration: durationInMinutes,
        };

        props.updateDetails(updatedDetails);
        props.changeScreen("");
      }
    }
  };

  // Define the value to use based on whether selectedTime is null
  const value = selectedTime ? selectedTime : moment();

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
        <h1 className="text-lg">Your focus ends when?</h1>
      </div>

      <div className="w-full">
        <Datetime
          input={false}
          dateFormat={false}
          timeFormat="hh:mm A"
          onChange={handleTimeChange}
          value={value}
          className={`${
            darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
          }`}
        />
      </div>

      <div className="flex justify-center items-center">
        <button
          // Add cancel functionality if needed
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
