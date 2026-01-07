import axios from "axios";

// Change this line to point to your Render backend URL
const API = axios.create({ baseURL: "https://mern-task-manager-b89p.onrender.com/api" });

export const getTasks = () => API.get("/tasks");
export const addTask = (task) => API.post("/tasks", task);
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
