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
  const [day, month, year] = date.split("/");
  const formattedDate = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day)
  );

  if (formattedDate.toDateString() === currentDate.toDateString()) {
    return "Today";
  } else if (formattedDate.getDate() === currentDate.getDate() + 1) {
    return "Tomorrow";
  } else if (formattedDate.getDate() === currentDate.getDate() - 1) {
    return "Yesterday";
  } else {
    // Format date as "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }
};
