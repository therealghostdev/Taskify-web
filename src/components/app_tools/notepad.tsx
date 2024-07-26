import {
  usePopperContext,
  useThemeContext,
  useNotesContext,
} from "../../utils/app_context/general";
import { Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import NotepadList from "./NotePadList";
import NotepadForm from "./Form";
import NoteView from "./NoteView";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Notepad() {
  const { displayNote, selectedNote } = useNotesContext();
  const { darkMode } = useThemeContext();
  const { toggleActionState: toggleNotepad } = usePopperContext();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const closeAll = () => {
    toggleNotepad("notepad");
  };

  useEffect(() => {
    if (selectedNote && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedNote]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className={`fixed md:right-6 right-0 bottom-6 lg:w-[50%] md:w-[80%] w-full h-[95%] z-20 rounded-md flex flex-col gap-y-6 ${
        darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
      } overflow-auto`}
      ref={containerRef}
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
      <div className="flex flex-col gap-y-4 items-center w-full px-4">
        {/*Render notepad Form */}
        {displayNote ? <NoteView /> : <NotepadForm />}

        {/*Render notepad List */}
        {<NotepadList />}
      </div>
    </motion.div>
  );
}
