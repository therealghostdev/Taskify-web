import { useThemeContext } from "../../utils/app_context/general";
import LoadingSpinner3 from "../loading/loading3";
import { ChangeEvent, useState } from "react";

interface GoogleAuthenticationType {
  inputchange: (value: string) => void;
  username: string;
  close: () => void;
  continue: () => void;
  pending: boolean;
}

export default function Popup(props: GoogleAuthenticationType) {
  const { darkMode } = useThemeContext();
  const [g_error, setG_error] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.inputchange(e.target.value);

    if (props.username === "") {
      setG_error("username cannot be empty");
    } else if (props.username.length < 3) {
      setG_error("username cannot be less than 3 characters");
    } else {
      setG_error("");
    }
  };

  return (
    <section className="flex justify-center items-center w-full h-full px-8 py-4">
      <div
        className={`w-full h-full rounded-md px-6 py-2 gap-y-6 flex flex-col justify-center items-center ${
          darkMode ? "bg-[#000000] text-white" : "bg-[#ffffff] text-black"
        }`}
      >
        <div className="border-b border-b-[#ffffff] w-full px-2 my-2">
          <h1 className="text-center text-2xl my-2">
            Enter new or existing username
          </h1>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <div className="lg:w-3/4 w-full flex flex-col justify-start items-start">
            <input
              type="text"
              name="g_username"
              value={props.username}
              onChange={handleChange}
              className={`px-4 py-3 rounded-md w-full transition-all duration-700 border-2 border-[#535353] ${
                darkMode
                  ? "bg-[#363636] text-[#AFAFAF] focus:outline-none"
                  : "bg-[#bdbdbd] text-[#000000] focus:outline-none"
              } ${g_error !== "" ? "border-red-500" : ""}`}
            />

            {g_error !== "" && (
              <small className="text-red-500 text-sm my-2">
                {g_error}
              </small>
            )}
          </div>

          <div className="flex justify-center items-center mt-8">
            <button
              onClick={() => props.close()}
              className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Cancel
            </button>
            <button
              disabled={g_error !== ""}
              onClick={() => props.continue()}
              className="w-2/4 rounded-sm flex justify-center items-center hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
            >
              Continue
              {props.pending && (
                <span className="ml-4">
                  <LoadingSpinner3 />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
