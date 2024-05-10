import { useEffect, useRef, useState } from "react";
import navData from "../../../utils/data/nav_data.json";
import type { NavItem } from "../../../utils/types/todo";
import homeIcon from "../../../assets/home-2.svg";
import calendarIcon from "../../../assets/calendar.svg";
import addIcon from "../../../assets/add.svg";
import focusIcon from "../../../assets/clock.svg";
import userIcon from "../../../assets/user.svg";
import { Link } from "react-router-dom";
import {
  useThemeContext,
  // usePopupContext,
  useTrackContext,
  useTodoContext,
} from "../../../utils/app_context/general";
import { motion, useMotionValue } from "framer-motion";

export default function Nav() {
  const { darkMode } = useThemeContext();
  const navBarY = useMotionValue(80); // nav partially hidden by default
  const navRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState({ y: 90 });
  // const { newTaskPopup, togglePopupState } = usePopupContext();
  const { trackScreen, trackScreenFunc } = useTrackContext();
  const { todos } = useTodoContext();

  useEffect(() => {
    const handleMouseEnter = () => {
      setAnimate({ y: 0 }); // Set nav as visible
    };

    const handleMouseLeave = () => {
      setAnimate({ y: 90 }); // Set nav as partially hidden
    };

    const handleTouchStart = () => {
      setAnimate({ y: 0 }); // Set nav as visible on touch start
    };

    if (navRef.current) {
      navRef.current.addEventListener("mouseenter", handleMouseEnter);
      navRef.current.addEventListener("mouseleave", handleMouseLeave);
      navRef.current.addEventListener("touchstart", handleTouchStart);
    }

    return () => {
      if (navRef.current) {
        navRef.current.removeEventListener("mouseenter", handleMouseEnter);
        navRef.current.removeEventListener("mouseleave", handleMouseLeave);
        navRef.current.removeEventListener("touchstart", handleTouchStart);
      }
    };
  }, [navBarY]);

  const addTask = () => {
    // togglePopupState("name");
    todos.map((item) => {
      if (item.task === "") {
        trackScreenFunc("name");
      } else if (item.expected_date_of_completion === "") {
        trackScreenFunc("calendar");
      } else if (item.time === "") {
        trackScreenFunc("time");
      } else if (item.task_priority === 0) {
        trackScreenFunc("priority");
      } else {
      }
    });

    console.log(trackScreen);
  };

  return (
    <motion.nav
      key="nav"
      ref={navRef}
      className={`fixed bottom-0 w-screen h-[100px] text-white cursor-pointer ${
        darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
      }`}
      style={{ y: navBarY }}
      transition={{ duration: 0.8, type: "tween" }}
      animate={animate}
    >
      <div className="w-full h-full flex justify-between items-center px-4">
        {navData.map((item, index) => (
          <NavItemComponent
            key={index}
            item={item}
            darkMode={darkMode}
            addTask={addTask}
          />
        ))}
      </div>
    </motion.nav>
  );
}

function NavItemComponent({
  item,
  darkMode,
  addTask,
}: {
  item: NavItem;
  darkMode: boolean;
  addTask: () => void;
}) {
  let icon;
  switch (item.icon) {
    case "/home-2.svg":
      icon = homeIcon;
      break;
    case "/calendar.svg":
      icon = calendarIcon;
      break;
    case "/add.svg":
      icon = addIcon;
      break;
    case "/clock.svg":
      icon = focusIcon;
      break;
    case "/user.svg":
      icon = userIcon;
      break;
    default:
      icon = null;
  }

  return (
    <>
      {icon && icon === addIcon ? (
        <button
          onClick={addTask}
          className="flex items-center justify-center text-white w-14 h-14 bg-[#8687E7] rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src={icon} alt={item.name} className="w-6 h-6" />
        </button>
      ) : (
        <Link
          to={item.Link}
          className={`flex flex-col items-center justify-center ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          <img
            src={icon}
            alt={item.name}
            className={`w-6 h-6 ${darkMode ? "" : "filter-invert"}`}
          />
          <span className={`text-xs ${darkMode ? "text-white" : "text-black"}`}>
            {item.name}
          </span>
        </Link>
      )}
    </>
  );
}
