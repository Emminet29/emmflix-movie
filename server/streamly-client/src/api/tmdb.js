// src/api/tmdb.js
import axios from "axios";

const API_KEY =
  process.env.REACT_APP_TMDB_KEY || "667db8d989fb036683e981284f099c15";
const BASE_URL = "https://api.themoviedb.org/3";
const CACHE_TIME = 1000 * 60 * 30; // 30 minutes cache

// Simple cache implementation
const cache = new Map();

const fetchWithCache = async (endpoint, params = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data;
  }

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        ...params,
      },
    });

    const data = response.data.results || [];
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`TMDB API Error [${endpoint}]:`, error);
    return [];
  }
};

// Core movie functions
export const fetchTrendingMovies = () => fetchWithCache("/trending/movie/week");
export const fetchTopRatedMovies = () => fetchWithCache("/movie/top_rated");
export const fetchNowPlaying = () => fetchWithCache("/movie/now_playing");

// Genre-based fetching
export const fetchMoviesByGenre = (genreId) =>
  fetchWithCache("/discover/movie", { with_genres: genreId });

export const fetchActionMovies = () => fetchMoviesByGenre(28);
export const fetchComedyMovies = () => fetchMoviesByGenre(35);
export const fetchHorrorMovies = () => fetchMoviesByGenre(27);
export const fetchRomanceMovies = () => fetchMoviesByGenre(10749);

// Enhanced regional content fetching
export const fetchRegionalMovies = async (region, language = "") => {
  const params = {
    region: region.toLowerCase(),
    ...(language && { with_original_language: language }),
  };
  return fetchWithCache("/discover/movie", params);
};

export const fetchYorubaMovies = () => fetchRegionalMovies("NG", "yo");
export const fetchNigerianMovies = () => fetchRegionalMovies("NG");

// Movie details with full data
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos,credits,similar",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Movie details error:", error);
    return null;
  }
};

// Search with pagination support
export const searchMovies = (query, page = 1) =>
  fetchWithCache("/search/movie", { query, page });

// Enhanced trailer fetching
export const fetchMovieTrailer = async (movieId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: API_KEY },
    });

    return (
      data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      )?.key || null
    );
  } catch (error) {
    console.error("Trailer error:", error);
    return null;
  }
};

// Person/actor details
export const fetchPersonDetails = async (personId) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/person/${personId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "movie_credits",
      },
    });
    return data;
  } catch (error) {
    console.error("Person fetch error:", error);
    return null;
  }
};
