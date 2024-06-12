import React, { useEffect, useRef, useState } from "react";
import navData from "../../../utils/data/nav_data.json";
import type { NavItem } from "../../../utils/types/todo";
import homeIcon from "../../../assets/home-2.svg";
import calendarIcon from "../../../assets/calendar.svg";
import addIcon from "../../../assets/add.svg";
import focusIcon from "../../../assets/clock.svg";
import userIcon from "../../../assets/user.svg";
import { Link, useLocation } from "react-router-dom";
import {
  useThemeContext,
  useTrackContext,
  useTodoContext,
} from "../../../utils/app_context/general";
import { motion, useAnimation } from "framer-motion";

export default function Nav() {
  const currentPath = useLocation();
  const { darkMode } = useThemeContext();
  const [pathname, setPathname] = useState<string>(currentPath.pathname);
  const navRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const anchorRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { todos } = useTodoContext();
  const { trackScreenFunc } = useTrackContext();
  const controls = useAnimation();

  const addTask = () => {
    todos.forEach((item) => {
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
    let startY: number;

    const handleTouchStart = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const endY = event.touches[0].clientY;
      if (startY - endY > 50) {
        showNav();
      }
    };

    const showNav = () => {
      controls.start({ y: 0 });
    };

    const hideNav = () => {
      controls.start({ y: 75 });
    };

    const handleClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        hideNav();
      }
    };

    anchorRefs.current.forEach((ref) => {
      if (ref) {
        ref.addEventListener("click", showNav);
      }
    });

    window.addEventListener("scroll", hideNav);
    window.addEventListener("click", handleClick);
    navRef.current?.addEventListener("mouseover", showNav);

    addButtonRef.current?.addEventListener("touchstart", handleTouchStart);
    addButtonRef.current?.addEventListener("touchmove", handleTouchMove);
    addButtonRef.current?.addEventListener("click", showNav);

    return () => {
      anchorRefs.current.forEach((ref) => {
        if (ref) {
          ref.removeEventListener("click", showNav);
        }
      });
      window.removeEventListener("scroll", hideNav);
      window.removeEventListener("click", handleClick);
      navRef.current?.removeEventListener("mouseover", showNav);

      addButtonRef.current?.removeEventListener("touchstart", handleTouchStart);
      addButtonRef.current?.removeEventListener("touchmove", handleTouchMove);
      addButtonRef.current?.removeEventListener("click", showNav);
    };
  }, [controls]);

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
          initial={{ y: 75 }}
          animate={controls}
          transition={{ duration: 0.8, type: "tween" }}
        >
          <div className="w-full h-full flex justify-between items-center px-4">
            {navData.map((item, index) => (
              <NavItemComponent
                key={index}
                item={item}
                darkMode={darkMode}
                addButtonRef={addButtonRef}
                setAnchorRef={(el) => (anchorRefs.current[index] = el)}
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
  addButtonRef,
  setAnchorRef,
}: {
  item: NavItem;
  darkMode: boolean;
  addButtonRef: React.RefObject<HTMLButtonElement>;
  setAnchorRef: (el: HTMLAnchorElement | null) => void;
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
          ref={addButtonRef}
          className="flex items-center justify-center text-white w-14 h-14 bg-[#8687E7] rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <img src={icon} alt={item.name} className="w-6 h-6" />
        </button>
      ) : (
        <Link
          to={item.Link}
          ref={setAnchorRef}
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
