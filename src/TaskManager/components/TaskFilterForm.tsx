import { useForm } from "react-hook-form";
import type { Filter } from "../types";

// Filter form data interface
interface FormData {
  status: string;
  priority: string;
}

// Filter criteria interface for parent component

type Props = {
  onSearch: (filters: Filter) => void;
};

export default function TaskFilterForm({ onSearch }: Props) {
  const {
    register,
    formState: { isSubmitting },

    handleSubmit,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      status: "",
      priority: "",
    },
  });

  // Handle form submission to apply filters
  const onSubmit = async (data: FormData) => {
    // Convert form data to filter criteria
    const filters: Filter = {};

    if (data.status && data.status !== "") {
      filters.status = data.status;
    }

    if (data.priority && data.priority !== "") {
      filters.priority = data.priority;
    }

    onSearch(filters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <div className="mt-4 transition-all duration-300 ease-in-out">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Horizontal Filter Form */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Status Filter */}
            <div className="flex-1 min-w-0">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex-1 min-w-0">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
