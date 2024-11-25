import api from "../../lib/axios";
import {
  RegisterBody,
  LoginBody,
  Todo,
  CreateTaskRequestBody,
  UpdateTaskRequestBody,
  DeleteTaskQuery,
  QueryParamType,
} from "../utils/types/todo";
import Cookies from "js-cookie";
import {
  base_url,
  task,
  update_task,
  logout,
  update_timezone,
  update_fcm_token,
} from "./route";
import { messaging } from "../../lib/firebase";
import { getToken } from "firebase/messaging";

export const userRegister = async (url: string, data: RegisterBody) => {
  try {
    const response = await api.post(url, data, {
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

export const userLogin = async (url: string, data: LoginBody) => {
  try {
    const response = await api.post(url, data, {
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
    const response = await api.get(`${base_url}${task}`, {
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
  try {
    const [day, month, year] = date.split("/").map(Number);

    if (!day || !month || !year) {
      throw new Error("Invalid date format. Expected DD/MM/YYYY");
    }

    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid time format. Expected HH:mm");
    }

    const localDate = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(localDate.getTime())) {
      throw new Error("Invalid date/time combination");
    }

    // Convert to ISO string (UTC)
    const utcDate = localDate.toISOString();

    return utcDate;
  } catch (error) {
    console.error("Error combining date and time:", error);
    throw error;
  }
};

const flattenUpdateTaskData = (
  todos: Todo[],
  omitCreatedAt = false
): UpdateTaskRequestBody => {
  const todo = todos[0] || {};

  const time = todo.time;
  const date = todo.expected_date_of_completion;

  const utcDateTime = time && date ? combineDateTime(date, time) : "";
  console.log(utcDateTime, "is utcdate");

  let completedAt;
  if (todo.completedAt && todo.completedTime) {
    completedAt = combineDateTime(todo.completedAt, todo.completedTime);
  } else {
    completedAt = undefined;
  }

  const flattenedData: UpdateTaskRequestBody = {
    name: todo.name || "",
    description: todo.description || "",
    category: todo.category || "",
    priority: todo.priority || 0,
    expected_completion_time: utcDateTime,
    completed: todo.completed,
    createdAt: todo.createdAt || "",
    isRoutine: todo.isRoutine,
    recurrence: todo.recurrence === "" ? undefined : todo.recurrence,
    duration: todo.duration,
    completedAt: completedAt,
  };

  if (omitCreatedAt) {
    delete flattenedData.createdAt;
  }

  // console.log(flattenedData, "flattened");

  return flattenedData;
};

// Updated updateTasks function
export const updateTasks = async (
  queryParams: QueryParamType[],
  data: Todo[]
) => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    // Flatten data without createdAt for request body
    const param = queryParams[0] || {};
    const flattenedData = flattenUpdateTaskData(data, true);

    const flattenedParams: QueryParamType = {
      name: param.name,
      description: param.description,
      priority: param.priority,
      category: param.category,
      createdAt: param.createdAt,
      isRoutine: param.isRoutine,
      completed: param.completed,
      recurrence: param.recurrence,
      expected_completion_time: param.expected_completion_time,
    };

    const response = await api.put(`${base_url}${update_task}`, flattenedData, {
      params: flattenedParams,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token1}`,
        "x-csrf-token": token2,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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

export const createTask = async (data: Todo[]) => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    // Flatten both query params and request body
    // const flattenedParams = flattenCreateTaskData(queryParams);
    const flattenedData = flattenCreateTaskData(data);

    const response = await api.post(
      `${base_url}${update_task}`,
      flattenedData,
      {
        // params: flattenedParams,
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

const flattenDeleteTaskData = (todos: DeleteTaskQuery[]): DeleteTaskQuery => {
  const todo = todos[0] || {};

  const flattenedData: DeleteTaskQuery = {
    name: todo.name || "",
    category: todo.category || "",
    expected_completion_time: todo.expected_completion_time || "",
    completed: todo.completed,
    createdAt: todo.createdAt || todo.createdAt || "",
  };

  return flattenedData;
};

export const DeleteTask = async (queryParams: DeleteTaskQuery[]) => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    // Flatten queryParams with createdAt if needed
    const flattenedParams = flattenDeleteTaskData(queryParams);

    const response = await api.delete(`${base_url}${update_task}`, {
      params: flattenedParams,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token1}`,
        "x-csrf-token": token2,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateTimeZone = async () => {
  const savedTimezone = localStorage.getItem("timezone");
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  if (!savedTimezone) {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await api.put(
        `${base_url}${update_timezone}`,
        { timezone },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token1}`,
            "x-csrf-token": token2,
          },
        }
      );
      localStorage.setItem("timezone", timezone);
    } catch (err) {
      throw err;
    }
  }
};

export const logOut = async () => {
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    const response = await api.post(
      `${base_url}${logout}`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token1}`,
          "x-csrf-token": token2,
        },
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const requestFcmToken = async () => {
  const fcmValidated = localStorage.getItem("message");
  const token1 = Cookies.get("token1");
  const token2 = Cookies.get("token2");

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });

    if (currentToken && !fcmValidated) {
      await api.put(
        `${base_url}${update_fcm_token}`,
        { fcmToken: currentToken },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token1}`,
            "x-csrf-token": token2,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      localStorage.setItem("message", "true");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
