export default function TaskList({ tasks, onUpdate, onDelete }) {
  return (
    <ul className="p-2">
      {tasks.map((task) => (
        <li key={task._id} className="flex justify-between items-center p-2 border-b">
          <span
            onClick={() => onUpdate(task._id, { completed: !task.completed })}
            className={task.completed ? "line-through cursor-pointer" : "cursor-pointer"}
          >
            {task.title}
          </span>
          <button onClick={() => onDelete(task._id)} className="text-red-500">❌</button>
        </li>
      ))}
    </ul>
  );
}
