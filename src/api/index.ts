import axios from "../../lib/axios";
import {
  RegisterBody,
  LoginBody,
  Todo,
  CreateTaskRequestBody,
  UpdateTaskRequestBody,
} from "../utils/types/todo";
import Cookies from "js-cookie";
import { base_url, task, update_task } from "./route";

export const userRegister = async (url: string, data: RegisterBody) => {
  try {
    const response = await axios.post(url, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

export const userLogin = async (url: string, data: LoginBody) => {
  try {
    const response = await axios.post(url, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getAllTasks = async (queryParams: Record<string, string>) => {
  const token = Cookies.get("token1");
  const token2 = Cookies.get("token2");
  try {
    const response = await axios.get(`${base_url}${task}`, {
      params: { ...queryParams },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-csrf-token": token2,
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};

// Helper function to combine date and time into UTC format
const combineDateTime = (date: string, time: string): string => {
  const [day, month, year] = date.split("/").map(Number);

  const [hours, minutes] = time.split(":").map(Number);

  const combinedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  console.log(combinedDate, "combime func");
  

  return combinedDate.toISOString();
};

const flattenUpdateTaskData = (
  todos: Todo[],
  omitCreatedAt = false
): UpdateTaskRequestBody => {
  const todo = todos[0] || {};

  const time = todo.time;
  const date = todo.expected_date_of_completion;

  const utcDateTime = time && date ? combineDateTime(date, time) : "";
  console.log(utcDateTime, "fl");
  

  const flattenedData: UpdateTaskRequestBody = {
    name: todo.name || "",
    description: todo.description || "",
    category: todo.category || "",
    priority: todo.priority || 0,
    expected_completion_time: utcDateTime,
    completed: todo.completed,
    createdAt: todo.createdAt || "",
  };

  console.log(flattenedData, "fl");
  
  if (omitCreatedAt) {
    delete flattenedData.createdAt;
  }

  return flattenedData;
};

// Updated updateTasks function
export const updateTasks = async (queryParams: Todo[], data: Todo[]) => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    // Flatten queryParams with createdAt if needed
    const flattenedParams = flattenUpdateTaskData(queryParams);

    console.log(flattenedParams, "flattenedP");
    
    // Flatten data without createdAt for request body
    const flattenedData = flattenUpdateTaskData(data, true);

    const response = await axios.put(
      `${base_url}${update_task}`,
      flattenedData,
      {
        params: flattenedParams,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token1}`,
          "x-csrf-token": token2,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const flattenCreateTaskData = (todos: Todo[]): CreateTaskRequestBody => {
  const todo = todos[0] || {};

  const time = todo.time;
  const date = todo.expected_date_of_completion;

  const utcDateTime = time && date ? combineDateTime(date, time) : "";

  return {
    name: todo.name || "",
    description: todo.description || "",
    category: todo.category || "",
    priority: todo.priority || 0,
    expected_completion_time: utcDateTime,
  };
};

export const createTask = async (queryParams: Todo[], data: Todo[]) => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    // Flatten both query params and request body
    const flattenedParams = flattenCreateTaskData(queryParams);
    const flattenedData = flattenCreateTaskData(data);

    const response = await axios.post(
      `${base_url}${update_task}`,
      flattenedData,
      {
        params: flattenedParams,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token1}`,
          "x-csrf-token": token2,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
