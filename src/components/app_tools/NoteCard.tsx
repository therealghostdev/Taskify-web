import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Note } from "../../utils/app_context/general";

interface NoteCardProps {
  note: Note;
  selectedNoteId: string | null | undefined;
  selectNote: (note: Note) => void;
  handleDeleteNote: (event: React.MouseEvent, id: string) => void;
}

const NoteCard = ({
  note,
  selectedNoteId,
  selectNote,
  handleDeleteNote,
}: NoteCardProps) => {
  if (selectedNoteId === note.id) {
    return null;
  }

  return (
    <Grid item xs={6} key={note.id}>
      <CardActionArea className="h-full">
        <Card
          className="flex justify-between h-full max-h-28 cursor-pointer"
          onClick={() => selectNote(note)}
        >
          <CardContent className="overflow-hidden h-full max-h-28">
            <div className="text-lg font-medium">{note.title}</div>
            <div className="line-clamp-2 text-ellipsis whitespace-normal">
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          </CardContent>
          <CardActions className="items-start">
            <IconButton
              aria-label="delete"
              onClick={(event) => handleDeleteNote(event, note.id)}
            >
              <Close />
            </IconButton>
          </CardActions>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

export default NoteCard;