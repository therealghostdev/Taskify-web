import {
  useThemeContext,
  useNotesContext,
} from "../../utils/app_context/general";
import { Button } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatSize,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function NotepadForm() {
  const { darkMode } = useThemeContext();
  const { addNote, selectedNote } = useNotesContext();
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(16);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write Something Here ....",
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-mauve-11 before:text-[#9ca3af] before-pointer-events-none",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl h-full flex-1 focus:outline-none",
      },
    },
    content: "",
  });

  useEffect(() => {
    if (selectedNote) {
      setNoteTitle(selectedNote.title);
      if (editor) {
        editor.commands.setContent(selectedNote.content);
      }
    }
  }, [selectedNote, editor]);

  const toggleBoldText = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const toggleItalicText = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize));
  };

  const handleSave = () => {
    if (editor) {
      const noteField = editor.getHTML();
      const isNoteFieldEmpty =
        noteField.trim() === "" || noteField.trim() === "<p></p>";
      if (noteTitle.trim() === "" && isNoteFieldEmpty) {
        toast("No text detected", {
          theme: darkMode ? "dark" : "light",
          toastId: "2",
        });
        return;
      }

      addNote({
        id: selectedNote ? selectedNote.id : crypto.randomUUID(),
        title: noteTitle,
        content: noteField,
      });
      toast("Note added", {
        theme: darkMode ? "dark" : "light",
        toastId: "2",
      });
      setNoteTitle("");
      editor.commands.clearContent();
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-around mb-3">
        <Button
          onClick={toggleBoldText}
          sx={{
            mx: 2,
            color: "#8687E7",
            background: editor?.isActive("bold") ? "#8687E7" : "",
            "&:hover": {
              backgroundColor: editor?.isActive("bold")
                ? "#8687E7"
                : "rgba(134, 135, 231, 0.1)",
            },
          }}
        >
          <FormatBold className={`${darkMode ? "text-white" : "text-black"}`} />
        </Button>

        <Button
          onClick={toggleItalicText}
          sx={{
            mx: 2,
            color: "#8687E7",
            background: editor?.isActive("italic") ? "#8687E7" : "",
            "&:hover": {
              backgroundColor: editor?.isActive("italic")
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
          onClick={increaseFontSize}
          sx={{
            mx: 2,
            color: "#8687E7",
            "&:hover": {
              backgroundColor: "rgba(134, 135, 231, 0.1)",
            },
          }}
        >
          <FormatSize className={`${darkMode ? "text-white" : "text-black"}`} />
          <ArrowUpward style={{ marginLeft: -10 }} color="primary" />
        </Button>

        <Button
          onClick={decreaseFontSize}
          sx={{
            mx: 2,
            color: "#8687E7",
            "&:hover": {
              backgroundColor: "rgba(134, 135, 231, 0.1)",
            },
          }}
        >
          <FormatSize className={`${darkMode ? "text-white" : "text-black"}`} />
          <ArrowDownward style={{ marginLeft: -10 }} color="primary" />
        </Button>
      </div>

      <div className="w-full">
        <div
          className={`flex flex-col w-full py-2 px-6 mb-2 rounded-md resize-none h-48  focus-within:outline focus-within:outline-2 ${
            darkMode
              ? "bg-[#252525] text-[#AFAFAF] focus-within:outline-[#b9b9b9]"
              : "bg-[#b9b9b9] text-[#000000] focus-within:outline-[#252525]"
          }`}
        >
          <input
            className={`w-full pt-1 pb-2 px-2 text-xlg ${
              darkMode
                ? "bg-[#252525] text-[#AFAFAF]"
                : "bg-[#b9b9b9] text-[#000000]"
            } outline-none`}
            type="text"
            placeholder="Title..."
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />

          <EditorContent
            editor={editor}
            className={`w-full ${
              darkMode ? "text-white" : "text-black"
            } h-full p-2 ${
              darkMode ? "border-[#616161]" : "border-[#bdbdbd]"
            }  flex flex-col overflow-auto overflow-y-auto`}
            style={{ fontSize: `${fontSize}px` }}
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full rounded-md mt-4"
          style={{
            backgroundColor: "#8687E7",
            color: "#ffffff",
            padding: ".8rem .6rem",
          }}
        >
          {selectedNote ? "update" : "Add"}
        </Button>
      </div>
    </div>
  );
}
