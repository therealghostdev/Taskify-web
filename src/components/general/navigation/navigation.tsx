import React, { useEffect, useRef, useState } from "react";
import navData from "../../../utils/data/nav_data.json";
import type { NavItem } from "../../../utils/types/todo";
import homeIcon from "../../../assets/home-2.svg";
import calendarIcon from "../../../assets/calendar.svg";
import addIcon from "../../../assets/add.svg";
import focusIcon from "../../../assets/clock.svg";
import userIcon from "../../../assets/user.svg";
import { Link } from "react-router-dom";
import { useThemeContext } from "../../../utils/app_context/general";
import { motion, useMotionValue } from "framer-motion";

export default function Nav() {
  const { darkMode } = useThemeContext();
  const navBarY = useMotionValue(80); // nav partially hidden by default
  const navRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = React.useState({ y: 80 });

  useEffect(() => {
    const handleMouseEnter = () => {
      setAnimate({ y: 0 }); // Set nav as visible
    };

    const handleMouseLeave = () => {
      setAnimate({ y: 80 }); // Set nav as not visible
    };

    if (navRef.current) {
      navRef.current?.addEventListener("mouseenter", handleMouseEnter);
      navRef.current?.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (navRef.current) {
        navRef.current?.removeEventListener("mouseenter", handleMouseEnter);
        navRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <motion.nav
      key="nav"
      ref={navRef}
      className={`fixed bottom-0 w-screen h-[100px] text-white ${
        darkMode ? "bg-[#363636]" : "bg-[#bdbdbd]"
      }`}
      style={{ y: navBarY }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      animate={animate}
    >
      <div className="w-full h-full flex justify-between items-center px-4">
        {navData.map((item, index) => (
          <NavItemComponent key={index} item={item} darkMode={darkMode} />
        ))}
      </div>
    </motion.nav>
  );
}

function NavItemComponent({
  item,
  darkMode,
}: {
  item: NavItem;
  darkMode: boolean;
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
        <button className="flex items-center justify-center text-white w-14 h-14 bg-[#8687E7] rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
