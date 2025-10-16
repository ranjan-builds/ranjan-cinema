import React, { useState, useEffect } from "react";
import { 
  Shuffle, 
  Filter, 
  Search, 
  Star, 
  Calendar, 
  Users,
  Clock,
  X,
  SlidersHorizontal,
  Play
} from "lucide-react";
import Card from "@/components/Card";
import { Spinner } from "@/components/ui/spinner";

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomLoading, setRandomLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    rating: "",
    popularity: "",
    sortBy: "popularity.desc",
    withKeywords: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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
    { id: 37, name: "Western" }
  ];

  // Years for filter
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

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

  // Search movies
  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      fetchMovies(page);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`
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
    setFilters(prev => ({
      ...prev,
      [key]: value
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
      popularity: "",
      sortBy: "popularity.desc",
      withKeywords: ""
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
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => searchQuery ? searchMovies(searchQuery, i) : fetchMovies(i, false)}
          className={`px-3 py-2 rounded-lg transition-all duration-300 ${
            currentPage === i
              ? "bg-yellow-400 text-gray-900 font-bold"
              : "bg-gray-700/50 text-white hover:bg-gray-600/50"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => searchQuery ? searchMovies(searchQuery, currentPage - 1) : fetchMovies(currentPage - 1, false)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => searchQuery ? searchMovies(searchQuery, 1) : fetchMovies(1, false)}
              className="px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
            <button
              onClick={() => searchQuery ? searchMovies(searchQuery, totalPages) : fetchMovies(totalPages, false)}
              className="px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => searchQuery ? searchMovies(searchQuery, currentPage + 1) : fetchMovies(currentPage + 1, false)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Discover <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Movies</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find your next favorite movie with advanced filters and random suggestions
          </p>
        </div>

        {/* Random Movie Suggestion */}
        {randomMovie && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 mb-12">
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
                  src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`}
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
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
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
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
                    <Play className="w-5 h-5" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300">
                    <Star className="w-5 h-5" />
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 rounded-xl transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.values(filters).some(value => value) && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </button>

            {Object.values(filters).some(value => value) && (
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
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
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
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
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
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
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
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
              {searchQuery ? `Search Results for "${searchQuery}"` : "Discover Movies"}
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
                {movies.map(movie => (
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
                  : "Try adjusting your filters to find more movies"
                }
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