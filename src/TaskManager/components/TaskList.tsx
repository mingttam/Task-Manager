import type { Task } from "../types";
import TaskDate from "./TaskDate";
import TaskPriority from "./TaskPriority";
import TaskStatus from "./TaskStatus";
import TaskTitle from "./TaskTitle";

type Props = {
  tasks: Task[];
  onEdit?: (taskId: string | number | undefined) => void;
  onDelete?: (taskId: string | number | undefined) => void;
  onView?: (taskID: string | number | undefined) => void;
};

export default function TaskList({ tasks, onEdit, onDelete, onView }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-gray-200 animate-fade-in">
          <thead className=" bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                📋 Task
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                🎯 Status
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                ⚡ Priority
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                🚀 Start Date
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                ⏰ Due Date
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                ✅ Completed
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
                👤 Assignee
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">
                ⚙️ Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((task: Task, idx) => (
              <tr
                key={task.id}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <TaskTitle
                    task={{ title: task.title, description: task.description }}
                    maxLength={80}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <TaskStatus task={task} size="sm" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <TaskPriority priority={task.priority} size="sm" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  <TaskDate date={task.start_date} format="short" showIcon />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  <TaskDate date={task.due_date} format="short" showIcon />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  <TaskDate date={task.completed_date} format="short" showIcon />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {task.assignee_id || "Unassigned"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onView?.(task.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => onEdit?.(task.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(task.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {tasks.map((task: Task, idx) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <TaskTitle
                    task={{ title: task.title, description: task.description }}
                    maxLength={120}
                  />
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <TaskStatus task={task} size="sm" />
                  <TaskPriority priority={task.priority} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    🚀 Start Date
                  </label>
                  <div className="text-gray-700">
                    <TaskDate date={task.start_date} format="minimal" showIcon />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">⏰ Due Date</label>
                  <div className="text-gray-700">
                    <TaskDate date={task.due_date} format="minimal" showIcon />
                  </div>
                </div>
              </div>

              {task.completed_date && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">✅ Completed</label>
                  <div className="text-gray-700 text-sm">
                    <TaskDate date={task.completed_date} format="short" showIcon />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">👤 Assignee</label>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {task.assignee_id || "Unassigned"}
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onView?.(task.id)}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => onEdit?.(task.id)}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete?.(task.id)}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
