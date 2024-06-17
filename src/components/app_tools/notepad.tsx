import {
  usePopperContext,
  useThemeContext,
} from "../../utils/app_context/general";
import { Button } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatSize,
  Close,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useState } from "react";
import { NotepadTextStyleType } from "../../utils/types/todo";
import { toast } from "react-toastify";

export default function Notepad() {
  const { darkMode } = useThemeContext();
  const { toggleActionState: toggleNotepad } = usePopperContext();
  const [noteField, setNoteField] = useState<string>("");
  const [noteTextStyle, setNoteTextStyle] = useState<NotepadTextStyleType>({
    bold: false,
    italic: false,
    fontSize: 16,
  });

  const closeAll = () => {
    toggleNotepad("notepad");
  };

  const toggleBoldText = () => {
    setNoteTextStyle((prev) => ({ ...prev, bold: !prev.bold }));
  };

  const toggleItalicText = () => {
    setNoteTextStyle((prev) => ({ ...prev, italic: !prev.italic }));
  };

  const increaseTextSize = () => {
    setNoteTextStyle((prev) => ({
      ...prev,
      fontSize: prev.fontSize ? prev.fontSize + 2 : 1,
    }));
  };

  const decreaseTextSize = () => {
    setNoteTextStyle((prev) => ({
      ...prev,
      fontSize: prev.fontSize ? Math.max(16, prev.fontSize - 2) : 1,
    }));
  };

  const customId = "2";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const handleSave = () => {
    if (noteField !== "") {
      console.log(noteField, noteTextStyle);
    } else {
      notify("No text detected");
    }
  };

  return (
    <div
      className={`fixed md:right-6 right-0 bottom-6 lg:w-[50%] md:w-[80%] w-full h-[95%] z-20 rounded-md flex flex-col gap-y-6 ${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      } overflow-auto`}
    >
      <div className="rounded-md w-full mb-2">
        <div className="absolute right-0">
          <Button
            onClick={closeAll}
            style={{
              backgroundColor: "#FF4949",
            }}
          >
            <Close className={`text-white`} />
          </Button>
        </div>
      </div>

      <h1 className="text-center font-bold text-2xl">
        List out future schedule
      </h1>

      <div className="flex flex-col items-center w-full px-4">
        <div className="w-full flex justify-around">
          <Button
            onClick={toggleBoldText}
            sx={{
              mx: 2,
              color: "#8687E7",
              background: noteTextStyle.bold ? "#8687E7" : "",
              "&:hover": {
                backgroundColor: noteTextStyle.bold
                  ? "#8687E7"
                  : "rgba(134, 135, 231, 0.1)",
              },
            }}
          >
            <FormatBold
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
          </Button>

          <Button
            onClick={toggleItalicText}
            sx={{
              mx: 2,
              color: "#8687E7",
              background: noteTextStyle.italic ? "#8687E7" : "",
              "&:hover": {
                backgroundColor: noteTextStyle.italic
                  ? "#8687E7"
                  : "rgba(134, 135, 231, 0.1)",
              },
            }}
          >
            <FormatItalic
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
          </Button>

          <Button
            onClick={increaseTextSize}
            sx={{
              mx: 2,
              color: "#8687E7",
              "&:hover": {
                backgroundColor: "rgba(134, 135, 231, 0.1)",
              },
            }}
          >
            <FormatSize
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
            <ArrowUpward style={{ marginLeft: -10 }} color="primary" />
          </Button>

          <Button
            onClick={decreaseTextSize}
            className="mx-2"
            sx={{
              mx: 2,
              color: "#8687E7",
              "&:hover": {
                backgroundColor: "rgba(134, 135, 231, 0.1)",
              },
            }}
          >
            <FormatSize
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
            <ArrowDownward style={{ marginLeft: -10 }} color="primary" />
          </Button>
        </div>

        <div
          className={`w-full mt-6 ${darkMode ? "text-white" : "text-black"}`}
        >
          <label htmlFor="add-note" hidden></label>
          <textarea
            cols={24}
            name="noteField"
            id="add-note"
            onChange={(e) => setNoteField(e.target.value)}
            value={noteField}
            placeholder="Write Something here...."
            className={`w-full py-2 px-6 rounded-md resize-none h-48  ${
              darkMode
                ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                : "bg-[#b9b9b9] text-[#000000] focus:outline-[#000000]"
            } ${noteTextStyle.bold ? "font-bold" : ""} ${
              noteTextStyle.italic ? "italic" : ""
            }`}
            style={{ fontSize: `${noteTextStyle.fontSize}px` }}
          ></textarea>
          <Button
            onClick={handleSave}
            className="w-full rounded-md"
            style={{
              backgroundColor: "#8687E7",
              color: "#ffffff",
              padding: ".8rem .6rem",
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
