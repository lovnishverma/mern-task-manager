import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask, deleteTask } from "./api";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(res => setTasks(res.data));
  }, []);

  const handleAdd = async (task) => {
    const res = await addTask(task);
    setTasks([...tasks, res.data]);
  };

  const handleUpdate = async (id, updates) => {
    const res = await updateTask(id, updates);
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 shadow-lg rounded-lg border p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MERN Task Manager</h1>
      <AddTask onAdd={handleAdd} />
      <TaskList tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}
