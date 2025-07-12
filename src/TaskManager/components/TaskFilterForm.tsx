import { useForm } from "react-hook-form";
import { useState } from "react";
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

  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      status: "",
      priority: "",
      search: "",
    },
  });

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
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-1 shadow-xl animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg">
        {/* Modern Header Section */}
        <div className="p-6 border-b border-gray-100/70">
          <div className="flex items-center justify-between">
            {/* Title and Status */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>

              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Smart Filters
                </h2>
                <p className="text-sm text-gray-500 mt-1">Refine your task view with precision</p>
              </div>
            </div>

            {/* Stats and Mobile Toggle */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-blue-700">{totalTasks} Tasks</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden group p-3 bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="sm:hidden mt-4 flex items-center space-x-3">
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200/50">
              {totalTasks} tasks
            </span>
          </div>
        </div>

        {/* Filter Content */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 lg:max-h-[500px] lg:opacity-100"
          } overflow-hidden`}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Filter Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white border border-gray-200/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-300/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div>
                        <label htmlFor="status" className="text-sm font-bold text-gray-800">
                          Task Status
                        </label>
                        <p className="text-xs text-gray-500">Filter by completion state</p>
                      </div>
                    </div>

                    <select
                      id="status"
                      {...register("status")}
                      className="w-full px-4 py-3.5 bg-gray-50/70 border-0 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-300 shadow-sm"
                    >
                      <option value="">🎯 All Status Types</option>
                      <option value="to_do">📋 To Do</option>
                      <option value="in_progress">⚡ In Progress</option>
                      <option value="done">✅ Completed</option>
                    </select>
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white border border-gray-200/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-purple-300/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <label htmlFor="priority" className="text-sm font-bold text-gray-800">
                          Priority Level
                        </label>
                        <p className="text-xs text-gray-500">Sort by importance</p>
                      </div>
                    </div>

                    <select
                      id="priority"
                      {...register("priority")}
                      className="w-full px-4 py-3.5 bg-gray-50/70 border-0 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300 shadow-sm"
                    >
                      <option value="">🎨 All Priorities</option>
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Applying Filters...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <span>Apply Filters</span>
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 bg-white text-gray-700 rounded-xl border-2 border-gray-200 font-bold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] hover:border-gray-300 hover:bg-gray-50 group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Reset All</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
