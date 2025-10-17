import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  Filter,
  Search,
  Grid,
  List,
  Play,
  Star,
  Calendar,
  Clock,
  X,
} from "lucide-react";
const SavedMovies = () => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [viewMode, setViewMode] = useState("list");
  const [isLoading, setIsLoading] = useState(true);



  // Format date function - moved to top level
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    loadSavedMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [savedMovies, searchQuery, sortBy]);

  const loadSavedMovies = () => {
    setIsLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem("savedMovies") || "[]");
      // Add timestamp if not present (for backward compatibility)
      const moviesWithTimestamp = saved.map((movie) => ({
        ...movie,
        dateAdded: movie.dateAdded || Date.now(),
      }));
      setSavedMovies(moviesWithTimestamp);
    } catch (error) {
      console.error("Error loading saved movies:", error);
      setSavedMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMovies = () => {
    let filtered = [...savedMovies];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

 

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title?.localeCompare(b.title);
        case "rating":
          return (b.vote_average || 0) - (a.vote_average || 0);
        case "releaseDate":
          return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        case "dateAdded":
        default:
          return (b.dateAdded || 0) - (a.dateAdded || 0);
      }
    });

    setFilteredMovies(filtered);
  };

  const removeMovie = (movieId) => {
    const updatedMovies = savedMovies.filter((movie) => movie.id !== movieId);
    setSavedMovies(updatedMovies);
    localStorage.setItem("savedMovies", JSON.stringify(updatedMovies));

    // Dispatch event to update navbar count
    window.dispatchEvent(new Event("savedMoviesUpdated"));
  };

  const clearAllMovies = () => {
    if (window.confirm("Are you sure you want to remove all saved movies?")) {
      setSavedMovies([]);
      localStorage.setItem("savedMovies", "[]");
      window.dispatchEvent(new Event("savedMoviesUpdated"));
    }
  };

 

  // Saved Movie Card Component - now inside main component to access formatDate
  const SavedMovieCard = ({ movie, onRemove, viewMode }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    if (viewMode === "list") {
      return (
        <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-[1.02]">
          <div className="flex gap-6">
            {/* Poster */}
            <div className="flex-shrink-0 w-24 h-36 rounded-xl overflow-hidden bg-gray-700">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <span className="text-gray-400 text-xs text-center px-2">
                    No image
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 mb-2">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    {movie.release_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {movie.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onRemove(movie.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 transform hover:scale-110 ml-4"
                  title="Remove from collection"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {movie.overview && (
                <p className="text-gray-300 line-clamp-2 mb-4">
                  {movie.overview}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Added {formatDate(movie.dateAdded)}
                </span>
                <Link
                  to={`/movie/${movie.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:border-yellow-400/50 rounded-lg transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid View
    return (
      <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10">
        <div className="relative mb-4 rounded-xl overflow-hidden">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Link
                to={`/movie/${movie.id}`}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                Details
              </Link>
              <button
                onClick={() => onRemove(movie.id)}
                className="p-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                title="Remove from collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-400">
              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Added {formatDate(movie.dateAdded)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Bookmark className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">
                  My Collection
                </h1>
                <p className="text-gray-400 mt-2">
                  {savedMovies.length}{" "}
                  {savedMovies.length === 1 ? "movie" : "movies"} saved
                </p>
              </div>
            </div>

            {savedMovies.length > 0 && (
              <button
                onClick={clearAllMovies}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {savedMovies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-yellow-400" />
                  Search
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-yellow-400" />
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="title">Title</option>
                  <option value="rating">Rating</option>
                  <option value="releaseDate">Release Date</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">View</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Movies Grid/List */}
            <div className="lg:col-span-3">
              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">
                  Showing {filteredMovies.length} of {savedMovies.length} movies
                  {searchQuery && ` for "${searchQuery}"`}
                </p>

                {filteredMovies.length === 0 && savedMovies.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedGenres([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-600/50 hover:border-gray-500 rounded-lg transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Movies Display */}
              {filteredMovies.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMovies.map((movie) => (
                      <SavedMovieCard
                        key={movie.id}
                        movie={movie}
                        onRemove={removeMovie}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMovies.map((movie) => (
                      <SavedMovieCard
                        key={movie.id}
                        movie={movie}
                        onRemove={removeMovie}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <Bookmark className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No movies found
                  </h3>
                  <p className="text-gray-500">
                    {savedMovies.length === 0
                      ? "Start saving movies to build your collection!"
                      : "Try adjusting your search or filters"}
                  </p>
                  {savedMovies.length === 0 && (
                    <Link
                      to="/movies"
                      className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                    >
                      <Play className="w-5 h-5" />
                      Browse Movies
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-yellow-400/30">
              <Bookmark className="w-16 h-16 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your collection is empty
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Start building your personal movie collection by saving your
              favorite films.
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              Explore Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMovies;
