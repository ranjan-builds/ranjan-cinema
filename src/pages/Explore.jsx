import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Filter, 
  Search, 
  Star, 
  Calendar, 
  Users,
  X,
  SlidersHorizontal,
  Grid,
  List,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import Card from "@/components/Card";
import { Spinner } from "@/components/ui/spinner";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  // Get initial filters from URL params
  const initialFilters = {
    type: searchParams.get('type') || 'discover',
    genre: searchParams.get('genre') || '',
    language: searchParams.get('language') || '',
    sortBy: searchParams.get('sortBy') || 'popularity.desc',
    year: searchParams.get('year') || '',
    rating: searchParams.get('rating') || ''
  };

  const [filters, setFilters] = useState(initialFilters);

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

  // Languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' }
  ];

  // Years for filter
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  // Fetch movies based on filters
  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      let url = '';
      
      if (filters.type === 'trending') {
        url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}&region=IN`;
      } else if (filters.type === 'now_playing') {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}&region=IN`;
      } else if (filters.type === 'upcoming') {
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&page=${page}&region=IN`;
      } else if (filters.type === 'top_rated') {
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=${page}`;
      } else {
        // Discover with filters
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
        
        if (filters.genre) url += `&with_genres=${filters.genre}`;
        if (filters.language) url += `&with_original_language=${filters.language}`;
        if (filters.year) url += `&year=${filters.year}`;
        if (filters.rating) url += `&vote_average.gte=${filters.rating}`;
        if (filters.sortBy) url += `&sort_by=${filters.sortBy}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Update URL params when filters change
  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateURLParams(newFilters);
    setCurrentPage(1);
  };

  // Apply filters and fetch movies
  const applyFilters = () => {
    fetchMovies(1);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {
      type: 'discover',
      genre: '',
      language: '',
      sortBy: 'popularity.desc',
      year: '',
      rating: ''
    };
    setFilters(newFilters);
    updateURLParams(newFilters);
    setCurrentPage(1);
    fetchMovies(1);
  };

  // Get category title based on filters
  const getCategoryTitle = () => {
    if (filters.type === 'trending') return 'Trending Movies';
    if (filters.type === 'now_playing') return 'Now Playing in Theaters';
    if (filters.type === 'upcoming') return 'Upcoming Movies';
    if (filters.type === 'top_rated') return 'Top Rated Movies';
    
    if (filters.genre) {
      const genre = genres.find(g => g.id === parseInt(filters.genre));
      if (genre) return `${genre.name} Movies`;
    }
    
    if (filters.language) {
      const lang = languages.find(l => l.code === filters.language);
      if (lang) return `${lang.name} Movies`;
    }
    
    return 'Discover Movies';
  };

  // Get category description based on filters
  const getCategoryDescription = () => {
    if (filters.type === 'trending') return 'Most popular movies this week';
    if (filters.type === 'now_playing') return 'Currently running in theaters';
    if (filters.type === 'upcoming') return 'Coming soon to theaters';
    if (filters.type === 'top_rated') return 'Highest rated movies of all time';
    
    if (filters.genre) {
      return `Explore ${genres.find(g => g.id === parseInt(filters.genre))?.name} movies`;
    }
    
    if (filters.language) {
      return `Movies in ${languages.find(l => l.code === filters.language)?.name}`;
    }
    
    return 'Browse through our extensive movie collection';
  };

  // Load movies when component mounts or filters change
  useEffect(() => {
    fetchMovies(1);
  }, [filters.type, filters.genre, filters.language, filters.sortBy, filters.year, filters.rating]);

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
          onClick={() => fetchMovies(i)}
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

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
        <button
          onClick={() => fetchMovies(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => fetchMovies(1)}
              className="px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-400 px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-400 px-2">...</span>}
            <button
              onClick={() => fetchMovies(totalPages)}
              className="px-3 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => fetchMovies(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300 flex items-center gap-2"
        >
          Next
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-2xl border border-gray-700/50 text-gray-400 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-white">
                {getCategoryTitle()}
              </h1>
              <p className="text-gray-400 mt-2">
                {getCategoryDescription()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800/50 rounded-2xl p-1 border border-gray-700/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-yellow-400 text-gray-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-yellow-400 text-gray-900"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/50 rounded-2xl transition-all duration-300"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:block">Filters</span>
              {Object.values(filters).some(value => value && value !== 'discover' && value !== 'popularity.desc') && (
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">
                  {totalResults.toLocaleString()} movies found
                </span>
              </div>
              <div className="text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {Object.values(filters).some(value => value && value !== 'discover' && value !== 'popularity.desc') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Category Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Category
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                >
                  <option value="discover">Discover</option>
                  <option value="trending">Trending</option>
                  <option value="now_playing">Now Playing</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="top_rated">Top Rated</option>
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                >
                  <option value="">All Languages</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                >
                  <option value="popularity.desc">Popularity</option>
                  <option value="release_date.desc">Newest First</option>
                  <option value="release_date.asc">Oldest First</option>
                  <option value="vote_average.desc">Highest Rated</option>
                  <option value="vote_count.desc">Most Votes</option>
                  <option value="revenue.desc">Highest Revenue</option>
                  <option value="original_title.asc">Title (A-Z)</option>
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

        {/* Movies Grid */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 text-lg">Loading movies...</p>
              </div>
            </div>
          ) : movies.length > 0 ? (
            <>
              {viewMode === "grid" ? (
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
              ) : (
                <div className="space-y-4">
                  {movies.map(movie => (
                    <div
                      key={movie.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300"
                    >
                      <div className="flex gap-6">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          className="w-24 h-36 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {movie.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {movie.overview}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-4 h-4 fill-current" />
                              {movie.vote_average?.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{movie.vote_count} votes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination />
            </>
          ) : (
            <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No movies found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to find more movies
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

export default Explore;