import { useEffect, useState } from "react";
import { fetchMovieTrailer } from "../api/tmdb";

const Modal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) return;

    const loadTrailer = async () => {
      setLoading(true);
      try {
        const key = await fetchMovieTrailer(movie.id);
        setTrailerKey(key);
      } catch (err) {
        console.error("Failed to load trailer:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrailer();
  }, [movie]);

  const getYear = (date) => (date ? new Date(date).getFullYear() : "N/A");

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-2xl bg-base-100 dark:bg-base-200 shadow-xl relative overflow-y-auto max-h-[90vh] p-6 text-base-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          ✕
        </button>

        <div className="card-body p-0">
          {/* Title */}
          <h2 className="card-title text-2xl md:text-3xl mb-3">
            {movie.title}
          </h2>

          {/* Genres */}
          {movie.genre_ids && (
            <div className="flex flex-wrap gap-2 mb-3 text-sm">
              {movie.genre_ids.slice(0, 4).map((genre) => (
                <div
                  key={genre}
                  className="badge badge-outline badge-primary text-xs"
                >
                  #{genre}
                </div>
              ))}
            </div>
          )}

          {/* Rating and Year */}
          <div className="text-sm opacity-70 mb-3">
            <span className="mr-4">⭐ {movie.vote_average} / 10</span>
            <span>📅 {getYear(movie.release_date)}</span>
          </div>

          {/* Overview */}
          <p className="text-sm leading-relaxed mb-4">
            {movie.overview || "No description available."}
          </p>

          {/* Trailer or Loading */}
          {loading ? (
            <div className="flex justify-center my-6">
              <span className="loading loading-spinner text-primary" />
            </div>
          ) : trailerKey ? (
            <div className="relative h-0 pb-[56.25%] mb-4 rounded overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Trailer not available.</p>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                ▶ Watch Trailer
              </a>
            )}
            <button
              className="btn btn-success btn-sm"
              onClick={() => alert("Download feature coming soon!")}
            >
              ⬇ Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
