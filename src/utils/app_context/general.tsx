import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, ThemeContextType, Popup } from "../types/todo";

// Create a context for managing the todo list
const TodoContext = createContext<{
  todos: Todo[];
  updateTodos: (newTodos: Todo[]) => void;
}>({
  todos: [],
  updateTodos: () => {},
});

// create context to toggle darkmode on/off
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

// authentication context
const AuthContext = createContext<boolean>(false);

const TrackTaskScreenContext = createContext<{
  trackScreen: string;
  trackScreenFunc: (name: string) => void;
}>({
  trackScreen: "",
  trackScreenFunc: () => {},
});

// Custom hook to access the todo list context
export const useTodoContext = () => useContext(TodoContext);

// Custom hook to access the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

// Custom hook to access popup
// export const usePopupContext = () => useContext(AddTaskPopupContext);

// custom hoom to track task screen
export const useTrackContext = () => useContext(TrackTaskScreenContext);

// Component to wrap the entire application and provide context
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // State for managing todo list
  const [todos, setTodos] = useState<Todo[]>([
    {
      task: "",
      task_description: "",
      time: "",
      category: "",
      task_priority: 0,
      expected_date_of_completion: "",
    },
  ]);

  // Function to update the todo list
  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
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
    // Check if token is available in local storage
    return !!localStorage.getItem("token");
  });

  // state for tracking task screen
  const [trackScreen, setTrackScreen] = useState<string>(() => {
    return "";
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
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
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <AuthContext.Provider value={authenticated}>
          {/* <AddTaskPopupContext.Provider
            value={{ newTaskPopup, togglePopupState, setNewTaskPopup }}
          > */}
          <TrackTaskScreenContext.Provider
            value={{ trackScreen, trackScreenFunc }}
          >
            {children}
          </TrackTaskScreenContext.Provider>
          {/* </AddTaskPopupContext.Provider> */}
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </TodoContext.Provider>
  );
};
