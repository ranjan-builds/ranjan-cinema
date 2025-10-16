import React, { useState } from "react";
import { Star, Calendar, Play, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card = ({ movie }) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you can add logic to save to favorites
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatVoteAverage = (vote) => {
    return vote ? vote.toFixed(1) : "N/A";
  };

  const getRatingColor = (vote) => {
    if (!vote) return "text-gray-400";
    if (vote >= 7.5) return "text-green-400";
    if (vote >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div
      className="group relative bg-gray-900/80 rounded-2xl overflow-hidden cursor-pointer border border-gray-700/50 backdrop-blur-sm hover:border-gray-500/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/50"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform ${
          isFavorite
            ? "bg-red-500/90 scale-110"
            : "bg-black/50 hover:bg-black/70 scale-100"
        } group-hover:scale-110`}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isFavorite ? "fill-white scale-110" : "text-white group-hover:scale-110"
          }`}
          size={16}
        />
      </button>

      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[2/3]">
        {movie.poster_path ? (
          <>
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-2xl" />
            )}
            
            {/* Main Image */}
            <img
              src={`${imageBaseUrl}${movie.poster_path}`}
              alt={movie.title || "Movie Poster"}
              className={`object-cover w-full h-full transition-all duration-700 ${
                imageLoaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              } ${isHovered ? "scale-110" : "scale-100"}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-all duration-500 ${
                isHovered ? "opacity-100" : "opacity-70"
              }`}
            />
            
            {/* Play Button on Hover */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isHovered
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }`}
            >
              <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </>
        ) : (
          // Fallback when no poster
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-2xl">
            <div className="text-center text-gray-400 p-4">
              <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${
          isHovered
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-90"
        }`}
      >
        {/* Title */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-white/95 transition-colors">
          {movie.title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center justify-between mb-2">
          {/* Year */}
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <Calendar className="w-3 h-3" />
            <span>{movie.release_date?.split("-")[0] || "TBA"}</span>
          </div>

          {/* Rating */}
          <div
            className={`flex items-center gap-1 text-sm font-medium ${getRatingColor(
              movie.vote_average
            )}`}
          >
            <Star className="w-4 h-4 fill-current" />
            <span>{formatVoteAverage(movie.vote_average)}</span>
          </div>
        </div>

        {/* Character (for cast movies) */}
        {movie.character && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <span className="text-xs text-gray-300 font-medium">
              as {movie.character}
            </span>
          </div>
        )}

        {/* Genre badges (you can add genres if available) */}
        {movie.genre_names && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genre_names.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default Card;