import Cookies from "js-cookie";
import { AuthDataType } from "../types/todo";

export const getDefaultBgColor = (itemName: string) => {
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

export const formatDate = (date: string) => {
  console.log(date, "is given");
  const timezone = localStorage.getItem("timezone");

  const currentDate = new Date();
  const inputDate = new Date(date); // Convert the string to a Date object
  console.log(inputDate, "is inputDate");

  const DateInTimeZone = inputDate.toLocaleString("en-GB", {
    timeZone: timezone || "",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  console.log(DateInTimeZone, "is datein timezone");
  const [extractedDate, extractedTime] = DateInTimeZone.split(", ");

  const [day, month, year] = extractedDate.split("/").map(Number);
  const [hour, minutes, seconds] = extractedTime.split(":").map(Number);

  const convertedDate = new Date(year, month - 1, day, hour, minutes, seconds);
  console.log(convertedDate, "is convertedDate");

  const isSameDay = convertedDate.toDateString() === currentDate.toDateString();
  const isTomorrow =
    convertedDate.getDate() === currentDate.getDate() + 1 &&
    convertedDate.getMonth() === currentDate.getMonth() &&
    convertedDate.getFullYear() === currentDate.getFullYear();
  const isYesterday =
    convertedDate.getDate() === currentDate.getDate() - 1 &&
    convertedDate.getMonth() === currentDate.getMonth() &&
    convertedDate.getFullYear() === currentDate.getFullYear();

  if (isSameDay) {
    return "Today";
  } else if (isTomorrow) {
    return "Tomorrow";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Format date as "dd/mm/yyyy"
    const day = convertedDate.getDate().toString().padStart(2, "0");
    const month = (convertedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = convertedDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

export const dateTimeWrapper = (date: string, timezone: string) => {
  const utcDate = new Date(date);

  const timeInTimezone = utcDate.toLocaleString("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const [extractedDate, extractedTime] = timeInTimezone.split(", ");
  const [day, month, year] = extractedDate.split("/").map(Number);
  const [hours, minutes, seconds] = extractedTime.split(":").map(Number);

  const localDate = new Date(year, month - 1, day, hours, minutes, seconds);

  // Adjust for timezone offset
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const adjustedDate = new Date(localDate.getTime() - timezoneOffset);
  return adjustedDate;
};

export const ViewDateWrapper = (
  dateString: string | undefined,
  timezone: string
): string => {
  const now = new Date();
  const date = new Date(dateString || now);

  if (isNaN(date.getTime())) {
    return "";
  }

  // Format and return the date in the specified timezone
  const newDate = date.toLocaleString("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return new Date(newDate).toISOString();
};

// This function needs to be updated to display time in local timezone but gives error
export const formatTime = (date: string) => {
  const inputDate = new Date(date).toISOString();
  const timeParts = inputDate.split("T")[1].split(":");

  const time = `${timeParts[0]}:${timeParts[1]}`;
  return time;
};

export const queryParam = (
  query1: string,
  query2?: string
): Record<string, string> => {
  const queryParams: Record<string, string> = {
    filter_by_date: query1,
  };

  if (query2) {
    queryParams.status = query2;
  }

  return queryParams;
};

export const setAuthCookies = (authData: AuthDataType) => {
  Cookies.remove("token1");
  Cookies.remove("token2");
  Cookies.remove("token3");

  Cookies.set("token1", authData.token.split(" ")[1], {
    expires: 1,
    secure: false,
    sameSite: import.meta.env.MODE === "production" ? "Strict" : "Lax",
  });

  Cookies.set("token2", authData.csrf, {
    expires: 1,
    secure: false,
    sameSite: import.meta.env.MODE === "production" ? "Strict" : "Lax",
  });

  Cookies.set("token3", authData.refreshToken.value, {
    expires: 7,
    secure: false,
    sameSite: import.meta.env.MODE === "production" ? "Strict" : "Lax",
  });
};
