import { base_url, refresh_auth, update_timezone } from "../src/api/route";
import { setAuthCookies } from "../src/utils/reusable_functions/functions";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { updateTimeZone, requestFcmToken } from "../src/api";

const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url !== update_timezone && Cookies.get("token1")) {
      updateTimeZone();
      requestFcmToken();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      (error.response.data.message === "Token is no longer valid" ||
        error.response.data.message === "Invalid Token" ||
        error.response.data.message === "Invalid signature or token")
    ) {
      try {
        const token = Cookies.get("token1");
        const token2 = Cookies.get("token2");
        const token3 = Cookies.get("token3");

        const formData = new URLSearchParams();
        formData.append("token", token || "");
        const { data } = await api.post(refresh_auth, formData.toString(), {
          headers: {
            Authorization: `Bearer ${token3}`,
            "x-csrf-token": token2,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        setAuthCookies(data.userSession.auth_data);

        originalRequest.headers["Authorization"] = `Bearer ${
          data.userSession.auth_data.token.split(" ")[1]
        }`;
        return api(originalRequest);
      } catch (refreshError) {
        if (
          refreshError instanceof AxiosError &&
          refreshError.response?.data?.message === "Invalid refresh token"
        ) {
          window.location.href = "/auth";
          window.location.reload();
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
