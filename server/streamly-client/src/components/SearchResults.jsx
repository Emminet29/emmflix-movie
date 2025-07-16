import MovieCard from "./MovieCard";

const SearchResults = ({ results }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Search Results
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No results found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="hover:scale-105 transform transition duration-300 ease-in-out"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
