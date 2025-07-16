import { useEffect, useState } from "react";
import { fetchMovieTrailer } from "../api/tmdb";

function MovieCard({ movie, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoaded, setTrailerLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const baseUrl = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    if (hovered && !trailerKey) {
      fetchMovieTrailer(movie.id).then((key) => {
        if (key) {
          setTrailerKey(key);
          setTrailerLoaded(false);
        }
      });
    }
  }, [hovered, movie.id, trailerKey]);

  const imageUrl = movie.poster_path
    ? `${baseUrl}${movie.poster_path}`
    : "/no-image.jpg";

  const renderStars = () => {
    const fullStars = Math.floor(movie.vote_average / 2); // TMDB rating is out of 10
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < fullStars ? "text-yellow-400" : "text-gray-400"}
      >
        ★
      </span>
    ));
  };

  return (
    <div
      onClick={() => onClick?.(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTrailerLoaded(false);
      }}
      className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:scale-105 cursor-pointer bg-white dark:bg-gray-900"
    >
      {/* Trailer iframe */}
      {hovered && trailerKey && (
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
            isMuted ? 1 : 0
          }&controls=0&showinfo=0`}
          title={movie.title}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setTrailerLoaded(true)}
          className={`absolute top-0 left-0 w-full h-full rounded-md z-10 transition-opacity duration-300 ${
            trailerLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Poster fallback */}
      {(!hovered || !trailerLoaded) && (
        <img
          src={imageUrl}
          alt={movie.title || "Movie"}
          className="w-full h-72 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no-image.jpg";
          }}
        />
      )}

      {/* Info Overlay */}
      <div className="p-3 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {movie.vote_average.toFixed(1)}/10
          </span>
          <div className="text-xs">{renderStars()}</div>
        </div>
      </div>

      {/* Mute button */}
      {hovered && trailerKey && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((prev) => !prev);
          }}
          className="absolute bottom-2 right-2 z-20 text-xs bg-black bg-opacity-70 text-white rounded px-2 py-1"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      )}
    </div>
  );
}

export default MovieCard;
