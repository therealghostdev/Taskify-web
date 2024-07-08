import { useEffect, useState } from "react";
import {
  useThemeContext,
  usePopperContext,
  useNotesContext,
} from "../../utils/app_context/general";
import { Button } from "@mui/material";
import Close from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import { AnimatePresence, motion } from "framer-motion";
import { Note } from "../../utils/types/todo";

export default function Save() {
  const { darkMode } = useThemeContext();
  const { toggleActionState: toggleNotepad } = usePopperContext();
  const { notes: locallySavedNotes } = useNotesContext();
  const [selectedSave, setSelectedSave] = useState<boolean>(false);
  const [saveItem, setSaveItem] = useState<Note>({
    id: "",
    title: "",
    content: "",
  });

  const closeAll = () => {
    toggleNotepad("save");
  };

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const getAllNotes = () => {
    if (locallySavedNotes.length < 1) {
      notify("Can't find notes");
    }
  };

  const saveItemtoServer = (item: number) => {
    setSelectedSave(true);
    setSaveItem(locallySavedNotes[item]);
  };

  const closeConfirmModal = () => {
    setSelectedSave(false);
  };

  const confirmSave = () => {
    notify(`${saveItem.title} saved`);
    setSelectedSave(false);
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 m-auto flex lg:w-[60%] md:w-[90%] w-full lg:h-[60%] h-[50%] z-20 rounded-md flex-col gap-y-6 ${
          darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
        } overflow-auto px-6`}
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

        {locallySavedNotes.length >= 1 && (
          <div className="text-2xl font-bold">
            <h1>Select an item and save</h1>
          </div>
        )}
        <div
          className={`flex flex-col border ${
            darkMode ? "border-[#bdbdbd]" : "border-[#363636]"
          } py-4 px-2 rounded-md flex-wrap justify-around items-center w-full h-full my-2 gap-x-3 gap-y-3 overflow-auto bg-transparent`}
        >
          {locallySavedNotes.map((item, index) => (
            <div
              key={index}
              onClick={() => saveItemtoServer(index)}
              className={`flex lg:w-[40%] md:h-[200px] h-[150px] w-2/4 shadow-custom-1 ${
                darkMode ? "shadow-[#bdbdbd]" : "shadow-[#363636]"
              } hover:shadow-[#8687e7] cursor-pointer md:my-2 my-1 overflow-auto text-white rounded-md mx-2 bg-transparent backdrop-blur-lg`}
            >
              <div className="w-full flex flex-col gap-y-4 px-2 py-2">
                <h1 className="font-bold text-2xl">{item.title}</h1>

                <div
                  className="text-lg text-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedSave && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`fixed inset-0 m-auto flex items-center justify-center lg:w-[60%] md:w-[90%] w-full lg:h-[60%] h-[50%] z-50 rounded-md flex-col gap-y-6 ${
              darkMode ? "bg-[#363636] text-white" : "bg-[#bdbdbd] text-black"
            } overflow-auto px-6`}
          >
            <h1 className="text-2xl font-bold my-4">ARE YOU SURE?</h1>

            <div className="rounded-md w-full flex justify-around items-center mb-2 gap-x-6">
              <Button
                className="w-2/4"
                onClick={closeConfirmModal}
                style={{
                  backgroundColor: "#FF4949",
                  padding: "2% 2%",
                }}
              >
                <Close className={`text-white`} />
              </Button>

              <Button
                className="w-2/4"
                onClick={confirmSave}
                style={{
                  backgroundColor: "#8687E7",
                  padding: "2% 2%",
                }}
              >
                <CheckIcon className={`text-white`} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
