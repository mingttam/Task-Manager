import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import NavigationBar from "../components/NavigationBar";
import TaskFilterForm from "../components/TaskFilterForm";
import TaskList from "../components/TaskList";
import TaskDate from "../components/TaskDate";
import TaskStatus from "../components/TaskStatus";
import TaskPriority from "../components/TaskPriority";
import { searchTasks } from "../utils";

import type { Filter, Task } from "../types";
import { deleteTask, getTasks } from "../services";

export default function Tasks() {
  const navigate = useNavigate();
  // Mock data for demonstration
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleSearch = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  const handleEdit = (taskId: string | number | undefined) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      navigate("/update-task", { state: { task } });
    }
  };

  const handleView = (taskId: string | number | undefined) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowModal(true);
    }
  };

  const handleDelete = async (taskId: string | number | undefined) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const confirmed = window.confirm(
        `Are you sure you want to delete the task "${task.title}"?\n\nThis action cannot be undone.`
      );

      if (confirmed) {
        try {
          deleteTask(String(task.id));
          setTasks((prev) => prev.filter((t) => t.id !== taskId));
        } catch (error) {
          console.error("Error deleting task:", error);
          alert("Failed to delete task. Please try again.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 animate-fade-in">
      <NavigationBar />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-gray-600">Organize, track, and manage your tasks efficiently</p>
        </div>

        {/* Filter Section */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up delay-100 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="bg-white rounded-lg p-6">
              <TaskFilterForm onSearch={handleSearch} totalTasks={tasks.length} />
            </div>
          </div>
        </section>

        {/* Task List Section */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-up delay-200 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                      Our Tasks
                    </h2>
                    <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {searchTasks(tasks, filters).length} tasks
                    </span>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="p-2">
                <div className="overflow-x-auto rounded-lg">
                  <TaskList
                    tasks={searchTasks(tasks, filters)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Task Details Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto animate-fade-in-up shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-2xl font-bold w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">📝 Title</label>
                <p className="text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                  {selectedTask.title}
                </p>
              </div>

              {selectedTask.description && (
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📄 Description
                  </label>
                  <p className="text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Status</label>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                    <TaskStatus task={selectedTask} />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">⚡ Priority</label>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                    <TaskPriority priority={selectedTask.priority} />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">👤 Assignee</label>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm text-gray-900">
                    {selectedTask.assignee_id || "Unassigned"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    🚀 Start Date
                  </label>
                  <div className="text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                    <TaskDate date={selectedTask.start_date} />
                  </div>
                </div>

                {selectedTask.due_date && (
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ⏰ Due Date
                    </label>
                    <div className="text-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-gray-200 transition-all duration-200 group-hover:shadow-sm">
                      <TaskDate date={selectedTask.due_date} />
                    </div>
                  </div>
                )}
              </div>

              {selectedTask.completed_date && (
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ✅ Completed Date
                  </label>
                  <div className="text-gray-900 bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 transition-all duration-200 group-hover:shadow-sm">
                    <TaskDate date={selectedTask.completed_date} />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleEdit(selectedTask.id);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  ✏️ Edit Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
