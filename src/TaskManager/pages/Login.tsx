import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: "tungnt@softech.vn",
      password: "123456789", // Example default value
    },
  });

  const onSubmit = async (data: ILoginForm): Promise<void> => {
    try {
      const user = await login(data.username, data.password);
      // Store user info in localStorage for restoration after F5
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/tasks");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your input.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-8 drop-shadow">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="Enter Your Username"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                errors.username
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Enter Your Password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fade-in"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
