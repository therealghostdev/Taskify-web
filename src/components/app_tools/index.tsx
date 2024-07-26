import Popper from "./Popper";
import { usePopperContext } from "../../utils/app_context/general";
import Notepad from "./notepad";
import { useEffect } from "react";
import Save from "./save";
import Print from "./print";
import Share from "./share";
import { AnimatePresence } from "framer-motion";

export default function Index() {
  const { actionsState } = usePopperContext();

  const displayNotepad = actionsState.notepad;
  const displaySaveUi = actionsState.save;
  const displayPrintUI = actionsState.print;
  const shareui = actionsState.share;

  const openTool = () => {
    if (actionsState.notepad) {
      actionsState.save = false;
      actionsState.print = false;
      actionsState.share = false;
    } else if (actionsState.save) {
      actionsState.notepad = false;
      actionsState.print = false;
      actionsState.share = false;
    } else if (actionsState.print) {
      actionsState.notepad = false;
      actionsState.save = false;
      actionsState.share = false;
    } else {
      actionsState.notepad = false;
      actionsState.save = false;
      actionsState.print = false;
    }
  };

  useEffect(() => {
    openTool();
  }, [actionsState]);

  return (
    <>
      <Popper />
      {<AnimatePresence>{displayNotepad && <Notepad />}</AnimatePresence>}
      {<AnimatePresence>{displaySaveUi && <Save />}</AnimatePresence>}
      {<AnimatePresence>{displayPrintUI && <Print />}</AnimatePresence>}
      {<AnimatePresence>{shareui && <Share />}</AnimatePresence>}
    </>
  );
}
