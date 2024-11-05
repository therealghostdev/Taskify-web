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
  const currentDate = new Date();
  const inputDate = new Date(date); // Convert the string to a Date object

  const isSameDay = inputDate.toDateString() === currentDate.toDateString();
  const isTomorrow =
    inputDate.getDate() === currentDate.getDate() + 1 &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear();
  const isYesterday =
    inputDate.getDate() === currentDate.getDate() - 1 &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear();

  if (isSameDay) {
    return "Today";
  } else if (isTomorrow) {
    return "Tomorrow";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Format date as "dd/mm/yyyy"
    const day = inputDate.getDate().toString().padStart(2, "0");
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const year = inputDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
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
