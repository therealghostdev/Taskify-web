import { useToolsContext } from "../../utils/app_context/general";
import { BuildTwoTone, Edit } from "@mui/icons-material";
import Notepad from "./notepad";
import { useEffect } from "react";

export default function All() {
  const { tools, displayAllTools, showNotepad, displayNotepad } =
    useToolsContext();

  useEffect(() => {
    console.log(showNotepad);
  }, [showNotepad]);

  return (
    <>
      <button
        className="w-20 h-20 rounded-full fixed bottom-20 right-14 z-10"
        onClick={displayAllTools}
      >
        {tools && (
          <>
            <span className="absolute -top-5 mb-4" onClick={displayNotepad}>
              <Edit style={{ width: "60%", height: "60%" }} />
            </span>
          </>
        )}
        <BuildTwoTone
          style={{ width: "80%", height: "80%" }}
          className=" my-8"
        />
      </button>

      {showNotepad && <Notepad />}
    </>
  );
}
