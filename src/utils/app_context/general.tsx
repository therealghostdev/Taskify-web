import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, ThemeContextType, Note } from "../types/todo";
import actions from "../../components/app_tools/actions";
import { type ActionsState } from "../types/todo";
import Cookies from "js-cookie";

// Create the initial state based on actions
const initialActionsState: ActionsState = actions.reduce((state, action) => {
  state[action.name.toLowerCase()] = false;
  return state;
}, {} as ActionsState);

// Create a context for managing the todo list
const TodoContext = createContext<{
  todos: Todo[];
  updateTodos: (newTodos: Todo[]) => void;
}>({
  todos: [],
  updateTodos: () => {},
});

const EditTodoContext = createContext<{
  editTodos: Todo[];
  updateEditTodos: (newTodos: Todo[]) => void;
}>({
  editTodos: [],
  updateEditTodos: () => {},
});

const QueryContext = createContext<{
  query: Todo[];
  updateQuery: (newTodos: Todo[]) => void;
}>({
  query: [],
  updateQuery: () => {},
});

// create context to toggle darkmode on/off
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// authentication context
const AuthContext = createContext<{
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}>({
  authenticated: false,
  setAuthenticated: () => {},
});

const TrackTaskScreenContext = createContext<{
  trackScreen: string;
  trackScreenFunc: (name: string) => void;
}>({
  trackScreen: "",
  trackScreenFunc: () => {},
});

// popper context
const PopperContext = createContext<{
  actionsState: ActionsState;
  toggleActionState: (actionName: string) => void;
}>({
  actionsState: initialActionsState,
  toggleActionState: () => {},
});

//Notes context
const NotesContext = createContext<{
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  selectedNote: Note | null;
  selectNote: (note: Note | null) => void;
  displayNote: boolean;
  toggleDisplay: (state?: boolean) => void;
}>({
  notes: [],
  addNote: () => {},
  deleteNote: () => {},
  selectedNote: null,
  selectNote: () => {},
  displayNote: false,
  toggleDisplay: () => {},
});

// Custom hook to access the todo list context
export const useTodoContext = () => useContext(TodoContext);

// Custom hook to access and edit calendar page todo list context
export const useEditTodoContext = () => useContext(EditTodoContext);

// Custom hook to access and edit request query
export const useQueryContext = () => useContext(QueryContext);

// Custom hook to access the theme context
export const useThemeContext = () => useContext(ThemeContext);

const cookie1 = Cookies.get("token1");
const cookie2 = Cookies.get("token2");
const cookie3 = Cookies.get("token3");

// Custom hook to access the authentication context
export const useAuthContext = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return !!cookie1 && !!cookie2 && !!cookie3;
  });

  useEffect(() => {
    if (!!cookie1 && !!cookie2 && !!cookie3) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  return { authenticated, setAuthenticated };
};

// Custom hook to access popup
// export const usePopupContext = () => useContext(AddTaskPopupContext);

// custom hook to track task screen
export const useTrackContext = () => useContext(TrackTaskScreenContext);

// custom hook for popper
export const usePopperContext = () => useContext(PopperContext);

// custom hook for notes
export const useNotesContext = () => useContext(NotesContext);

// Component to wrap the entire application and provide context
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // State for managing todo list
  const [todos, setTodos] = useState<Todo[]>([
    {
      name: "",
      description: "",
      time: "",
      category: "",
      priority: 0,
      expected_date_of_completion: "",
      completed: false,
    },
  ]);

  // Function to update the todo list
  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  // State for managing calendar-page todo list
  const [editTodos, setEditTodos] = useState<Todo[]>([
    {
      name: "",
      description: "",
      time: "",
      category: "",
      priority: 0,
      expected_date_of_completion: "",
      completed: false,
    },
  ]);

  // Function to update the todo list
  const updateEditTodos = (newTodos: Todo[]) => {
    setEditTodos(newTodos);
  };

  // State for request query
  const [query, setQuery] = useState<Todo[]>([
    {
      name: "",
      description: "",
      time: "",
      category: "",
      priority: 0,
      expected_date_of_completion: "",
      completed: false,
    },
  ]);

  // Function to update query
  const updateQuery = (query: Todo[]) => {
    setQuery(query);
  };

  // State for managing app theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check if the user prefers dark mode
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // State for managing authentication
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    // Check if token is available in cookie storage
    const token = !!cookie1 && !!cookie2 && !!cookie3;
    return token;
  });

  useEffect(() => {
    const token = !!cookie1 && !!cookie2 && !!cookie3;
    setAuthenticated(token);
  }, []);

  // state for tracking task screen
  const [trackScreen, setTrackScreen] = useState<string>(() => {
    return "";
  });

  // Toggle dark mode
  const toggleDarkMode = (item: boolean) => {
    setDarkMode(item);
  };

  // state for managing popper actions
  const [actionsState, setActionsState] =
    useState<ActionsState>(initialActionsState);

  const toggleActionState = (actionName: string) => {
    setActionsState((prevState) => ({
      ...prevState,
      [actionName]: !prevState[actionName],
    }));
  };

  // state for managing Notes
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [displayNote, setDisplayNote] = useState<boolean>(false);

  const addNote = (note: Note) => {
    const existingNote = notes.findIndex((n) => n.id === note.id);

    if (existingNote > -1) {
      // Update existing note
      const updatedNotes = notes.map((n) => (n.id === note.id ? note : n));
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setSelectedNote(null);
    } else {
      // Add new note
      const newNotes = [note, ...notes];
      setNotes(newNotes);
      localStorage.setItem("notes", JSON.stringify(newNotes));
    }
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);

    // Clear selected note if it's the one being deleted
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setDisplayNote(false);
    }

    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  const selectNote = (note: Note | null) => {
    setSelectedNote(note);
    if (note) {
      setDisplayNote(true);
    } else {
      setDisplayNote(false);
    }
  };

  const toggleDisplay = (state?: boolean) => {
    if (state) {
      setDisplayNote(state);
    } else {
      setDisplayNote((prev) => !prev);
    }
  };

  useEffect(() => {
    // Update authentication state based on token availability
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, []);

  const trackScreenFunc = (name: string) => {
    setTrackScreen(name);
    return name;
  };

  return (
    <TodoContext.Provider value={{ todos, updateTodos }}>
      <EditTodoContext.Provider value={{ editTodos, updateEditTodos }}>
        <QueryContext.Provider value={{ query, updateQuery }}>
          <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
              <TrackTaskScreenContext.Provider
                value={{ trackScreen, trackScreenFunc }}
              >
                <PopperContext.Provider
                  value={{ actionsState, toggleActionState }}
                >
                  <NotesContext.Provider
                    value={{
                      notes,
                      addNote,
                      deleteNote,
                      selectNote,
                      selectedNote,
                      displayNote,
                      toggleDisplay,
                    }}
                  >
                    {children}
                  </NotesContext.Provider>
                </PopperContext.Provider>
              </TrackTaskScreenContext.Provider>
            </AuthContext.Provider>
          </ThemeContext.Provider>
        </QueryContext.Provider>
      </EditTodoContext.Provider>
    </TodoContext.Provider>
  );
};
