import axios from "axios";

const API = axios.create({ baseURL: "http://192.168.10.104:5000/api" });


export const getTasks = () => API.get("/tasks");
export const addTask = (task) => API.post("/tasks", task);
export const updateTask = (id, task) => API.put(`/tasks/${id}`, task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
