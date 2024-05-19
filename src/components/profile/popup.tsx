import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useThemeContext } from "../../utils/app_context/general";
import { PopupPropsTypes, changePasswordProps } from "../../utils/types/todo";
import { toast } from "react-toastify";
import useDrivePicker from "react-google-drive-picker";

export default function Popup(props: PopupPropsTypes) {
  const { darkMode } = useThemeContext();
  const [textInput, setTextInputs] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [cameraBox, setCameraBox] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [isMobile, setIsmobile] = useState<boolean>(false);
  const [changePassword, setChangePassword] = useState<changePasswordProps>({
    oldPassword: "",
    newPassword: "",
  });

  const [openPicker, authResponse] = useDrivePicker();

  const popupBox = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraButttonRef = useRef<HTMLButtonElement | null>(null);

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

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

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

  // upload images from google drive
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "103158776318-32h6jcem1ke2gdu2jng6vv3rob1e9715.apps.googleusercontent.com",
      developerKey: "AIzaSyDdXzH8017rD0V1ZgWW0E53NNgiU85Y7XU",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          notify("operation canceled");
          return;
        }
        const isValid = data.docs.every((item) =>
          item.mimeType.startsWith("image/")
        );
        if (!isValid) {
          notify("Invalid file type selected");
          return;
        } else {
          const fileUrl = data.docs[0].url;
          const fileId = fileUrl.split("/")[5]; // Extract the file ID from the URL
          const accessToken = authResponse?.access_token;
          console.log(fileId, accessToken); // To be used for further file processing
          notify("Upload successful");
          props.close();
        }
      },
    });
  };

  const getImageFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const takePictureMobile = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // upload images from desktop devices
  const startCamera = async () => {
    try {
      setCameraBox(true);

      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === "Space") {
            captureImage(stream);
          }
        };

        const handleButtonClick = () => {
          captureImage(stream);
        };

        document.addEventListener("keydown", handleKeyDown);
        cameraButttonRef.current?.addEventListener("click", handleButtonClick);

        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          stream.getTracks().forEach((track) => track.stop());
          cameraButttonRef.current?.removeEventListener(
            "click",
            handleButtonClick
          );
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = (stream: MediaStream) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (videoRef.current && ctx) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/png");
      const blob = dataURItoBlob(capturedImage);
      const file = new File([blob], "captured.png", { type: blob.type });
      setFile(file);
      stream.getTracks().forEach((track) => track.stop());

      setTimeout(() => {
        props.close();
      }, 100);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    if (file !== null) {
      notify("Image upload successfully");
      props.close();
      console.log(file);
    }
  }, [file]);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (width < 1024) {
      setIsmobile(true);
    } else {
      setIsmobile(false);
    }
  }, [width]);

  return (
    <div className="flex justify-center items-center w-full h-full px-8 py-4">
      <div
        ref={popupBox}
        className={`lg:w-2/4 md:w-3/4 w-full rounded-md px-6 py-2 gap-y-6 ${
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
                } border-none outline-none px-4 py-2`}
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
                  } border-none outline-none px-4 py-2`}
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
                  } border-none outline-none px-4 py-2`}
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
            <div>
              <button
                className="bg-transparent py-4 px-2 flex w-full my-2"
                onClick={() => {
                  window.innerWidth < 1024
                    ? takePictureMobile()
                    : startCamera();
                }}
              >
                Take picture (Desktop)
              </button>
              {cameraBox && !isMobile && (
                <div
                  className={`w-full md:h-screen h-[50px] fixed top-0 lg:left-0 left-0 ${
                    darkMode ? "dark-overlay" : "light-overlay"
                  }`}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    autoPlay
                    playsInline
                  ></video>
                  <button
                    ref={cameraButttonRef}
                    className="md:w-20 md:h-20 w-16 h-16 rounded-full bg-[#8687E7] z-50 camera-button cursor-pointer flex justify-center items-center"
                  >
                    <div className="w-2/4 h-2/4 border-8 border-[#bdbdbd] rounded-full"></div>
                  </button>
                </div>
              )}

              {!cameraBox && isMobile && (
                <input
                  accept="image/png, image/jpeg"
                  type="file"
                  ref={cameraInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              )}
            </div>

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

            <button
              onClick={handleOpenPicker}
              className="bg-transparent py-4 px-2 flex w-full my-2"
            >
              Import from Google Drive
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
