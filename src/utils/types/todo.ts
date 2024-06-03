import { ReactNode } from "react";

export interface Todo {
  id?: number;
  task: string;
  task_description: string;
  task_priority: number;
  expected_date_of_completion: string;
  category: string;
  time: string;
}
export interface LoginProps{
  loginSwap: ()=>void
}
export interface RegisterProps{
  registerSwap: ()=>void
}
export interface CarouselProps {
  slides:React.ReactNode[]
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

export interface NavItem {
  Link: string;
  name: string;
  icon: string;
}

export interface Popup {
  name: boolean;
  title: boolean;
  date: boolean;
  time: boolean;
  category: boolean;
  priority: boolean;
}

export interface formValueTypes {
  taskname: string;
  taskdescription: string;
}

export interface newTaskCategoryType {
  name: string;
  icon: string; // change to file later
  color: string;
}

export interface TaskDataType {
  id: number;
  task_name: string;
  task_title: string;
  created_at: string;
  completion_date: string;
  completion_time: string;
  task_category: string;
  task_priority: number;
  completed: boolean;
}

export interface PopupPropsTypes {
  camera: boolean;
  text: string;
  singleInput: boolean;
  close: () => void;
}

export interface changePasswordProps {
  newPassword: string;
  oldPassword: string;
}
