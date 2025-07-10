import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import TaskFilterForm from "../components/TaskFilterForm";
import TaskList from "../components/TaskList";
import { searchTasks } from "../utils";

import type { Filter, Task } from "../types";
import { getTasksByAssignee } from "../services";

export default function AssigneeMe() {
  const assigneeId = 1;
  const navigate = useNavigate();
  // Mock data for demonstration
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filters, setFilters] = React.useState<Filter>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksByAssignee(assigneeId);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (taskId: string | number | undefined) => {
    navigate(`/update/${taskId}`);
  };

  // Filter tasks based on current filter criteria
  const filteredTasks = React.useMemo(() => {
    return searchTasks(tasks, filters);
  }, [tasks, filters]);

  const handleSearch = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  return (
    <div className="animate-fade-in">
      <section className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in-up">
        <TaskFilterForm onSearch={handleSearch} />
      </section>

      <div className="my-4" />

      {/* Task List */}
      <section className="bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in-up delay-100">
        <section className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-yellow-700 drop-shadow-sm">Your tasks</h2>
              <p className="text-gray-600 mt-1">Manage and track all your tasks</p>
            </div>
          </div>
        </section>

        <section>
          <div className="overflow-x-auto">
            <TaskList tasks={filteredTasks} onEdit={handleEdit} />
          </div>
        </section>
      </section>
    </div>
  );
}
