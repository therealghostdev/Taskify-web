import axios from "../../lib/axios";
import { RegisterBody, LoginBody } from "../utils/types/todo";
import Cookies from "js-cookie";
import { base_url, task } from "./route";

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

export const getAllTasks = async (
  queryParams: Record<string, string>,
) => {
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
