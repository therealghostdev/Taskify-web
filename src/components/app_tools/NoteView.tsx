import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useNotesContext } from "../../utils/app_context/general";

const NoteView = () => {
  const {
    selectedNote: note,
    toggleDisplay,
    deleteNote,
    selectNote,
  } = useNotesContext();

  const handleClose = () => {
    selectNote(null);
  };
  return (
    <>
      {note && (
        <Card className="flex justify-between flex-col h-48 w-full cursor-pointer">
          <CardHeader sx={{ pb: 0 }} title={note.title} />
          <CardContent className="overflow-hidden h-full max-h-28">
            <div>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          </CardContent>
          <CardActions className="flex justify-between">
            <div className="flex gap-x-4">
              <Button
                variant="contained"
                size="small"
                onClick={() => toggleDisplay(false)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => deleteNote(note.id)}
              >
                Delete
              </Button>
            </div>
            <div>
              <Button size="small" onClick={handleClose}>
                Close
              </Button>
            </div>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default NoteView;
