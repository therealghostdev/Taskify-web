import { ReactNode } from "react";

export interface Todo {
  task: string;
  task_priority: number;
  expected_date_of_completion: string;
  category: string;
  time: string;
}

export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface ProtectedRouteProps {
  authenticated: boolean;
  redirectTo: string;
  children: ReactNode;
}
