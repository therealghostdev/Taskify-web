import React, { useEffect, useRef, useState } from "react";
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
  useTrackContext,
  useTodoContext,
} from "../../../utils/app_context/general";
import { motion, useMotionValue } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Nav() {
  const currentPath = useLocation();
  const { darkMode } = useThemeContext();
  const navBarY = useMotionValue(80); // nav partially hidden by default
  const navRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null); // Ref for the button
  const [animate, setAnimate] = useState({ y: 90 });
  const { trackScreenFunc } = useTrackContext();
  const { todos } = useTodoContext();
  const [pathname, setPathname] = useState<string>(currentPath.pathname);

  const addTask = () => {
    todos.map((item) => {
      if (item.task === "") {
        trackScreenFunc("name");
      } else if (item.expected_date_of_completion === "") {
        trackScreenFunc("calendar");
      } else if (item.time === "") {
        trackScreenFunc("time");
      } else if (item.task_priority === 0) {
        trackScreenFunc("priority");
      } else if (item.category === "") {
        trackScreenFunc("category");
      } else {
      }
    });
  };

  useEffect(() => {
    setPathname(currentPath.pathname);
  }, [currentPath.pathname]);

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

  useEffect(() => {
    const handleClick = () => {
      addTask();
    };

    if (addButtonRef.current) {
      addButtonRef.current.addEventListener("click", handleClick);
    }

    return () => {
      if (addButtonRef.current) {
        addButtonRef.current.removeEventListener("click", handleClick);
      }
    };
  }, [addTask]);

  return (
    <>
      {pathname !== "/auth" && (
        <motion.nav
          key="nav"
          ref={navRef}
          className={`fixed bottom-0 w-screen h-[100px] text-white cursor-pointer ${
            darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
          } ${pathname === "/profile" ? "z-0" : "z-[20]"}`}
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
                addButtonRef={addButtonRef} // Pass the ref to NavItemComponent
              />
            ))}
          </div>
        </motion.nav>
      )}
    </>
  );
}

function NavItemComponent({
  item,
  darkMode,
  addButtonRef, // Receive the ref as a prop
}: {
  item: NavItem;
  darkMode: boolean;
  addButtonRef: React.RefObject<HTMLButtonElement>; // Define the type of the ref
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

  const location = useLocation();
  const path = location.pathname;

  const isActive = path === item.Link;

  return (
    <>
      {icon && icon === addIcon ? (
        <button
          ref={addButtonRef} // Assign the ref to the button
          className="flex items-center justify-center text-white w-14 h-14 bg-[#8687E7] rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src={icon} alt={item.name} className="w-6 h-6" />
        </button>
      ) : (
        <Link
          to={item.Link}
          className={`flex flex-col items-center justify-center link hover:text-[#8687E7] py-1 ${
            darkMode && !isActive
              ? "text-white"
              : !darkMode && !isActive
              ? "text-black"
              : isActive
              ? "border-b-4 border-[#8687E7] text-[#8687E7]"
              : ""
          }`}
        >
          <img
            src={icon}
            alt={item.name}
            className={`w-6 h-6 ${
              darkMode && !isActive
                ? "img-hover-invert-dark"
                : !darkMode && !isActive
                ? "filter-invert img-hover-invert-light"
                : isActive && darkMode
                ? "img-path-invert-dark"
                : isActive && !darkMode
                ? "img-path-invert-light"
                : ""
            }`}
          />
          <span className={`text-xl`}>{item.name}</span>
        </Link>
      )}
    </>
  );
}
