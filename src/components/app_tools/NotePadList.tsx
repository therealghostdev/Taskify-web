import { useNotesContext } from "../../utils/app_context/general";
import { Grid } from "@mui/material";
import NoteCard from "./NoteCard";

const NotepadList = () => {
  const { notes, deleteNote, selectNote, selectedNote } = useNotesContext();

  const handleDeleteNote = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    deleteNote(id);
  };

  return (
    <Grid
      container
      rowSpacing={{ xs: 1, sm: 2 }}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ mt: 1 }}
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          selectedNoteId={selectedNote?.id}
          selectNote={selectNote}
          handleDeleteNote={handleDeleteNote}
        />
      ))}
    </Grid>
  );
};

export default NotepadList;
