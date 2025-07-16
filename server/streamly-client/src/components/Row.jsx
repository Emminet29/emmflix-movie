import MovieCard from "./MovieCard";

function Row({ title, movies = [], onCardClick }) {
  if (!movies.length) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">No movies found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2 text-black dark:text-white">
        {title}
      </h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[150px] md:min-w-[200px]">
            <MovieCard movie={movie} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Row;
