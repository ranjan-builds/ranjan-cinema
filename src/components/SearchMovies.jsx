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
import { Spinner } from "@/components/ui/spinner";
import { Search, X, Star, Calendar, Play, Film } from "lucide-react";
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

useEffect(() => {
  if (open && inputRef.current) {
    setTimeout(() => inputRef.current?.focus(), 150); // Changed from 100ms to 150ms
  }
}, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 1) {
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
        setError("Missing TMDB API Key");
        setLoading(false);
        return;
      }

      const url = new URL(TMDB_SEARCH_URL);
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("query", query);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("include_adult", "false");

      fetch(url.toString(), { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
          const data = await res.json();
          setResults(data.results || []);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError(err.message || "Failed to fetch movies");
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query, open]);

  const handleSelectMovie = (movie) => {
    navigate(`/movie/${movie.id}`);
    setOpen(false);
    setQuery("");
  };

  const getRatingColor = (vote) => {
    if (vote >= 8) return "text-green-400";
    if (vote >= 7) return "text-yellow-400";
    if (vote >= 6) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-yellow-400/30 text-gray-300 hover:text-white transition-all duration-300 group ${className}`}
        >
          <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span className="hidden md:block">Search Movies...</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[85vh] w-[95vw] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Search Movies
                </DialogTitle>
                <DialogDescription className="text-gray-400 mt-1">
                  Discover your next favorite movie
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="rounded-xl hover:bg-gray-800/50 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4 flex flex-col">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors duration-300" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search movies..."
              className="w-full rounded-xl border border-gray-600/50 bg-gray-800/50 pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300 backdrop-blur-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center gap-3 py-8 text-gray-400">
              <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Searching for "{query}"...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <X className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && results.length === 0 && query && (
            <div className="text-center py-12 space-y-3">
              <Film className="w-16 h-16 text-gray-600 mx-auto" />
              <p className="text-gray-400 font-medium">No results found for</p>
              <p className="text-white text-lg">"{query}"</p>
              <p className="text-gray-500 text-sm">Try different keywords</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <p className="text-sm text-gray-400 font-medium">
                Found {results.length} results
              </p>
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="group flex items-start gap-4 p-4 rounded-xl cursor-pointer bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-yellow-400/20 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                >
                  {/* Movie Poster */}
                  <div className="w-16 h-24 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-700 group-hover:shadow-lg group-hover:shadow-yellow-400/10 transition-all duration-300">
                    {movie.poster_path ? (
                      <img
                        src={`${IMAGE_BASE}${movie.poster_path}`}
                        alt={movie.title || "Movie poster"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                      <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2 leading-tight">
                        {movie.title}
                      </h3>
                      {movie.vote_average > 0 && (
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-700/50 backdrop-blur-sm ${getRatingColor(
                            movie.vote_average
                          )}`}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      {movie.release_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{movie.release_date.split("-")[0]}</span>
                        </div>
                      )}
                      <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">
                        {movie.original_language?.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                      {movie.overview || "No description available."}
                    </p>

                    {/* Popularity indicator */}
                    {movie.popularity > 10 && (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(movie.popularity / 2, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-gray-400 font-medium">
                          Trending
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State - No search yet */}
          {!loading && !error && !query && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto border border-yellow-400/30">
                <Search className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-semibold text-lg">
                  Search for Movies
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Type the name of any movie to discover ratings, overview, and
                  more details.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {[
                  "Avengers",
                  "Inception",
                  "The Dark Knight",
                  "Interstellar",
                ].map((suggestion) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
