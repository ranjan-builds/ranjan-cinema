"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ExternalLink, Sparkles } from "lucide-react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

const Cast = ({ casts }) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = (castId) => {
    setLoadedImages(prev => new Set(prev.add(castId)));
  };

  const handleCastClick = (castId) => {
    navigate(`/person/${castId}`);
  };

  return (
    <div className="relative group">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Top Cast
          </h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-yellow-400/50 to-transparent"></div>
      </div>

      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={16}
        slidesPerView={3}
        freeMode={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        breakpoints={{
          320: { 
            slidesPerView: 2.5,
            spaceBetween: 12 
          },
          480: { 
            slidesPerView: 3.5,
            spaceBetween: 14 
          },
          640: { 
            slidesPerView: 4,
            spaceBetween: 16 
          },
          768: { 
            slidesPerView: 5,
            spaceBetween: 18 
          },
          1024: { 
            slidesPerView: 6,
            spaceBetween: 20 
          },
          1280: { 
            slidesPerView: 7,
            spaceBetween: 22 
          },
          1536: { 
            slidesPerView: 8,
            spaceBetween: 24 
          },
        }}
        className="!px-4 !pb-8"
      >
        {casts.map((cast) => (
          <SwiperSlide key={cast.id} className="!h-auto">
            <div
              className="group/cast relative bg-gray-900/50 rounded-2xl overflow-hidden cursor-pointer border border-gray-700/50 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10 h-full flex flex-col"
              onClick={() => handleCastClick(cast.id)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-[2/3] bg-gray-800">
                {cast.profile_path ? (
                  <>
                    {/* Loading Skeleton */}
                    {!loadedImages.has(cast.id) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-2xl" />
                    )}
                    
                    {/* Cast Image */}
                    <img
                      src={`${imageBaseUrl}${cast.profile_path}`}
                      alt={cast.original_name}
                      className={`object-cover w-full h-full transition-all duration-700 ${
                        loadedImages.has(cast.id)
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      } group-hover/cast:scale-110`}
                      onLoad={() => handleImageLoad(cast.id)}
                    />
                  </>
                ) : (
                  // Fallback when no profile image
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover/cast:opacity-50 transition-opacity duration-300" />

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-400/10 opacity-0 group-hover/cast:opacity-100 transition-all duration-500" />

                {/* External Link Icon on Hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover/cast:opacity-100 transform translate-y-2 group-hover/cast:translate-y-0 transition-all duration-300">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                    <ExternalLink className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col">
                {/* Actor Name */}
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight group-hover/cast:text-yellow-400 transition-colors duration-300">
                  {cast.original_name}
                </h3>

                {/* Character Name */}
                <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed flex-1">
                  as{" "}
                  <span className="text-yellow-400/90 font-medium">
                    {cast.character}
                  </span>
                </p>

                {/* Popularity Indicator */}
                {cast.popularity && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Popularity</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 font-medium">
                          {cast.popularity.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/cast:inset-full transition-all duration-1000 group-hover/cast:duration-1000" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Hints */}
      <div className="absolute right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Scroll</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};

export default Cast;