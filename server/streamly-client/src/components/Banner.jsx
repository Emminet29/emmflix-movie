import { useEffect, useState, useRef } from "react";
import { fetchMovieTrailer } from "../api/tmdb";

function Banner({ movie }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true); // start muted for autoplay
  const playerRef = useRef(null);

  useEffect(() => {
    const loadTrailer = async () => {
      if (movie?.id) {
        const key = await fetchMovieTrailer(movie.id);
        setTrailerKey(key);
      }
    };
    loadTrailer();
    setIsMuted(true); // reset mute to true on movie change for autoplay
  }, [movie]);

  useEffect(() => {
    if (!trailerKey) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady();
    }

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: trailerKey,
        playerVars: {
          autoplay: 1,
          controls: 1,
          loop: 1,
          playlist: trailerKey,
          modestbranding: 1,
          rel: 0,
          mute: 1, // always start muted
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [trailerKey]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/no-image.jpg";

  return (
    <header className="relative w-full h-[60vh] bg-black text-white overflow-hidden">
      {trailerKey ? (
        <>
          <div
            id="youtube-player"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70 transition"
            aria-label={isMuted ? "Unmute trailer sound" : "Mute trailer sound"}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </>
      ) : (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no-image.jpg";
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent px-6 py-10 flex flex-col justify-end">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
        <p className="max-w-xl text-sm md:text-base line-clamp-3">
          {movie.overview}
        </p>
      </div>
    </header>
  );
}

export default Banner;
