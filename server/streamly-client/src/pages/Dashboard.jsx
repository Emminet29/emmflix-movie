import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchActionMovies,
  fetchComedyMovies,
  fetchHorrorMovies,
  fetchRomanceMovies,
  fetchYorubaMovies,
  fetchNigerianMovies,
  searchMovies,
} from "../api/tmdb";
import Row from "../components/Row";
import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useDarkMode from "../hooks/useDarkMode";
import { debounce } from "lodash";

function Dashboard() {
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [yorubaMovies, setYorubaMovies] = useState([]);
  const [nigerianMovies, setNigerianMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const loadMovies = async () => {
      try {
        setTrending(await fetchTrendingMovies());
        setTopRated(await fetchTopRatedMovies());
        setActionMovies(await fetchActionMovies());
        setComedyMovies(await fetchComedyMovies());
        setHorrorMovies(await fetchHorrorMovies());
        setRomanceMovies(await fetchRomanceMovies());
        setYorubaMovies(await fetchYorubaMovies());
        setNigerianMovies(await fetchNigerianMovies());
      } catch (error) {
        console.error("Movie fetch error:", error);
      }
    };

    fetchUserProfile();
    loadMovies();
  }, [navigate]);

  useEffect(() => {
    const delayedSearch = debounce(async () => {
      if (searchTerm.length > 2) {
        try {
          const data = await searchMovies(searchTerm);
          setSearchedMovies(data);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setSearchedMovies([]);
      }
    }, 500);

    delayedSearch();
    return delayedSearch.cancel;
  }, [searchTerm]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen transition font-sans ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
      />

      {user && (
        <div className="text-sm text-center py-3 bg-gray-800 text-white">
          Welcome, <span className="font-semibold">{user.email}</span> (
          {user.role})
        </div>
      )}

      <Banner movie={trending[0]} />

      {searchedMovies.length > 0 ? (
        <Row
          title="Search Results"
          movies={searchedMovies}
          onCardClick={setSelectedMovie}
        />
      ) : (
        <>
          <Row
            title="Trending Now"
            movies={trending}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Top Rated"
            movies={topRated}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Action"
            movies={actionMovies}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Comedy"
            movies={comedyMovies}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Horror"
            movies={horrorMovies}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Romance"
            movies={romanceMovies}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Yoruba Movies"
            movies={yorubaMovies}
            onCardClick={setSelectedMovie}
          />
          <Row
            title="Nigerian English Movies"
            movies={nigerianMovies}
            onCardClick={setSelectedMovie}
          />
        </>
      )}

      <Modal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default Dashboard;
