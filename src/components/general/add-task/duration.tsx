import {
  useThemeContext,
  useEditTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";
import { ChangeEvent, useState } from "react";

export default function Duration() {
  const { darkMode } = useThemeContext();
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const { trackScreenFunc } = useTrackContext();

  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      setDuration(Number(value));
      setError(""); // Clear error when input is valid
    } else {
      setError("Value must be a number");
    }
  };

  const handleContinueClick = () => {
    if (duration && duration > 0) {
      const updatedTodos = editTodos.map((item) => ({
        ...item,
        duration,
      }));
      updateEditTodos(updatedTodos);
      trackScreenFunc("completedAt");
    } else {
      setError("value must be greater than 0");
    }
  };

  const handleBackClick = () => {
    trackScreenFunc("question");
  };

  return (
    <section className="flex justify-center items-center w-full h-full px-8 py-4">
      <div
        className={`w-full h-full rounded-md px-6 py-2 gap-y-6 flex flex-col justify-center items-center ${
          darkMode ? "bg-[#000000] text-white" : "bg-[#ffffff] text-black"
        }`}
      >
        <div className="border-b border-b-[#ffffff] w-full px-2 my-2">
          <h1 className="text-center text-2xl my-2">
            How long did it take you?
          </h1>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <div className="lg:w-3/4 w-full flex flex-col justify-start items-start">
            <input
              type="text" // Changed to text to avoid default increment buttons
              name="duration"
              value={duration}
              placeholder="Enter duration here"
              onChange={handleChange}
              className={`px-4 py-3 rounded-md w-full transition-all duration-700 border-2 border-[#535353] ${
                darkMode
                  ? "bg-[#363636] text-[#AFAFAF] focus:outline-none"
                  : "bg-[#bdbdbd] text-[#000000] focus:outline-none"
              } ${error !== "" ? "border-red-500" : ""}`}
              style={{
                MozAppearance: "textfield", // For Firefox
              }}
            />
            {error !== "" && (
              <small className="text-red-500 text-sm my-2">{error}</small>
            )}

            <small
              className={`${
                darkMode ? "text-white" : "text-black"
              } my-3 text-lg`}
            >
              durations are calculated in minutes
            </small>
          </div>

          <div className="flex justify-center items-center mt-8 w-full">
            <button
              onClick={handleBackClick}
              className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Back
            </button>
            <button
              onClick={handleContinueClick}
              className="w-2/4 rounded-sm flex justify-center items-center hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
