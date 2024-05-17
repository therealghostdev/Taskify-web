import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useThemeContext } from "../../utils/app_context/general";
import { PopupPropsTypes, changePasswordProps } from "../../utils/types/todo";
import { toast } from "react-toastify";

export default function Popup(props: PopupPropsTypes) {
  const { darkMode } = useThemeContext();
  const [textInput, setTextInputs] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [changePassword, setChangePassword] = useState<changePasswordProps>({
    oldPassword: "",
    newPassword: "",
  });

  const popupBox = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (popupBox.current && !popupBox.current.contains(e.target as Node)) {
        props.close();
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const validateTextInput = () => {
    let error = false;

    if (textInput === "") {
      error = true;
    } else {
      error = false;
    }
    return error;
  };

  const handleTextInputSave = () => {
    if (!validateTextInput()) {
      props.close();
      notify("Action successful");
    } else {
      notify("Invalid input");
    }
  };

  const validatPasswordInputs = () => {
    let error = false;

    if (
      changePassword.newPassword === "" ||
      changePassword.oldPassword === ""
    ) {
      error = true;
    } else if (changePassword.newPassword === changePassword.oldPassword) {
      error = true;
    } else {
      error = false;
    }

    return error;
  };

  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light" });

  const handlePasswordInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setChangePassword((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChangeSave = () => {
    if (!validatPasswordInputs()) {
      props.close();
      notify("Action successful");
    } else {
      notify("invalid inputs");
    }
  };

  const cancel = () => {
    props.close();
  };

  const getImageFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (file !== null) {
      notify("Image upload sucessfully");
      props.close();
    }
  }, [file]);

  return (
    <div className="flex justify-center items-center w-full h-full px-8 py-4">
      <div
        ref={popupBox}
        className={`lg:w-2/4 md:w-3/4 w-full rounded-md px-6 py-2 gap-y-6   ${
          darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
        } ${
          props.camera
            ? "lg:static absolute bottom-0 md:left-24 left-0 flex flex-col gap-4"
            : ""
        }`}
      >
        <div className="border-b border-b-[#ffffff] w-full px-2 my-6">
          <h1 className="text-center text-2xl my-4">
            Change account {props.text}
          </h1>
        </div>
        {props.singleInput && (
          <div className="w-full">
            <div className="w-full flex justify-center items-center">
              <input
                type="text"
                name="textInput"
                value={textInput}
                onChange={(e) => setTextInputs(e.target.value || "")}
                className={`border-[#ffffff] rounded-sm w-3/4 ${
                  darkMode
                    ? "bg-[#363636] text-[#AFAFAF] focus:outline-[#ffffff] outline outline-[#ffffff]"
                    : "bg-[#bdbdbd] text-[#000000] focus:outline-[#000000] outline outline-[#000000]"
                } border-none outline-none
            px-4 py-2`}
              />
            </div>

            <div className="flex justify-center items-center mt-8">
              <button
                onClick={cancel}
                className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
              >
                Cancel
              </button>
              <button
                onClick={handleTextInputSave}
                className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {!props.singleInput && !props.camera && (
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex flex-col justify-center items-center my-2">
              <div className="flex w-full flex-col">
                <label htmlFor="old-password" className="my-2">
                  old password
                </label>
                <input
                  id="old-password"
                  type="password"
                  name="oldPassword"
                  value={changePassword.oldPassword}
                  onChange={handlePasswordInputsChange}
                  className={`border-[#ffffff] rounded-sm md:w-3/4 w-full ${
                    darkMode
                      ? "bg-[#363636] text-[#AFAFAF] focus:outline-[#ffffff] outline outline-[#ffffff]"
                      : "bg-[#bdbdbd] text-[#000000] focus:outline-[#000000] outline outline-[#000000]"
                  } border-none outline-none
            px-4 py-2`}
                />
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center my-2">
              <div className="flex w-full flex-col">
                <label htmlFor="new-password" className="my-2">
                  old password
                </label>
                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  value={changePassword.newPassword}
                  onChange={handlePasswordInputsChange}
                  className={`border-[#ffffff] rounded-sm md:w-3/4 w-full ${
                    darkMode
                      ? "bg-[#363636] text-[#AFAFAF] focus:outline-[#ffffff] outline outline-[#ffffff]"
                      : "bg-[#bdbdbd] text-[#000000] focus:outline-[#000000] outline outline-[#000000]"
                  } border-none outline-none
            px-4 py-2`}
                />
              </div>
            </div>

            <div className="flex justify-center items-center mt-8">
              <button
                onClick={cancel}
                className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChangeSave}
                className="w-2/4 rounded-sm hover:text-white text-[#8687E7] hover:bg-[#8687E7] px-4 py-4 my-6 mx-4"
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {props.camera && (
          <div className={`flex flex-col gap-2`}>
            <button className="bg-transparent py-4 px-2 flex w-full my-2">
              Take picture
            </button>

            <div>
              <button
                className="bg-transparent py-4 px-2 flex w-full my-2"
                onClick={getImageFromGallery}
              >
                Import from Gallery
              </button>
              <input
                accept="image/png, image/jpeg"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileInputChange}
              />
            </div>

            <button className="bg-transparent py-4 px-2 flex w-full my-2">
              Import from Google Drive
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
