type Props = {
  task: {
    title: string;
    description?: string;
  };
};

export default function TaskTitle({ task }: Props) {
  return (
    <div className="flex flex-col animate-fade-in">
      <div className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
        {task.title}
      </div>
      {task.description && (
        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate italic">
          {task.description}
        </div>
      )}
    </div>
  );
}
