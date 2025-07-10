import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import TaskFilterForm from "../components/TaskFilterForm";
import TaskList from "../components/TaskList";
import { searchTasks } from "../utils";

import type { Filter, Task } from "../types";
import { getTasks } from "../services";

export default function Tasks() {
  const navigate = useNavigate();
  // Mock data for demonstration
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});

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

  const handleCreate = () => {
    navigate("/create-task");
  };

  const handleAssigneeMe = () => {
    navigate("/assignee-me");
  };
  return (
    <div className="animate-fade-in">
      <section className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in-up">
        <TaskFilterForm onSearch={handleSearch} />
        <div className=" flex justify-center flex-wrap gap-4 mt-4 pb-3">
          <button
            onClick={handleAssigneeMe}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-fade-in"
          >
            Assigned to Me
          </button>
          <button
            onClick={handleCreate}
            className=" px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in"
          >
            Add Task
          </button>
        </div>
      </section>

      <div className="my-4" />

      {/* Task List */}
      <section className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in-up delay-100">
        <section className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 drop-shadow-sm">Our tasks</h2>
              <p className="text-gray-600 mt-1">Manage and track all our tasks</p>
            </div>
          </div>
        </section>

        <section>
          <div className="overflow-x-auto">
            <TaskList tasks={searchTasks(tasks, filters)} onEdit={handleEdit} />
          </div>
        </section>
      </section>
    </div>
  );
}
