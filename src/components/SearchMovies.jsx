import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, X, Star, Calendar, Play, Film, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie";

export default function SearchMovies({ className = "" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus management with better timing
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Search logic with improved error handling
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    const searchQuery = query?.trim();
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      
      const controller = new AbortController();
      abortRef.current = controller;

      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      if (!apiKey) {
        setError("API configuration error. Please try again later.");
        setLoading(false);
        return;
      }

      const url = new URL(TMDB_SEARCH_URL);
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("query", searchQuery);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("include_adult", "false");
      url.searchParams.set("page", "1");

      fetch(url.toString(), { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Search failed: ${res.status} - ${errorText}`);
          }
          const data = await res.json();
          // Filter out results without title and sort by popularity
          const filteredResults = (data.results || [])
            .filter(movie => movie.title && movie.poster_path)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 20); // Limit results
          setResults(filteredResults);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          console.error("Search error:", err);
          setError(err.message || "Failed to search movies. Please check your connection.");
        })
        .finally(() => setLoading(false));
    }, 350); // Optimized debounce time

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, open]);

  const handleSelectMovie = (movie) => {
    if (movie?.id) {
      navigate(`/movie/${movie.id}`);
      setOpen(false);
      setQuery("");
      setResults([]);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  };

  const getRatingColor = (vote) => {
    if (vote >= 8) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (vote >= 7) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    if (vote >= 6) return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  const getPopularityWidth = (popularity) => {
    return Math.min((popularity / 100) * 100, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (query) {
        clearSearch();
      } else {
        setOpen(false);
      }
    }
  };

  const popularSuggestions = [
    "Avengers", "Inception", "The Dark Knight", "Interstellar", 
    "Pulp Fiction", "The Godfather", "Parasite", "Spirited Away"
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-yellow-400/30 text-gray-300 hover:text-white transition-all duration-300 group backdrop-blur-sm ${className}`}
        >
          <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden md:block text-sm font-medium">Search Movies...</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] w-[95vw] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <Search className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Search Movies
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-1 text-sm">
                  Discover your next favorite movie from thousands of titles
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-xl hover:bg-gray-800/50 hover:text-white transition-colors duration-200 h-10 w-10 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4 flex flex-col">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for movies... (min. 2 characters)"
              className="w-full rounded-xl border border-gray-600/50 bg-gray-800/50 pl-12 pr-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300 backdrop-blur-sm text-sm"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-8 text-gray-400">
              <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium text-sm">Searching for "{query}"...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <X className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12 space-y-4">
              <Film className="w-16 h-16 text-gray-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-gray-400 font-medium">No results found for</p>
                <p className="text-white text-lg font-semibold">"{query}"</p>
                <p className="text-gray-500 text-sm">Try different keywords or check spelling</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {popularSuggestions.slice(0, 4).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1.5 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-full border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400 font-medium">
                  Found {results.length} results
                </p>
                <button
                  onClick={clearSearch}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className="group flex items-start gap-4 p-4 rounded-xl cursor-pointer bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-yellow-400/20 transition-all duration-300 backdrop-blur-sm active:scale-[0.98]"
                  >
                    {/* Movie Poster */}
                    <div className="w-16 h-24 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-700 group-hover:shadow-lg group-hover:shadow-yellow-400/10 transition-all duration-300">
                      {movie.poster_path ? (
                        <img
                          src={`${IMAGE_BASE}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                          <Film className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2 leading-tight text-sm">
                          {movie.title}
                        </h3>
                        {movie.vote_average > 0 && (
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full border backdrop-blur-sm text-xs font-bold min-w-[60px] justify-center ${getRatingColor(
                              movie.vote_average
                            )}`}
                          >
                            <Star className="w-3 h-3 fill-current" />
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {movie.release_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{movie.release_date.split("-")[0]}</span>
                          </div>
                        )}
                        <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">
                          {movie.original_language?.toUpperCase()}
                        </span>
                        {movie.popularity > 50 && (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>Trending</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {movie.overview || "No description available."}
                      </p>

                      {/* Popularity indicator */}
                      {movie.popularity > 10 && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${getPopularityWidth(movie.popularity)}%`,
                              }}
                            />
                          </div>
                          <span className="text-gray-400 font-medium text-xs">
                            {Math.round(movie.popularity)} popularity
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - No search yet */}
          {!loading && !error && !query && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto border border-yellow-400/30">
                <Search className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-lg">
                  Search for Movies
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                  Discover movies by title. Get ratings, overviews, release dates, and more details instantly.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <p className="text-xs text-gray-500 w-full mb-2">Popular searches:</p>
                {popularSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-2 text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}