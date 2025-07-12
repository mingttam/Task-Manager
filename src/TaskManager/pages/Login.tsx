import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { LoginContext } from "../context";
import { useNavigate } from "react-router";
import { login } from "../services";

interface ILoginForm {
  username: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(100, "Why your username is so long?"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

const Login = () => {
  const { setUser } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "tungnt@softech.vn",
      password: "123456789",
    },
  });

  const onSubmit = async (data: ILoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await login(data.username, data.password);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Add a small delay for better UX
      setTimeout(() => {
        navigate("/tasks");
      }, 500);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-bounce"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-in-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Task<span className="text-blue-400">Master</span>
            </h1>
            <p className="text-blue-200 text-lg">Welcome back! Ready to be productive?</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-blue-200">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-blue-100">
                  🧑‍💼 Username
                </label>
                <div className="relative">
                  <input
                    {...register("username")}
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all duration-300 ${
                      errors.username
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                        : "border-white/30 focus:border-blue-400 focus:ring-blue-400/50"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-blue-300">👤</span>
                  </div>
                </div>
                {errors.username && (
                  <p className="text-red-300 text-sm flex items-center animate-fade-in">
                    <span className="mr-1">⚠️</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-blue-100">
                  🔐 Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    className={`w-full px-4 py-4 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:bg-white/20 transition-all duration-300 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/50"
                        : "border-white/30 focus:border-blue-400 focus:ring-blue-400/50"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-300 hover:text-white transition-colors"
                  >
                    <span>{showPassword ? "🙈" : "👁️"}</span>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm flex items-center animate-fade-in">
                    <span className="mr-1">⚠️</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading || isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Signing you in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Sign In
                  </span>
                )}
              </button>

              {/* Additional Options */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-blue-200 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="mr-2 rounded" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-blue-300 hover:text-white transition-colors hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in">
            <p className="text-blue-200 text-sm">
              Don't have an account?
              <a
                href="#"
                className="text-blue-300 hover:text-white ml-1 hover:underline transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
