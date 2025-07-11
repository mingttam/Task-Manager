import React from "react";

import type { Task } from "../types";

type Props = {
  priority: "low" | "medium" | "high";
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function TaskPriority({ priority, showIcon = true, size = "md" }: Props) {
  const getPriorityBadge = (priority: Task["priority"]) => {
    const priorityConfig = {
      low: {
        styles:
          "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100",
        icon: "🟢",
        label: "Low Priority",
        pulse: false,
      },
      medium: {
        styles:
          "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-200 hover:from-yellow-100 hover:to-orange-100",
        icon: "🟡",
        label: "Medium Priority",
        pulse: false,
      },
      high: {
        styles:
          "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border-red-200 hover:from-red-100 hover:to-pink-100",
        icon: "🔴",
        label: "High Priority",
        pulse: true,
      },
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    const config = priorityConfig[priority];

    return (
      <span
        className={`inline-flex items-center rounded-full font-semibold border shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md cursor-default animate-fade-in ${
          config.styles
        } ${sizeClasses[size]} ${config.pulse ? "animate-pulse" : ""}`}
        title={config.label}
      >
        {showIcon && <span className="mr-1">{config.icon}</span>}
        <span className="capitalize">{priority}</span>
      </span>
    );
  };

  return <React.Fragment>{getPriorityBadge(priority)}</React.Fragment>;
}
