import { useRef, useState } from "react";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
} from "../../../utils/app_context/general";
import data from "../../../utils/data/category_data.json";
import groceryIcon from "../../../assets/grocery.svg";
import workIcon from "../../../assets/briefcase.svg";
import sportIcon from "../../../assets/sport.svg";
import designIcon from "../../../assets/design.svg";
import universityIcon from "../../../assets/education.svg";
import socialIcon from "../../../assets/social.svg";
import musicIcon from "../../../assets/music.svg";
import healthIcon from "../../../assets/heartbeat.svg";
import movieIcon from "../../../assets/video-camera.svg";
import homeIcon from "../../../assets/home.svg";
import addIcon from "../../../assets/add.svg";

export default function AddCategory() {
  const { darkMode } = useThemeContext();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { todos, updateTodos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();

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

  const updateActive = (index: number) => {
    setActive(index);
  };

  const getDefaultBgColor = (itemName: string) => {
    switch (itemName) {
      case "Grocery":
        return "bg-[#CCFF80]";
      case "Work":
        return "bg-[#FF9680]";
      case "Sports":
        return "bg-[#FF9680]";
      case "Design":
        return "bg-[#80FFD9]";
      case "University":
        return "bg-[#809CFF]";
      case "Social":
        return "bg-[#FF80EB]";
      case "Music":
        return "bg-[#FC80FF]";
      case "Health":
        return "bg-[#80FFA3]";
      case "Movie":
        return "bg-[#80D1FF]";
      case "Home":
        return "bg-[#FFCC80]";
      default:
        return "bg-[#80FFD1]";
    }
  };

  const handleSave = () => {
    const updatedTodos = todos.map((item) => ({
      ...item,
      category: valueRef.current?.textContent || "",
    }));
    updateTodos(updatedTodos);
    trackScreenFunc("success");
  };

  return (
    <div
      className={`w-full h-full ${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      }`}
    >
      <div className="w-full border-b-[#ffffff] border-b flex justify-center items-center py-4 px-2 mb-4">
        <h1 className="text-lg">Task Priority</h1>
      </div>

      <div className="w-full flex flex-wrap items-center px-4 py-2 lg:h-[200px] h-auto lg:overflow-y-auto custom-scrollbar">
        {data.map((item, index) => (
          <div
            onClick={() => updateActive(index)}
            key={index}
            className={`flex flex-col md:w-[100px] w-[60px] my-2 mx-2 py-4 px-2 justify-center items-center hover:bg-[#8687E7] cursor-pointer ${
              active === index ? "bg-[#8687E7]" : ""
            }`}
          >
            <div className={`${getDefaultBgColor(item.name)}`}>
              <button className="text-white flex flex-col items-center m-2 px-4 py-2 cursor-pointer">
                <span>
                  <img
                    src={(item.icon = getIconRender(item.name))}
                    alt="priority-icon"
                  />
                </span>
              </button>
            </div>
            <p ref={valueRef} className={active === index ? "text-white" : ""}>
              {item.name}
            </p>
          </div>
        ))}

        <div
          className={`flex flex-col md:w-[100px] w-[60px] my-2 mx-2 py-4 px-2 justify-center items-center hover:bg-[#8687E7] cursor-pointer`}
        >
          <div className="bg-[#80FFD1]">
            <button className="text-white flex flex-col items-center m-2 px-4 py-2 cursor-pointer">
              <span>
                <img src={addIcon} alt="add priority" />
              </span>
            </button>
          </div>
          <p>Create New</p>
        </div>
      </div>

      <div className="w-full flex justify-center items-center px-4 py-2">
        <button
          onClick={handleSave}
          className="w-full rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
        >
          Add Category
        </button>
      </div>
    </div>
  );
}
