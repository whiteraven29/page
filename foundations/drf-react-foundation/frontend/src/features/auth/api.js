import { api } from "../../api/client.js";

export const authApi = {
  login: (email, password) => api("/auth/login/", { method: "POST", body: { email, password }, auth: false }),
  register: (data) => api("/auth/register/", { method: "POST", body: data, auth: false }),
  logout: () => api("/auth/logout/", { method: "POST", auth: false }),
  me: () => api("/auth/me/"),
};
