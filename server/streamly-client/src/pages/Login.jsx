import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/3mtt-logo.png";
import { Eye, EyeOff } from "lucide-react"; // ✅ Icon import

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ Toggle state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError("Username/email and password are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.details ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative px-4"
      style={{ backgroundImage: "url('/images/register-bg.jpg')" }}
    >
      {/* ✅ Top-left logo */}
      <img
        src={Logo}
        alt="3mtt Logo"
        className="absolute top-6 left-6 w-12 h-12 object-cover rounded-full shadow-md border-2 border-white"
      />

      <div className="bg-green-950 bg-opacity-90 p-10 rounded-md w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

        {error && (
          <div className="bg-red-600 text-sm px-4 py-2 rounded mb-4 text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="identifier"
            placeholder="Email or mobile number"
            value={formData.identifier}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-800 text-white rounded border border-zinc-600 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded border border-zinc-600 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white font-semibold rounded bg-green-600 hover:bg-green-700 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-sm text-zinc-400">OR</div>

          <button
            type="button"
            className="w-full py-3 bg-zinc-700 text-white font-medium rounded hover:bg-zinc-600 transition"
          >
            Use a Sign-In Code
          </button>

          <div className="flex justify-between items-center text-sm text-zinc-400 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-white"
              />
              Remember me
            </label>
          </div>
        </form>

        <p className="mt-6 text-sm text-zinc-400 text-center">
          New to Emmflix?{" "}
          <Link to="/register" className="text-white hover:underline">
            Sign up now.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
