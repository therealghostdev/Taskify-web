import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, ThemeContextType } from "../types/todo";

// Create a context for managing the todo list
const TodoContext = createContext<{ todos: Todo[]; updateTodos: (newTodos: Todo[]) => void }>({
  todos: [],
  updateTodos: () => {},
});

const ThemeContext = createContext<ThemeContextType>({ darkMode: false, toggleDarkMode: () => {} });
const AuthContext = createContext<boolean>(false);

// Custom hook to access the todo list context
export const useTodoContext = () => useContext(TodoContext);

// Custom hook to access the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

// Component to wrap the entire application and provide context
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // State for managing todo list
  const [todos, setTodos] = useState<Todo[]>([]);

  // Function to update the todo list
  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  // State for managing app theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check if the user prefers dark mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // State for managing authentication
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    // Check if token is available in local storage
    return !!localStorage.getItem("token");
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    // Update authentication state based on token availability
    const token = localStorage.getItem("token");
    setAuthenticated(!!token);
  }, []);

  return (
    <TodoContext.Provider value={{ todos, updateTodos }}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <AuthContext.Provider value={authenticated}>
          {children}
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </TodoContext.Provider>
  );
};