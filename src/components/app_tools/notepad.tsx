import {
  useThemeContext,
  useToolsContext,
} from "../../utils/app_context/general";
import { Button } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { FormatBold, FormatItalic, FormatSize } from "@mui/icons-material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useState } from "react";
import { NotepadTextStyleType } from "../../utils/types/todo";
import { toast } from "react-toastify";

export default function Notepad() {
  const { darkMode } = useThemeContext();
  const { displayNotepad, displayAllTools } = useToolsContext();
  const [noteField, setNoteField] = useState<string>("");
  const [noteTextStyle, setNoteTextStyle] = useState<NotepadTextStyleType>({
    bold: false,
    italic: false,
    fontIncrease: 1,
    fontDecrease: 1,
  });

  const closeAll = () => {
    displayNotepad();
    displayAllTools();
  };

  const addBoldText = () => {
    setNoteTextStyle((prev) => ({ ...prev, bold: !prev.bold }));
  };

  const addItalicText = () => {
    setNoteTextStyle((prev) => ({ ...prev, italic: !prev.italic }));
  };

  const increaseTextSize = () => {
    setNoteTextStyle((prev) => ({
      ...prev,
      fontIncrease: prev.fontIncrease ? prev.fontIncrease * 2 : 1,
    }));
  };

  const decreaseTextSize = () => {
    setNoteTextStyle((prev) => ({
      ...prev,
      fontIncrease: prev.fontIncrease ? prev.fontIncrease - 2 : 1,
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
            onClick={addBoldText}
            className="mx-2"
            style={{ background: noteTextStyle.bold ? "#8687E7" : "" }}
          >
            <FormatBold
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
          </Button>

          <Button
            onClick={addItalicText}
            className="mx-2"
            style={{ background: noteTextStyle.italic ? "#8687E7" : "" }}
          >
            <FormatItalic
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
          </Button>

          <Button
            onClick={increaseTextSize}
            className="mx-2"
            style={{
              background:
                noteTextStyle.fontIncrease && noteTextStyle.fontIncrease > 1
                  ? "#8687E7"
                  : "",
            }}
          >
            <FormatSize
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
            <ArrowUpward style={{ marginLeft: -10 }} />
          </Button>

          <Button
            onClick={decreaseTextSize}
            className="mx-2"
            style={{
              background:
                noteTextStyle.fontIncrease && noteTextStyle.fontIncrease > 1
                  ? "#8687E7"
                  : "",
            }}
          >
            <FormatSize
              className={`${darkMode ? "text-white" : "text-black"}`}
            />
            <ArrowDownward style={{ marginLeft: -10 }} />
          </Button>
        </div>

        <div
          className={`w-full mt-6 ${darkMode ? "text-white" : "text-black"}`}
        >
          <label htmlFor="add-note" hidden></label>
          <textarea
            rows={6}
            cols={24}
            name="noteField"
            id="add-note"
            onChange={(e) => setNoteField(e.target.value)}
            value={noteField}
            placeholder="Write Something here...."
            className={`w-full py-2 px-6 rounded-md resize-none ${
              darkMode
                ? "bg-[#252525] text-[#AFAFAF] focus:outline-[#ffffff]"
                : "bg-[#b9b9b9] text-[#000000] focus:outline-[#000000]"
            }`}
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
