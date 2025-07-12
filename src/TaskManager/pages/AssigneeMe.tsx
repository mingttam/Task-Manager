import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import NavigationBar from "../components/NavigationBar";
import TaskFilterForm from "../components/TaskFilterForm";
import TaskList from "../components/TaskList";
import { searchTasks } from "../utils";

import type { Filter, Task } from "../types";
import { getTasksByAssignee } from "../services";

export default function AssigneeMe() {
  const assigneeId = 1;
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser] = useState({ id: assigneeId, name: "Your", avatar: "👤" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await getTasksByAssignee(assigneeId);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (taskId: string | number | undefined) => {
    navigate(`/update/${taskId}`);
  };

  const handleView = (taskId: string | number | undefined) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      navigate(`/update/${taskId}`, { state: { task } });
    }
  };

  // Filter tasks based on current filter criteria
  const filteredTasks = React.useMemo(() => {
    return searchTasks(tasks, filters);
  }, [tasks, filters]);

  const handleSearch = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  // Task statistics
  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const pending = tasks.filter((t) => t.status === "to_do").length;
    const overdue = tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done"
    ).length;

    return { total, completed, inProgress, pending, overdue };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your tasks...</h2>
          <p className="text-gray-500">Please wait while we fetch your assigned tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavigationBar />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentUser.name} <span className="text-blue-600">Workspace</span>
          </h1>
          <p className="text-gray-600 text-lg">Manage and track all your assigned tasks</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in">
          {[
            {
              label: "Total Tasks",
              value: taskStats.total,
              color: "from-blue-500 to-blue-600",
              icon: "📊",
            },
            {
              label: "Completed",
              value: taskStats.completed,
              color: "from-green-500 to-green-600",
              icon: "✅",
            },
            {
              label: "In Progress",
              value: taskStats.inProgress,
              color: "from-yellow-500 to-orange-500",
              icon: "⚡",
            },
            {
              label: "Overdue",
              value: taskStats.overdue,
              color: "from-red-500 to-red-600",
              icon: "⚠",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`w-3 h-3 bg-gradient-to-r ${stat.color} rounded-full`}></div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Progress Overview</h3>
              <span className="text-sm text-gray-600">
                {taskStats.total > 0
                  ? Math.round((taskStats.completed / taskStats.total) * 100)
                  : 0}
                % Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${
                      taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-yellow-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${
                      taskStats.total > 0 ? (taskStats.inProgress / taskStats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
                <div
                  className="bg-gray-400 transition-all duration-1000 ease-out"
                  style={{
                    width: `${
                      taskStats.total > 0 ? (taskStats.pending / taskStats.total) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Completed ({taskStats.completed})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-600">In Progress ({taskStats.inProgress})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-gray-600">Pending ({taskStats.pending})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 animate-fade-in-up">
          <TaskFilterForm onSearch={handleSearch} totalTasks={tasks.length} />
        </div>

        {/* Task List Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {filteredTasks.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                    <p className="text-gray-600 mt-1">
                      {filteredTasks.length} of {tasks.length} tasks
                      {Object.keys(filters).some((key) => filters[key as keyof Filter]) && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Filtered
                        </span>
                      )}
                    </p>
                  </div>

                  {taskStats.overdue > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-red-600 font-medium">
                        ⚠ {taskStats.overdue} Overdue
                      </div>
                      <div className="text-xs text-gray-500">Requires attention</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-1">
                <TaskList tasks={filteredTasks} onEdit={handleEdit} onView={handleView} />
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tasks.length === 0 ? "No Tasks Assigned" : "No Tasks Match Your Filters"}
              </h3>
              <p className="text-gray-600 mb-6">
                {tasks.length === 0
                  ? "You don't have any tasks assigned to you yet. Check back later or contact your team lead."
                  : "Try adjusting your search criteria or clear the filters to see all your tasks."}
              </p>

              {tasks.length > 0 &&
                Object.keys(filters).some((key) => filters[key as keyof Filter]) && (
                  <button
                    onClick={() => setFilters({})}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Clear Filters
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {tasks.length > 0 && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center space-x-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
              <span className="text-sm text-gray-600">Quick Actions:</span>
              <button
                onClick={() => setFilters({ status: "to_do" })}
                className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
              >
                View Pending
              </button>
              <button
                onClick={() => setFilters({ status: "in_progress" })}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                View In Progress
              </button>
              <button
                onClick={() => setFilters({ priority: "high" })}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                High Priority
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
