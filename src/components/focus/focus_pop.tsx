import { useState } from "react";
import { useThemeContext } from "../../utils/app_context/general";
import { FocusPopupProps, PopupFocusDetails } from "../../utils/types/todo";

export default function Focus_pop(props: FocusPopupProps) {
  const { darkMode } = useThemeContext();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (taskName: string) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(taskName)) {
        return prevSelectedItems.filter((item) => item !== taskName);
      } else {
        return [...prevSelectedItems, taskName];
      }
    });
  };

  const handleSetFocusDuration = () => {
    const focusDetails: PopupFocusDetails = {
      name: selectedItems,
      duration: 0,
    };
    if (!selectedItems || selectedItems.length === 0) {
      props.notify("Please select task");
    } else {
      props.updateDetails(focusDetails);
      props.changeScreen("time");
    }
  };

  const cancel = () => {
    props.close();
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={`lg:w-2/4 md:w-3/4 w-full rounded-md px-6 py-2 gap-y-6 ${
          darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
        }`}
      >
        <div className="border-b border-b-[#ffffff] w-full px-2 my-6 flex flex-col justify-center items-center">
          <h1 className="text-center text-2xl my-4">
            What task(s) do you aim to complete with this focus?
          </h1>
          <small className="text-center my-2">
            Task(s) selected will be automatically marked as completed once
            focus duration is completed.
          </small>
        </div>

        <div className="w-full flex flex-col">
          {(props.contents || []).map((item, index) => (
            <div key={index} className="w-full flex gap-x-4 gap-y-4">
              <div className="my-4">
                <input
                  type="checkbox"
                  id={item.task_name}
                  className="mx-4"
                  onChange={() => handleCheckboxChange(item.task_name)}
                />
                <label htmlFor={item.task_name}>{item.task_name}</label>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-between items-center">
          <button
            onClick={handleSetFocusDuration}
            className={`w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4`}
          >
            Set focus duration
          </button>

          <button
            onClick={cancel}
            className={`w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
