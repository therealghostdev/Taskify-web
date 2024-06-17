import Popper from "./Popper";
import { usePopperContext } from "../../utils/app_context/general";
import Notepad from "./notepad";

export default function Index() {
  const { actionsState } = usePopperContext();

  const displayNotepad = actionsState.notepad;

  return (
    <>
      <Popper />
      {displayNotepad && <Notepad />}
    </>
  );
}
