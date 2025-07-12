import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import NavigationBar from "../components/NavigationBar";
import type { Task } from "../types";
import { createTask } from "../services";

// Form data interface (excluding auto-generated fields)
interface TaskFormData {
  title: string;
  start_date: string;
  due_date?: string;
  description?: string;
  status: "to_do" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee_id?: string;
}

// Yup validation schema
const validationSchema: yup.ObjectSchema<TaskFormData> = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  start_date: yup
    .string()
    .required("Start date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  due_date: yup
    .string()
    .optional()
    .test("due_date-after-start_date", "Due date must be after start date", function (value) {
      if (!value) return true;
      const { start_date } = this.parent;
      return new Date(value) >= new Date(start_date);
    }),
  description: yup.string().optional().max(500, "Description must be less than 500 characters"),
  status: yup
    .mixed<"to_do" | "in_progress" | "done">()
    .required("Status is required")
    .oneOf(["to_do", "in_progress", "done"], "Please select a valid status"),
  priority: yup
    .mixed<"low" | "medium" | "high">()
    .required("Priority is required")
    .oneOf(["low", "medium", "high"], "Please select a valid priority"),
  assignee_id: yup
    .string()
    .optional()
    .test("is-valid-assignee-id", "Assignee ID must be a positive number", (value) => {
      if (!value) return true;
      return /^\d+$/.test(value) && Number(value) > 0;
    }),
});

export default function CreateTask() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TaskFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
      description: "",
      status: "to_do",
      priority: "medium",
      assignee_id: "",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: TaskFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const taskData: Task = {
        id: undefined,
        assignee_id: data.assignee_id ? Number(data.assignee_id) : undefined,
        start_date: new Date(data.start_date),
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        completed_date: data.status === "done" ? new Date() : undefined,
        created_time: new Date(),
        updated_time: new Date(),
        title: data.title,
      };

      await createTask(taskData);

      // Success animation delay
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task. Please try again.");
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <NavigationBar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <button
            onClick={() => navigate("/tasks")}
            className="inline-flex items-center mb-6 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl font-black mr-2">←</span>
            Back to Tasks
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Task</h1>
          <p className="text-gray-600 text-lg">Let's bring your ideas to life</p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  step <= currentStep
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Basic Info</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📝 Basic Information</h2>
                    <p className="text-gray-600">What do you want to accomplish?</p>
                  </div>

                  {/* Task Title */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                      🎯 Task Title
                    </label>
                    <input
                      {...register("title")}
                      type="text"
                      id="title"
                      placeholder="Enter a descriptive title for your task..."
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.title
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠️</span>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Priority Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      ⚡ Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["low", "medium", "high"].map((priority) => (
                        <label
                          key={priority}
                          className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            watchedValues.priority === priority
                              ? priority === "high"
                                ? "border-red-500 bg-red-50"
                                : priority === "medium"
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            {...register("priority")}
                            type="radio"
                            value={priority}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-1">
                              {priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢"}
                            </div>
                            <div className="font-semibold capitalize">{priority}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.priority && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠️</span>
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Dates and Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Timeline & Details</h2>
                    <p className="text-gray-600">When should this be done?</p>
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="start_date" className="block text-sm font-bold text-gray-700">
                        🚀 Start Date
                      </label>
                      <input
                        {...register("start_date")}
                        type="date"
                        id="start_date"
                        className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.start_date
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {errors.start_date && (
                        <p className="text-red-500 text-sm flex items-center animate-fade-in">
                          <span className="mr-1">⚠️</span>
                          {errors.start_date.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="due_date" className="block text-sm font-bold text-gray-700">
                        ⏰ Due Date (Optional)
                      </label>
                      <input
                        {...register("due_date")}
                        type="date"
                        id="due_date"
                        className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.due_date
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {errors.due_date && (
                        <p className="text-red-500 text-sm flex items-center animate-fade-in">
                          <span className="mr-1">⚠️</span>
                          {errors.due_date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                      📋 Description (Optional)
                    </label>
                    <textarea
                      {...register("description")}
                      id="description"
                      rows={4}
                      placeholder="Add more details about your task..."
                      className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        errors.description
                          ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center animate-fade-in">
                        <span className="mr-1">⚠️</span>
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Status and Assignee */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                        🎯 Initial Status
                      </label>
                      <select
                        {...register("status")}
                        id="status"
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300"
                      >
                        <option value="to_do">⏳ To Do</option>
                        <option value="in_progress">🔄 In Progress</option>
                        <option value="done">✅ Done</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="assignee_id"
                        className="block text-sm font-bold text-gray-700"
                      >
                        👤 Assignee ID (Optional)
                      </label>
                      <input
                        {...register("assignee_id")}
                        type="text"
                        id="assignee_id"
                        placeholder="Enter assignee ID..."
                        className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.assignee_id
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
                      />
                      {errors.assignee_id && (
                        <p className="text-red-500 text-sm flex items-center animate-fade-in">
                          <span className="mr-1">⚠️</span>
                          {errors.assignee_id.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Review & Create</h2>
                    <p className="text-gray-600">Everything looks good?</p>
                  </div>

                  {/* Task Preview */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Task Preview</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center">
                        <span className="w-24 font-semibold text-gray-600">Title:</span>
                        <span className="text-gray-900">
                          {watchedValues.title || "Untitled Task"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 font-semibold text-gray-600">Priority:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            watchedValues.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : watchedValues.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {watchedValues.priority === "high"
                            ? "🔴 High"
                            : watchedValues.priority === "medium"
                            ? "🟡 Medium"
                            : "🟢 Low"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 font-semibold text-gray-600">Start:</span>
                        <span className="text-gray-900">
                          {watchedValues.start_date || "Not set"}
                        </span>
                      </div>
                      {watchedValues.due_date && (
                        <div className="flex items-center">
                          <span className="w-24 font-semibold text-gray-600">Due:</span>
                          <span className="text-gray-900">{watchedValues.due_date}</span>
                        </div>
                      )}
                      {watchedValues.description && (
                        <div className="flex items-start">
                          <span className="w-24 font-semibold text-gray-600 flex-shrink-0">
                            Description:
                          </span>
                          <span className="text-gray-900">{watchedValues.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isLoading || isSubmitting ? (
                      <span className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Creating Task...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-2">🚀</span>
                        Create Task
                      </span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
