import React, { useState, useEffect } from "react";
import {
  Shuffle,
  Filter,
  Search,
  Bookmark,
  Calendar,
  Users,
  X,
  SlidersHorizontal,
  Play,
} from "lucide-react";
import Card from "@/components/Card";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    sortBy: "popularity.desc",
    withKeywords: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Genres list
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  const navigate = useNavigate();

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  // Years for filter
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  // Check if random movie is bookmarked
  useEffect(() => {
    if (randomMovie) {
      const savedMovies = JSON.parse(
        localStorage.getItem("savedMovies") || "[]"
      );
      const isSaved = savedMovies.some((movie) => movie.id === randomMovie.id);
      setIsBookmarked(isSaved);
    }
  }, [randomMovie]);

  // Fetch movies based on filters
  const fetchMovies = async (page = 1, resetRandom = true) => {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;

      // Add filters to URL
      if (filters.genre) url += `&with_genres=${filters.genre}`;
      if (filters.year) url += `&year=${filters.year}`;
      if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
      if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
      if (filters.withKeywords) url += `&with_keywords=${filters.withKeywords}`;

      const response = await fetch(url);
      const data = await response.json();

      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB limits to 500 pages
      setCurrentPage(page);

      if (resetRandom && data.results?.length > 0) {
        getRandomMovie(data.results);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get a completely random movie
  const getRandomMovie = async (movieList = null) => {
    setRandomLoading(true);
    try {
      if (movieList) {
        // Get random from current list
        const randomIndex = Math.floor(Math.random() * movieList.length);
        setRandomMovie(movieList[randomIndex]);
      } else {
        // Get completely random movie
        const randomPage = Math.floor(Math.random() * 500) + 1;
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${randomPage}&sort_by=popularity.desc`
        );
        const data = await response.json();
        if (data.results?.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          setRandomMovie(data.results[randomIndex]);
        }
      }
    } catch (error) {
      console.error("Error fetching random movie:", error);
    } finally {
      setRandomLoading(false);
    }
  };

  const toggleBookmark = () => {
    if (!randomMovie) return;

    const savedMovies = JSON.parse(localStorage.getItem("savedMovies") || "[]");

    if (isBookmarked) {
      // Remove from bookmarks
      const updatedMovies = savedMovies.filter(
        (savedMovie) => savedMovie.id !== randomMovie.id
      );
      localStorage.setItem("savedMovies", JSON.stringify(updatedMovies));
      setIsBookmarked(false);
    } else {
      // Add to bookmarks
      const movieToSave = {
        id: randomMovie.id,
        title: randomMovie.title,
        poster_path: randomMovie.poster_path,
        release_date: randomMovie.release_date,
        vote_average: randomMovie.vote_average,
        overview: randomMovie.overview,
      };

      const updatedMovies = [...savedMovies, movieToSave];
      localStorage.setItem("savedMovies", JSON.stringify(updatedMovies));
      setIsBookmarked(true);
    }

    // Dispatch custom event to update navbar count
    window.dispatchEvent(new Event("savedMoviesUpdated"));
  };

  // Search movies
  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      fetchMovies(page);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}&page=${page}`
      );
      const data = await response.json();
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setSearchQuery("");
    fetchMovies(1);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      rating: "",
      sortBy: "popularity.desc",
      withKeywords: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
    fetchMovies(1);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchMovies(searchQuery, 1);
  };

  // Load initial movies
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // Pagination component
  const Pagination = () => {
    const pages = [];
    const [maxVisiblePages, setMaxVisiblePages] = useState(5);

    // Responsive page count based on screen size
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          // sm breakpoint
          setMaxVisiblePages(3);
        } else if (window.innerWidth < 768) {
          // md breakpoint
          setMaxVisiblePages(4);
        } else {
          setMaxVisiblePages(5);
        }
      };

      handleResize(); // Set initial value
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() =>
            searchQuery ? searchMovies(searchQuery, i) : fetchMovies(i, false)
          }
          className={`px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base ${
            currentPage === i
              ? "bg-yellow-400 text-gray-900 font-bold scale-105"
              : "bg-gray-700/50 text-white hover:bg-gray-600/50"
          }`}
        >
          {i}
        </button>
      );
    }

    const handlePageChange = (page) => {
      if (searchQuery) {
        searchMovies(searchQuery, page);
      } else {
        fetchMovies(page, false);
      }
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-8 w-full">
        {/* Mobile First Navigation */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center px-3 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-[80px]"
          >
            <span className="sm:hidden">← Prev</span>
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Mobile current page indicator */}
          <div className="sm:hidden flex items-center gap-1 px-3 py-2">
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center px-3 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-[80px]"
          >
            <span className="sm:hidden">Next →</span>
            <span className="hidden sm:inline">Next</span>
          </button>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden sm:flex items-center justify-center gap-1 lg:gap-2">
          {/* First page and ellipsis */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-2 lg:px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300 text-sm lg:text-base"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400 px-1">...</span>}
            </>
          )}

          {/* Page numbers */}
          {pages}

          {/* Last page and ellipsis */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="text-gray-400 px-1">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-2 lg:px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300 text-sm lg:text-base"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Additional mobile info */}
        <div className="sm:hidden text-gray-400 text-xs mt-2">
          Swipe for more pages
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Discover{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Movies
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find your next favorite movie with advanced filters and random
            suggestions
          </p>
        </div>

        {/* Random Movie Suggestion */}
        {randomMovie && (
          <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-8 border border-gray-700/50 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shuffle className="w-6 h-6 text-yellow-400" />
                Random Pick
              </h2>
              <button
                onClick={() => getRandomMovie()}
                disabled={randomLoading}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:border-yellow-400/50 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {randomLoading ? (
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Shuffle className="w-4 h-4" />
                )}
                Shuffle Again
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <img
                  src={
                    randomMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
                      : "/placeholder-poster.jpg"
                  }
                  alt={randomMovie.title}
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>

              <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {randomMovie.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-400/30">
                    <Bookmark className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-100 font-bold">
                      {randomMovie.vote_average?.toFixed(1)}
                    </span>
                  </div>

                  {randomMovie.release_date && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <Calendar className="w-4 h-4 text-white" />
                      <span className="text-white">
                        {new Date(randomMovie.release_date).getFullYear()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white">
                      {randomMovie.vote_count?.toLocaleString()} votes
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {randomMovie.overview || "No description available."}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleMovieClick(randomMovie.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    View Details
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-all duration-300 ${
                      isBookmarked
                        ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Bookmark
                      size={16}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                    {isBookmarked
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 hover:bg-gray-600/50 text-white border border-gray-600/50 rounded-xl transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.values(filters).some((value) => value) && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </button>

            {Object.values(filters).some((value) => value) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-700/30 rounded-2xl border border-gray-600/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Genre
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) =>
                      handleFilterChange("genre", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Release Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange("year", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">Any Rating</option>
                    <option value="8">8+ Stars</option>
                    <option value="7">7+ Stars</option>
                    <option value="6">6+ Stars</option>
                    <option value="5">5+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="popularity.desc">Popularity</option>
                    <option value="release_date.desc">Newest First</option>
                    <option value="release_date.asc">Oldest First</option>
                    <option value="vote_average.desc">Highest Rated</option>
                    <option value="vote_count.desc">Most Votes</option>
                    <option value="revenue.desc">Highest Revenue</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={applyFilters}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Discover Movies"}
            </h2>
            <p className="text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 text-lg">Loading movies...</p>
              </div>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  >
                    <Card movie={movie} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && <Pagination />}
            </>
          ) : (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No movies found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : "Try adjusting your filters to find more movies"}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:border-yellow-400/50 rounded-xl transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
