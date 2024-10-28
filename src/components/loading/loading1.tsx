import "./loading1.css";
import { useThemeContext } from "../../utils/app_context/general";

const LoadingSpinner = () => {
  const { darkMode } = useThemeContext();

  return (
    <div className="loading-container">
      <div
        className={`loading border-2 hover:border-t-transparent hover:border-b-transparent hover:border-l-[#8687E7] hover:border-r-[#8687E7] ${
          darkMode
            ? "border-t-transparent border-b-transparent border-l-[#fff] border-r-[#fff]"
            : "border-t-transparent border-b-transparent border-l-[#000] border-r-[#000]"
        }`}
      ></div>
      <div
        id="loading-text"
        className={`hover:text-[#8687E7] ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        loading
      </div>
    </div>
  );
};

export default LoadingSpinner;
