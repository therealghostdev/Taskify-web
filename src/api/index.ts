import axios from "../../lib/axios";
import { RegisterBody, LoginBody } from "../utils/types/todo";

export const userRegister = async (url: string, data: RegisterBody) => {
  try {
    const response = await axios.post(url, data, {
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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};
