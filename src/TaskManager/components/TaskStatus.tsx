import React from "react";

import type { Task } from "../types";

type Props = {
  task: Task;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function TaskStatus({ task, showIcon = true, size = "md" }: Props) {
  const getStatusBadge = (status: Task["status"]) => {
    const statusConfig = {
      to_do: {
        styles:
          "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 hover:from-gray-100 hover:to-slate-100",
        icon: "⏳",
        label: "To Do",
        progress: 0,
      },
      in_progress: {
        styles:
          "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100",
        icon: "🔄",
        label: "In Progress",
        progress: 50,
      },
      done: {
        styles:
          "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100",
        icon: "✅",
        label: "Done",
        progress: 100,
      },
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    const config = statusConfig[status];

    return (
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center rounded-full font-semibold border shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default animate-fade-in ${config.styles} ${sizeClasses[size]}`}
          title={config.label}
        >
          {showIcon && <span className="mr-1">{config.icon}</span>}
          <span>{config.label}</span>
        </span>

        {/* Progress indicator for visual feedback */}
        <div className="hidden sm:block w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              status === "done"
                ? "bg-green-500"
                : status === "in_progress"
                ? "bg-blue-500"
                : "bg-gray-400"
            }`}
            style={{ width: `${config.progress}%` }}
          />
        </div>
      </div>
    );
  };

  return <React.Fragment>{getStatusBadge(task.status)}</React.Fragment>;
}
