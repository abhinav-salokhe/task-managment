const statusClasses = {
  Todo: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
};

const TaskTable = ({ tasks, canEditStatus, onStatusChange }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="min-w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          <th className="px-4 py-3">Task</th>
          <th className="px-4 py-3">Assigned To</th>
          <th className="px-4 py-3">Due Date</th>
          <th className="px-4 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className="border-t border-slate-100">
            <td className="px-4 py-3">
              <p className="font-medium text-slate-800">{task.title}</p>
              <p className="text-xs text-slate-500">{task.description}</p>
            </td>
            <td className="px-4 py-3 text-slate-700">{task.assignedTo?.name}</td>
            <td className="px-4 py-3 text-slate-700">{new Date(task.dueDate).toLocaleDateString()}</td>
            <td className="px-4 py-3">
              {canEditStatus ? (
                <select
                  className="rounded-md border border-slate-300 px-2 py-1"
                  value={task.status}
                  onChange={(e) => onStatusChange(task._id, e.target.value)}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              ) : (
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[task.status]}`}>
                  {task.status}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskTable;
