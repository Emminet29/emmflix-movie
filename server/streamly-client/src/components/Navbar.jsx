// src/components/Navbar.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/3mtt-logo.png";

function Navbar({ searchTerm, setSearchTerm, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black shadow-md px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Logo and title as Link */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 cursor-pointer focus:outline-none"
        aria-label="Go to Dashboard"
      >
        <img
          src={logo}
          alt="3MTT Logo"
          className="w-10 h-10 object-cover rounded-full hover:scale-105 transition-transform duration-300"
        />
        <span className="text-2xl font-bold text-primary dark:text-accent uppercase">
          Emmflix
        </span>
      </Link>

      {/* Search, theme toggle, and logout */}
      <div className="flex flex-1 items-center gap-4 justify-between sm:justify-end w-full">
        <label htmlFor="search" className="sr-only">
          Search movies
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          className="flex-grow max-w-md px-4 py-2 rounded border border-primary dark:border-accent bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
        />
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded text-white bg-primary dark:bg-accent hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
