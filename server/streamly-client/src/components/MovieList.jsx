import React from "react";

const MovieList = ({ movies }) => {
  if (!movies || movies.length === 0) {
    return <p className="text-center text-gray-400">No movies found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition"
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover rounded"
          />
          <h2 className="text-xl font-semibold mt-4">{movie.title}</h2>
          <p className="text-gray-400 text-sm mt-2">{movie.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
