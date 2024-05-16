import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  useThemeContext,
  useTodoContext,
  useTrackContext,
  useEditTodoContext,
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
import { newTaskCategoryType } from "../../../utils/types/todo";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function AddCategory() {
  const { darkMode } = useThemeContext();
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { todos, updateTodos } = useTodoContext();

  const [category, setCategory] = useState<string>("");
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const [addNewScreen, setAddNewScreen] = useState<boolean>(false);
  const [SelectedColor, setSelectedColor] = useState<Number | null>(null);

  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [SelectIcon, setSelectIcon] = useState<boolean>(false);
  const newTaskNameRef = useRef<HTMLInputElement>(null);
  const { editTodos, updateEditTodos } = useEditTodoContext();
  const [editCategory, setEditCategory] = useState<string>("");

  // for new category
  const [newCategory, setNewCategory] = useState<newTaskCategoryType>({
    name: "",
    icon: "", //file
    color: "",
  });

  const notify = (msg: string) =>
    toast(msg, { theme: darkMode ? "dark" : "light" });

  const addNewColor = [
    "bg-[#CCFF80]",
    "bg-[#FF9680]",
    "bg-[#FF9680]",
    "bg-[#809CFF]",
    "bg-[#809CFF]",
    "bg-[#FF80EB]",
    "bg-[#FC80FF]",
    "bg-[#80FFA3]",
    "bg-[#FFCC80]",
    "bg-[#80D1FF]",
    "bg-[#80FFD1]",
  ];

  const addNewIcon = [
    groceryIcon,
    workIcon,
    sportIcon,
    designIcon,
    universityIcon,
    socialIcon,
    musicIcon,
    healthIcon,
    movieIcon,
    homeIcon,
  ];

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

  const updateActive = (item: string) => {
    setActive(item);
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

  // checks for calendar page category value
  const getCalendarCategoryValue = () => {
    editTodos.map((item) => {
      if (item.category !== "") {
        setCategory(item.category);
      }
    });
  };

  const handleCategoryClick = (name: string) => {
    setCategory(name);
  };

  const handleSave = () => {
    // Check if category is empty
    if (category === "") {
      notify("Add task category");
      return; // Return early if category is empty
    }

    // Update editTodos if editCategory is not empty
    if (editCategory !== "") {
      const updatedCalendarTodos = editTodos.map((item) => ({
        ...item,
        category: category,
      }));
      updateEditTodos(updatedCalendarTodos);
      trackScreenFunc(editCategory !== "" ? "success" : "");
    } else {
      // Otherwise, update todos
      const updatedTodos = todos.map((item) => ({
        ...item,
        category: category,
      }));
      updateTodos(updatedTodos);
      trackScreenFunc("success");
    }
  };

  useEffect(() => {
    getCalendarCategoryValue();
  }, []);

  useEffect(() => {
    editTodos.map((item) => {
      if (item.category !== "") {
        setEditCategory(category);
      }
    });
    updateActive(category);
  }, [category]);
  // End of line for category screen main ui

  // Functions for newCategory screen
  const switchScreen = () => {
    setAddNewScreen(!addNewScreen);
  };

  // set export item to type file on later stage of development
  const colorSelect = (item: string, index: number) => {
    setNewCategory((prev) => ({ ...prev, color: item }));
    setSelectedColor(index);
  };

  const selectIconBtnClick = () => {
    setSelectIcon(!SelectIcon);
  };

  const handlewCategoryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategoryName(e.target.value);
    setNewCategory((prev) => ({ ...prev, name: e.target.value }));
  };

  // set item to type file on later stage of development
  const iconSelect = (item: string) => {
    setNewCategory((prev) => ({ ...prev, icon: item }));
    setSelectIcon(false);
  };

  const cancelNewCategory = () => {
    setNewCategory((prev) => ({ ...prev, name: "", color: "", icon: "" }));
    setAddNewScreen(false);
  };

  const saveNewCategory = () => {
    if (
      newCategory.name !== "" &&
      newCategory.color !== "" &&
      newCategory.icon !== ""
    )
      return setAddNewScreen(false);
    notify("Choose category items");

    if (newCategory.name === "") {
      newTaskNameRef.current?.focus();
    }
  };

  return (
    <>
      {trackScreen === "category" && !addNewScreen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, type: "tween" }}
          className={`w-full md:h-full h-[600px] custom-scrollbar overflow-y-auto ${
            darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
          }`}
        >
          <div className="w-full border-b-[#ffffff] border-b flex justify-center items-center py-4 px-2 mb-4">
            <h1 className="text-lg">Task Priority</h1>
          </div>

          <div className="w-full flex flex-wrap items-center px-4 py-2 lg:h-[250px] h-auto lg:overflow-y-auto custom-scrollbar">
            {data.map((item, index) => (
              <div
                onClick={() => updateActive(item.name)}
                key={index}
                className={`flex flex-col md:w-[100px] w-[100px] my-2 mx-2 py-4 px-2 justify-center items-center hover:bg-[#8687E7] cursor-pointer ${
                  active === item.name ? "bg-[#8687E7]" : ""
                }`}
              >
                <div
                  className={`${getDefaultBgColor(item.name)}`}
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <button className="text-white flex flex-col items-center m-2 px-4 py-2 cursor-pointer">
                    <span className="w-full">
                      <img
                        src={(item.icon = getIconRender(item.name))}
                        alt="category icon"
                        width={100}
                        height={100}
                        className="w-screen"
                      />
                    </span>
                  </button>
                </div>
                <p
                  ref={valueRef}
                  className={active === item.name ? "text-white" : ""}
                >
                  {item.name}
                </p>
              </div>
            ))}

            <div
              onClick={switchScreen}
              className={`flex flex-col md:w-[100px] w-[100px] my-2 mx-2 py-4 px-2 justify-center items-center hover:bg-[#8687E7] cursor-pointer`}
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
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`md:w-full lg:h-[450px] md:h-full h-screen w-screen py-6 px-4 md:static fixed top-0 left-0 overflow-y-auto overflow-x-hidden custom-scrollbar md:block flex flex-col md:gap-y-0 gap-y-12 ${
            darkMode
              ? "md:bg-[#363636] bg-[#000000] text-white"
              : "bg-[#ffffff] text-black"
          }`}
        >
          <div>
            <h1 className="text-2xl">Create New Category</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="md:w-2/4 w-3/4 flex flex-col my-4 px-4">
              <label htmlFor="category-name" className="my-4">
                Category Name:
              </label>
              <input
                ref={newTaskNameRef}
                type="text"
                name="newTaskName"
                value={newCategoryName}
                onChange={handlewCategoryInputChange}
                id="category-name"
                placeholder="Category name"
                className={`py-2 px-2 rounded-sm focus:border-none focus:outline-none focus:outline ${
                  darkMode
                    ? "bg-[#1d1d1d]  text-white focus:outline-[#bdbdbd]"
                    : "bg-[#bdbdbd] text-black focus:outline-[#1d1d1d]"
                }`}
              />
            </div>

            <div className="md:w-2/4 w-3/4 px-4 flex flex-col">
              <label htmlFor="category-icon" className="my-4">
                Category icon:
              </label>
              <div className="flex">
                <button
                  onClick={selectIconBtnClick}
                  className={`px-4 py-2 rounded-md ${
                    darkMode
                      ? "md:bg-[#1d1d1d] bg-[#363636] text-white"
                      : "bg-[#bdbdbd] text-black"
                  }`}
                >
                  Choose from library
                </button>
                {newCategory.icon !== "" && (
                  <div
                    className={`mx-2 rounded-md px-2 py-2 flex justify-center items-center ${
                      darkMode
                        ? "md:bg-[#1d1d1d] bg-[#363636] text-white"
                        : "bg-[#bdbdbd] text-black"
                    }`}
                  >
                    <img src={newCategory?.icon} alt="category icon" />
                  </div>
                )}
              </div>
            </div>

            {SelectIcon && (
              <div className="flex w-full overflow-x-auto">
                {addNewIcon.map((item, index) => (
                  <img
                    onClick={() => iconSelect(item)}
                    key={index}
                    src={item}
                    className="mx-2 cursor-pointer"
                    alt="category icon"
                    width={40}
                    height={40}
                  />
                ))}
              </div>
            )}

            <div className="px-4 w-full flex flex-col">
              <label htmlFor="category-color">Category color:</label>
              <div className="flex w-[800px] overflow-x-auto">
                {addNewColor.map((item, index) => (
                  <div
                    onClick={() => colorSelect(item, index)}
                    key={index}
                    className={`${item} w-8 h-8 rounded-full my-2 mx-2 cursor-pointer flex justify-center items-center`}
                  >
                    {SelectedColor === index && (
                      <CheckIcon sx={{ color: "white" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center md:static absolute bottom-0 left-0">
            <button
              onClick={cancelNewCategory}
              className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Cancel
            </button>
            <button
              onClick={saveNewCategory}
              className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
