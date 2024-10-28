import { ReactNode } from "react";

export interface Todo {
  id?: string;
  name: string;
  description: string;
  priority: number;
  expected_date_of_completion: string;
  category: string;
  time: string;
  completed: boolean;
  createdAt?: string;
}
export interface LoginProps {
  loginSwap: () => void;
}
export interface RegisterProps {
  registerSwap: () => void;
}
export interface ErrorsState {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  disabledBtn: boolean;
}
export interface LoginErrorsState {
  username: string;
  password: string;
  disabledBtn: boolean;
}
export interface CarouselProps {
  slides: React.ReactNode[];
}
export interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: (item: boolean) => void;
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
export interface TaskDataType1 {
  _id: string; // Task ID
  category: string; // Task category, e.g., "Health"
  completed: boolean; // Whether the task is completed
  createdAt: string; // Creation timestamp
  description: string; // Description of the task
  duration: number; // Duration in minutes or another unit
  expected_completion_time: string; // Expected completion time as a timestamp
  isCounted: boolean; // Whether this task is counted in some way
  isRoutine: boolean; // Whether the task is a routine task
  name: string; // Name of the task, e.g., "Eat Sharwama"
  onFocus: boolean; // Whether the task is currently being focused on
  priority: number; // Priority level of the task
  recurrence: string; // Recurrence pattern, e.g., "daily"
  user: string; // Associated user ID
  __v: number; // Version key (used internally by Mongoose)
}

export interface DeleteTaskQuery {
  name: string;
  completed: boolean;
  createdAt: string;
  category: string;
  expected_completion_time: string;
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

export interface focusDetails {
  name: string[];
  duration: number;
  expired: string;
}

export interface PopupFocusDetails {
  name: string[];
  duration: number;
  expired: string;
}

export interface FocusPopDataType {
  task_name: string;
}

export interface FocusPopupProps {
  screen: string;
  contents: FocusPopDataType[];
  changeScreen: (val: string) => void;
  notify: (val: string) => void;
  close: () => void;
  details: focusDetails;
  updateDetails: (focusDetails: PopupFocusDetails) => void;
}
export interface TaskScreenPropType {
  data: TaskDataType1[] | null;
  close: () => void;
  taskIndex: number;
}

export interface NotepadTextStyleType {
  bold: boolean;
  italic: boolean;
  fontSize: number;
}

// Note type
export interface Note {
  id: string;
  title: string;
  content: string;
}

export interface NoteCardProps {
  note: Note;
  selectedNoteId: string | null | undefined;
  selectNote: (note: Note) => void;
  handleDeleteNote: (event: React.MouseEvent, id: string) => void;
}

export type ActionsState = {
  [key: string]: boolean;
};

export interface SliderItem {
  image: string;
  description: string;
  highlight: string;
}

export interface RegisterBody {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export interface LoginBody {
  username: string;
  password: string;
}

export interface CreateTaskRequestBody {
  name: string;
  description: string;
  category: string;
  priority: number;
  expected_completion_time: string;
}

export interface UpdateTaskRequestBody {
  name: string;
  description: string;
  category: string;
  priority: number;
  expected_completion_time: string;
  completed: boolean;
  createdAt?: string;
}

export interface ConfirmPropTypes {
  request: () => void;
}
