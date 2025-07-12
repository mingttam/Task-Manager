import { useState } from "react";
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

type ViewMode = "grid" | "list" | "kanban";

export default function TaskList({ tasks, onEdit, onDelete, onView }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<"priority" | "due_date" | "status" | "title">("due_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sort tasks based on current sort settings
  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "priority": {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case "due_date": {
        const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
        const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
        comparison = dateA - dateB;
        break;
      }
      case "status": {
        const statusOrder = { to_do: 1, in_progress: 2, done: 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      }
      case "title": {
        comparison = a.title.localeCompare(b.title);
        break;
      }
    }

    return sortOrder === "desc" ? -comparison : comparison;
  });

  // Group tasks by status for kanban view
  const groupedTasks = {
    to_do: sortedTasks.filter((task) => task.status === "to_do"),
    in_progress: sortedTasks.filter((task) => task.status === "in_progress"),
    done: sortedTasks.filter((task) => task.status === "done"),
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No tasks yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first task to get started on your productivity journey!
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
            <span className="mr-2">✨</span>
            Ready to begin?
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Control Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{groupedTasks.to_do.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {groupedTasks.in_progress.length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{groupedTasks.done.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Completed</div>
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-3">
            {/* View Mode Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(["grid", "list", "kanban"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    viewMode === mode
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {mode === "grid" && "🔲"}
                  {mode === "list" && "📋"}
                  {mode === "kanban" && "📊"}
                  <span className="ml-1 capitalize">{mode}</span>
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="due_date">📅 Due Date</option>
                <option value="priority">⚡ Priority</option>
                <option value="status">🎯 Status</option>
                <option value="title">📝 Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-2 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
              >
                {sortOrder === "asc" ? "⬆️" : "⬇️"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Display */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTasks.map((task, idx) => (
            <TaskCard
              key={task.id}
              task={task}
              index={idx}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="space-y-3">
          {sortedTasks.map((task, idx) => (
            <TaskRow
              key={task.id}
              task={task}
              index={idx}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}

      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <KanbanColumn
              key={status}
              status={status as Task["status"]}
              tasks={statusTasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Task Card Component for Grid View
function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
  onView,
}: {
  task: Task;
  index: number;
  onEdit?: (taskId: string | number | undefined) => void;
  onDelete?: (taskId: string | number | undefined) => void;
  onView?: (taskId: string | number | undefined) => void;
}) {
  const getDueDateStatus = (dueDate?: Date | string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 3) return "soon";
    return "future";
  };

  const dueDateStatus = getDueDateStatus(task.due_date);

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in group ${
        dueDateStatus === "overdue"
          ? "ring-2 ring-red-200"
          : dueDateStatus === "today"
          ? "ring-2 ring-orange-200"
          : dueDateStatus === "soon"
          ? "ring-2 ring-yellow-200"
          : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onView?.(task.id)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <TaskPriority priority={task.priority} size="sm" />
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task.id);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <TaskTitle task={task} maxLength={60} />

        <div className="flex justify-between items-center">
          <TaskStatus task={task} size="sm" />
          <TaskDate date={task.due_date} format="minimal" showIcon />
        </div>

        {/* Assignee */}
        {task.assignee_id && (
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">👤</span>
            <span>{task.assignee_id}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              task.status === "done"
                ? "bg-green-500 w-full"
                : task.status === "in_progress"
                ? "bg-blue-500 w-2/3"
                : "bg-gray-400 w-1/3"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// Task Row Component for List View
function TaskRow({
  task,
  index,
  onEdit,
  onDelete,
  onView,
}: {
  task: Task;
  index: number;
  onEdit?: (taskId: string | number | undefined) => void;
  onDelete?: (taskId: string | number | undefined) => void;
  onView?: (taskId: string | number | undefined) => void;
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 animate-fade-in group cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onView?.(task.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <TaskPriority priority={task.priority} size="sm" />
          <div className="flex-1 min-w-0">
            <TaskTitle task={task} maxLength={80} />
          </div>
          <TaskStatus task={task} size="sm" />
          <TaskDate date={task.due_date} format="short" showIcon />
        </div>

        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(task.id);
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            👁️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(task.id);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onView,
}: {
  status: Task["status"];
  tasks: Task[];
  onEdit?: (taskId: string | number | undefined) => void;
  onDelete?: (taskId: string | number | undefined) => void;
  onView?: (taskId: string | number | undefined) => void;
}) {
  const statusConfig = {
    to_do: { label: "To Do", color: "border-gray-300 bg-gray-50", icon: "⏳" },
    in_progress: { label: "In Progress", color: "border-blue-300 bg-blue-50", icon: "🔄" },
    done: { label: "Done", color: "border-green-300 bg-green-50", icon: "✅" },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-xl border-2 ${config.color} p-4 animate-fade-in`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{config.icon}</span>
          <h3 className="font-semibold text-gray-800">{config.label}</h3>
        </div>
        <span className="bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => onView?.(task.id)}
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <TaskTitle task={task} maxLength={40} />
                <TaskPriority priority={task.priority} size="sm" />
              </div>

              <TaskDate date={task.due_date} format="minimal" showIcon />

              <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(task.id);
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(task.id);
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded text-xs"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
