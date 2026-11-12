import { api } from "../../api/client.js";

export const notesApi = {
  list: (search = "") => api(`/notes/${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  create: (data) => api("/notes/", { method: "POST", body: data }),
  update: (id, data) => api(`/notes/${id}/`, { method: "PATCH", body: data }),
  remove: (id) => api(`/notes/${id}/`, { method: "DELETE" }),
};
