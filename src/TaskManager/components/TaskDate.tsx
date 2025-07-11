type Props = {
  date?: Date | string;
  format?: "short" | "long" | "minimal";
  showIcon?: boolean;
  className?: string;
};

export default function TaskDate({
  date,
  format = "long",
  showIcon = false,
  className = "",
}: Props) {
  if (!date) {
    return (
      <div
        className={`inline-flex items-center text-xs text-gray-400 animate-fade-in ${className}`}
      >
        {showIcon && <span className="mr-1">📅</span>}
        <span className="italic">Not set</span>
      </div>
    );
  }

  const formatDate = (date: Date | string, format: "short" | "long" | "minimal") => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    switch (format) {
      case "minimal":
        return parsedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "short":
        return parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "long":
      default:
        return parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  };

  const getDateStatus = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffDays = Math.floor((parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "overdue", color: "text-red-600", bgColor: "bg-red-50", icon: "⚠️" };
    } else if (diffDays === 0) {
      return { status: "today", color: "text-orange-600", bgColor: "bg-orange-50", icon: "🔥" };
    } else if (diffDays <= 3) {
      return { status: "upcoming", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: "⏰" };
    } else {
      return { status: "future", color: "text-gray-600", bgColor: "bg-gray-50", icon: "📅" };
    }
  };

  const formattedDate = formatDate(date, format);
  const dateStatus = getDateStatus(date);

  return (
    <div
      className={`inline-flex items-center text-xs rounded-lg px-2 py-1 transition-all duration-200 hover:scale-105 animate-fade-in ${dateStatus.color} ${dateStatus.bgColor} ${className}`}
      title={format !== "long" ? formatDate(date, "long") : undefined}
    >
      {showIcon && <span className="mr-1">{dateStatus.icon}</span>}
      <span className="font-medium">{formattedDate}</span>
    </div>
  );
}
