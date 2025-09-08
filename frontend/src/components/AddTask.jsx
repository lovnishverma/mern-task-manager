import { useState } from "react";

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 flex gap-2">
      <input
        className="border p-2 flex-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task..."
      />
      <button className="bg-blue-500 text-white px-3 py-2">Add</button>
    </form>
  );
}
