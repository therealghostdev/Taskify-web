export const base_url =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const auth_reg = "/register";

export const auth_login = "/login";

export const auth_glogin = "/taskify/v1/auth/google_auth";

export const task = "/user/task";

export const refresh_auth = "/refresh_auth";

export const update_fcm_token = "/user/update_user_token";

export const update_task = "/user/task";

export const update_timezone = "/user/timezone";

export const logout = "/logout";
