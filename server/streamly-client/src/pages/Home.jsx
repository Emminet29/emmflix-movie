import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/3mtt-logo.png";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
          navigate("/dashboard");
        }
      } catch (err) {
        localStorage.removeItem("token");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat px-4 text-white"
      style={{ backgroundImage: "url('/images/home-bg.jpg')" }}
    >
      <div className="flex items-center gap-4 mb-8 bg-black bg-opacity-50 p-4 rounded-lg">
        <img src={logo} alt="Emmflix Logo" className="w-16 h-16 rounded-full" />
        <h1 className="text-4xl font-bold uppercase text-3mtt">Emmflix</h1>
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
        Welcome to Emmflix
      </h2>
      <p className="text-lg text-center text-gray-300 mb-8 max-w-xl">
        Your favorite source for trending, Nigerian, and African movies — stream
        anytime, anywhere.
      </p>

      <button
        onClick={handleLogin}
        className="bg-3mtt text-black px-6 py-3 rounded-lg text-lg font-medium hover:bg-opacity-80 transition"
      >
        Sign In to Continue
      </button>
    </div>
  );
}

export default Home;
