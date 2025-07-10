import React from "react";

import type { Task } from "../types";

type Props = {
  priority: "low" | "medium" | "high";
};

export default function TaskPriority({ priority }: Props) {
  const getPriorityBadge = (priority: Task["priority"]) => {
    const priorityStyles = {
      low: "bg-green-50 text-green-700 border-green-200 animate-fade-in",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200 animate-fade-in",
      high: "bg-red-50 text-red-700 border-red-200 animate-fade-in",
    };

    const priorityLabels = {
      low: "Low",
      medium: "Medium",
      high: "High",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm transition-all duration-200 ${priorityStyles[priority]}`}
      >
        {priorityLabels[priority]}
      </span>
    );
  };

  return <React.Fragment>{getPriorityBadge(priority)}</React.Fragment>;
}
