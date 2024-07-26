import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
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
import ShareIcon from "@mui/icons-material/Share";

export default function Share() {
  const { darkMode } = useThemeContext();
  const { toggleActionState: toggleNotepad } = usePopperContext();
  const { notes: locallySavedNotes } = useNotesContext();
  const [selectedShare, setSelectedShare] = useState<boolean>(false);
  const [shareItem, setShareItem] = useState<Note>({
    id: "",
    title: "",
    content: "",
  });

  const closeAll = () => {
    toggleNotepad("share");
  };

  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light" });

  const getAllNotes = () => {
    if (locallySavedNotes.length < 1) {
      notify("Can't find notes");
    }
  };

  const shareNote = (itemIndex: number) => {
    setSelectedShare(true);
    setShareItem(locallySavedNotes[itemIndex]);
  };

  const closeConfirmModal = () => {
    setSelectedShare(false);
  };

  const generatePdf = async (note: Note) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10; // Margin around the edges
    let yOffset = 20; // Initial y-offset for text

    // Set font and size for title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(note.title, margin, yOffset);

    // Set font and size for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Create a temporary div for HTML content rendering
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = note.content;
    document.body.appendChild(tempDiv);

    // Get all paragraph elements
    const paragraphs = tempDiv.querySelectorAll("p");

    // Add each paragraph to the PDF with proper spacing
    paragraphs.forEach((para) => {
      const text = para.innerText; // Get text content from paragraph
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yOffset + 10 > doc.internal.pageSize.height - margin) {
          doc.addPage(); // Add a new page if necessary
          yOffset = margin; // Reset yOffset for the new page
        }
        doc.text(line, margin, yOffset);
        yOffset += 10; // Line height or spacing between lines
      });
      yOffset += 10; // Extra spacing between paragraphs
    });

    // Remove the temporary div
    document.body.removeChild(tempDiv);

    return doc.output("blob");
  };

  const confirmShare = async () => {
    notify(`Generating PDF for ${shareItem.title}`);

    try {
      const pdfBlob = await generatePdf(shareItem);

      // File sharing data
      const filesArray = [
        new File([pdfBlob], `${shareItem.title}.pdf`, {
          type: "application/pdf",
        }),
      ];
      const shareData = {
        title: shareItem.title,
        files: filesArray,
      };

      // Using Web Share API with files support
      if (navigator.canShare && navigator.canShare({ files: filesArray })) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          notify(`An error occurred while sharing ${shareItem.title}.`);
        }
      } else {
        // Fallback to file download if sharing is not supported
        saveAs(pdfBlob, `${shareItem.title}.pdf`);
        notify("Sharing not supported, file downloaded instead.");
      }
    } catch (error) {
      notify(
        `An error occurred while generating the PDF for ${shareItem.title}.`
      );
    }

    setSelectedShare(false);
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
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
            <h1>
              Select an item and share <ShareIcon className="text-yellow-300" />
            </h1>
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
              onClick={() => shareNote(index)}
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
      </motion.div>

      <AnimatePresence>
        {selectedShare && (
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
                onClick={confirmShare}
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
