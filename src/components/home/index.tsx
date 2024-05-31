import data from "../../utils/data/task_data.json";
import noItem from "../../assets/Checklist-rafiki 1.svg";
import userData from "../../utils/data/user_data.json";
import defaultImg from "../../assets/default-profile.png";
import filterIcon from "../../assets/filter-icon.svg";
import { useThemeContext } from "../../utils/app_context/general";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, useRef } from "react";

export default function Index() {
  const { darkMode } = useThemeContext();
  const [width] = useState<number>(window.innerWidth);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const updateViewValue = () => {
      if (width < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    updateViewValue();
  }, [width]);

  const showInputOnMobileDevices = () => {
    setDisplayInput(!displayInput);
  };

  useEffect(() => {
    const clickOutsideinputContainer = (e: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target as Node)
      ) {
        setDisplayInput(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideinputContainer);

    return () => {
      document.removeEventListener("mousedown", clickOutsideinputContainer);
    };
  }, []);

  useEffect(() => {
    console.log(isMobileView);
  }, [isMobileView]);

  return (
    <section
      className={`flex flex-col px-6 py-3 ${
        darkMode ? "text-white" : "text-black"
      }`}
    >
      <section
        className={`w-full flex justify-center items-center md:px-4 py-2 bg-transparent`}
      >
        <div
          className={`w-full flex justify-between items-center rounded-full backdrop-blur-lg bg-opacity-80 border ${
            darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
          }`}
        >
          <div className="w-1/3 flex items-center justify-center relative">
            {isMobileView && (
              <div className="relative" ref={inputContainerRef}>
                <span
                  className="flex w-full justify-center items-center"
                  onClick={showInputOnMobileDevices}
                >
                  <img
                    src={filterIcon}
                    alt="filter-task"
                    className="w-80 h-2/4"
                  />
                </span>
                {isMobileView && displayInput && (
                  <div className="absolute top-32 left-2 w-[280px]">
                    <span className="absolute left-2 top-2">
                      <SearchIcon />
                    </span>
                    <label htmlFor="search" hidden></label>
                    <input
                      ref={mobileInputRef}
                      id="search"
                      type="text"
                      className={`rounded-md w-full px-12 ${
                        darkMode
                          ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                          : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                      } border-none outline-none px-4 py-3`}
                    />
                  </div>
                )}
              </div>
            )}

            {!isMobileView && (
              <>
                <span className="absolute lg:left-16 left-8">
                  <SearchIcon />
                </span>
                <label htmlFor="search" hidden></label>
                <input
                  id="search"
                  type="text"
                  className={`rounded-sm md:w-3/4 w-full px-12 ${
                    darkMode
                      ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                      : "bg-[#a5a5a5] text-[#000000] focus:outline-[#000000]"
                  } border-none outline-none px-4 py-2`}
                />
              </>
            )}
          </div>

          <div className="w-1/3 flex items-center justify-center mx-2">
            <h1 className="md:text-3xl text-lg text-center">
              Todays Task List
            </h1>
          </div>

          <div className="w-1/3 h-full flex items-center justify-center">
            <div className="w-full flex flex-col justify-center items-center md:w-2/4 px-4 py-2">
              {userData.map((user, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col justify-center items-center"
                >
                  <div className="w-20 h-20 flex justify-center items-center rounded-full">
                    <img
                      src={user.image || defaultImg}
                      alt="profile-img"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
