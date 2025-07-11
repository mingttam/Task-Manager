import { useState } from "react";

type Props = {
  task: {
    title: string;
    description?: string;
  };
  maxLength?: number;
  showFullDescription?: boolean;
};

export default function TaskTitle({ task, maxLength = 60, showFullDescription = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(showFullDescription);

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const shouldTruncateDescription = task.description && task.description.length > maxLength;

  return (
    <div className="flex flex-col space-y-2 animate-fade-in group">
      <div className="flex items-start space-x-2">
        <span className="text-blue-500 mt-0.5 flex-shrink-0">📝</span>
        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
          {task.title}
        </h3>
      </div>

      {task.description && (
        <div className="ml-6 relative">
          <div
            className={`text-xs text-gray-600 leading-relaxed transition-all duration-200 ${
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            }`}
            style={{
              fontStyle: "italic",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
          >
            {isExpanded || !shouldTruncateDescription
              ? task.description
              : truncateText(task.description, maxLength)}
          </div>

          {shouldTruncateDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1"
            >
              {isExpanded ? "🔼 Show less" : "🔽 Show more"}
            </button>
          )}
        </div>
      )}

      {!task.description && (
        <div className="ml-6 text-xs text-gray-400 italic">No description provided</div>
      )}
    </div>
  );
}
