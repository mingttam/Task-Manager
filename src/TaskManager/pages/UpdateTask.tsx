import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import NavigationBar from "../components/NavigationBar";
import { getTaskById, updateTask } from "../services";
import type { Task } from "../types";

interface TaskFormData {
  title: string;
  start_date: string;
  due_date?: string;
  description?: string;
  status: "to_do" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee_id?: number | string;
}

const schema: yup.ObjectSchema<TaskFormData> = yup.object({
  title: yup.string().required().min(3).max(100),
  start_date: yup
    .string()
    .required()
    .matches(/^\d{4}-\d{2}-\d{2}$/),
  due_date: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .test("due_date-after-start_date", "Due date must be after start date", function (value) {
      if (!value) return true;
      const { start_date } = this.parent;
      return new Date(value) >= new Date(start_date);
    }),
  description: yup.string().optional().max(500),
  status: yup
    .mixed<"to_do" | "in_progress" | "done">()
    .required()
    .oneOf(["to_do", "in_progress", "done"]),
  priority: yup.mixed<"low" | "medium" | "high">().required().oneOf(["low", "medium", "high"]),
  assignee_id: yup.number().optional().min(1),
});

export default function UpdateTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const passedTask = location.state?.task as Task | undefined;

  const [task, setTask] = useState<Task | null>(passedTask ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<"basic" | "details" | "advanced">("basic");
  const hasReset = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    reset,
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const watchedValues = watch();

  useEffect(() => {
    const loadTask = async () => {
      if (passedTask && !hasReset.current) {
        reset({
          title: passedTask.title,
          start_date: new Date(passedTask.start_date).toISOString().split("T")[0],
          due_date: passedTask.due_date
            ? new Date(passedTask.due_date).toISOString().split("T")[0]
            : "",
          description: passedTask.description || "",
          status: passedTask.status,
          priority: passedTask.priority,
          assignee_id: passedTask.assignee_id ?? "",
        });
        setTask(passedTask);
        hasReset.current = true;
      } else if (id && !hasReset.current) {
        try {
          const data = await getTaskById(id);
          reset({
            title: data.title,
            start_date: new Date(data.start_date).toISOString().split("T")[0],
            due_date: data.due_date ? new Date(data.due_date).toISOString().split("T")[0] : "",
            description: data.description || "",
            status: data.status,
            priority: data.priority,
            assignee_id: data.assignee_id ?? "",
          });
          setTask(data);
          hasReset.current = true;
        } catch (err) {
          console.error("Error fetching task:", err);
        }
      }
    };

    loadTask();
  }, [passedTask, reset, id]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      if (!task || !task.id || !task.created_time) throw new Error("Task data is incomplete.");

      const updatedTask: Task = {
        ...task,
        title: data.title,
        start_date: new Date(data.start_date),
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        assignee_id: data.assignee_id ? Number(data.assignee_id) : undefined,
        completed_date: data.status === "done" ? new Date() : undefined,
        updated_time: new Date(),
      };

      await updateTask(updatedTask);

      //animation delay
      setTimeout(() => {
        navigate("/tasks");
      }, 800);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      <NavigationBar />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate("/tasks")}
            className="hover:border-blue-500 hover:bg-gray-200 hover:scale-105 inline-flex items-center mb-6 px-8 py-4 text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm  transition-all duration-200 border border-gray-200"
          >
            <span className="mr-2">←</span>
            Back to Tasks
          </button>
        </div>

        {/* Task Info Banner */}
        {task && (
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{task.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Created: {new Date(task.created_time).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>ID: {task.id}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "done"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {task.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
            <div className="flex space-x-1">
              {[
                { id: "basic", label: "Basic Info", desc: "Title & Priority" },
                { id: "details", label: "Timeline", desc: "Dates & Status" },
                { id: "advanced", label: "Advanced", desc: "Description & Assignment" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as "basic" | "details" | "advanced")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              {/* Basic Info Tab */}
              {currentTab === "basic" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                    <p className="text-gray-600">Update the core details of your task</p>
                  </div>

                  {/* Task Title */}
                  <div className="space-y-3">
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                      Task Title
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      id="title"
                      placeholder="Enter a clear, descriptive title..."
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 text-lg ${
                        errors.title
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : dirtyFields.title
                          ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠</span>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Priority*/}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">Priority Level</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "low", label: "Low Priority", color: "green", desc: "Can wait" },
                        { value: "medium", label: "Medium", color: "yellow", desc: "Standard" },
                        { value: "high", label: "High Priority", color: "red", desc: "Urgent" },
                      ].map((priority) => (
                        <label
                          key={priority.value}
                          className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                            watchedValues.priority === priority.value
                              ? `border-${priority.color}-500 bg-${priority.color}-50 shadow-lg`
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <input
                            {...register("priority")}
                            type="radio"
                            value={priority.value}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full mb-2 ${
                              priority.color === "red"
                                ? "bg-red-500"
                                : priority.color === "yellow"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div className="font-semibold text-gray-900">{priority.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{priority.desc}</div>
                        </label>
                      ))}
                    </div>
                    {errors.priority && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠</span>
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline Tab */}
              {currentTab === "details" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Timeline & Status</h2>
                    <p className="text-gray-600">Set dates and current progress status</p>
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="start_date" className="block text-sm font-bold text-gray-700">
                        Start Date
                      </label>
                      <input
                        {...register("start_date")}
                        type="date"
                        id="start_date"
                        className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.start_date
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : dirtyFields.start_date
                            ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm flex items-center animate-fade-in">
                          <span className="mr-1">⚠</span>
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="due_date" className="block text-sm font-bold text-gray-700">
                        Due Date <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        {...register("due_date")}
                        type="date"
                        id="due_date"
                        className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.due_date
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : dirtyFields.due_date
                            ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {errors.due_date && (
                        <p className="text-red-500 text-sm flex items-center animate-fade-in">
                          <span className="mr-1">⚠</span>
                          {errors.due_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">Task Status</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: "to_do", label: "To Do", color: "gray", desc: "Not started" },
                        {
                          value: "in_progress",
                          label: "In Progress",
                          color: "blue",
                          desc: "Working on it",
                        },
                        { value: "done", label: "Completed", color: "green", desc: "Finished" },
                      ].map((status) => (
                        <label
                          key={status.value}
                          className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                            watchedValues.status === status.value
                              ? `border-${status.color}-500 bg-${status.color}-50 shadow-lg`
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <input
                            {...register("status")}
                            type="radio"
                            value={status.value}
                            className="sr-only"
                          />
                          <div
                            className={`w-12 h-2 rounded-full mb-3 ${
                              status.color === "green"
                                ? "bg-green-500"
                                : status.color === "blue"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <div className="font-semibold text-gray-900">{status.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{status.desc}</div>
                        </label>
                      ))}
                    </div>
                    {errors.status && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠</span>
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {currentTab === "advanced" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
                    <p className="text-gray-600">Add description and assignment information</p>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                      Description <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      {...register("description")}
                      id="description"
                      rows={6}
                      placeholder="Add detailed information about this task..."
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        errors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : dirtyFields.description
                          ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠</span>
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="space-y-3">
                    <label htmlFor="assignee_id" className="block text-sm font-bold text-gray-700">
                      Assignee ID <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      {...register("assignee_id")}
                      type="text"
                      id="assignee_id"
                      placeholder="Enter the ID of the person assigned to this task..."
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.assignee_id
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : dirtyFields.assignee_id
                          ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.assignee_id && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠</span>
                        {errors.assignee_id.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation & Submit */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
                <div className="flex space-x-2">
                  {currentTab !== "basic" && (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentTab === "advanced") setCurrentTab("details");
                        if (currentTab === "details") setCurrentTab("basic");
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      ← Previous
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  {currentTab !== "advanced" ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (currentTab === "basic") setCurrentTab("details");
                        if (currentTab === "details") setCurrentTab("advanced");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isLoading || isSubmitting ? (
                        <span className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Updating Task...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-2">✓</span>
                          Update Task
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
