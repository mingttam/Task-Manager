import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { Filter } from "../types";

// Filter form data interface
interface FormData {
  status: string;
  priority: string;
  search: string;
}

type Props = {
  onSearch: (filters: Filter) => void;
  totalTasks?: number;
};

export default function TaskFilterForm({ onSearch, totalTasks = 0 }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      status: "",
      priority: "",
      search: "",
    },
  });

  // Watch form values to update active filters count
  const watchedValues = watch();

  // Calculate active filters
  useEffect(() => {
    const count = Object.values(watchedValues).filter((value) => value && value !== "").length;
    setActiveFilters(count);
  }, [watchedValues]);

  // Handle form submission to apply filters
  const onSubmit = async (data: FormData) => {
    const filters: Filter = {};

    if (data.status && data.status !== "") {
      filters.status = data.status;
    }

    if (data.priority && data.priority !== "") {
      filters.priority = data.priority;
    }

    onSearch(filters);
  };

  const handleReset = () => {
    reset();
    onSearch({});
    setActiveFilters(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filter Tasks</h3>
              <p className="text-sm text-gray-600">
                {totalTasks} task{totalTasks !== 1 ? "s" : ""} available
                {activeFilters > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {activeFilters} filter{activeFilters !== 1 ? "s" : ""} active
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-lg">{isExpanded ? "🔼" : "🔽"}</span>
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div
        className={`p-6 transition-all duration-300 ease-in-out ${
          isExpanded ? "block" : "hidden lg:block"
        }`}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Search Input */}

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                🎯 Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="to_do">⏳ To Do</option>
                <option value="in_progress">🔄 In Progress</option>
                <option value="done">✅ Done</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700">
                ⚡ Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 hover:border-gray-400 bg-white"
              >
                <option value="">All Priorities</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🔍</span>
                  Apply Filters
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🔄</span>
                Reset
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
