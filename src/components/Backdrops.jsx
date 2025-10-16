import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Expand, Play, Download, Star } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/zoom";

const Backdrops = ({ movies }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageBaseUrl = "https://image.tmdb.org/t/p/w780"; // Higher quality

  const openLightbox = (movie) => {
    setSelectedImage(movie);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const downloadImage = (movie) => {
    const link = document.createElement('a');
    link.href = `${imageBaseUrl}${movie.file_path}`;
    link.download = `backdrop-${movie.id}.jpg`;
    link.click();
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No backdrops available</p>
      </div>
    );
  }

  return (
    <div className="px-1">
      {/* Main Backdrops Carousel */}
      <Swiper
        modules={[FreeMode, Navigation, Thumbs, Zoom]}
        spaceBetween={16}
        slidesPerView={1.2}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        zoom={true}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 3.5 },
        }}
        className="backdrops-swiper mb-6"
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={`${movie.id}-${index}`}>
            <div className="group relative rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10">
              <div className="swiper-zoom-container">
                {movie.file_path && (
                  <img
                    src={`${imageBaseUrl}${movie.file_path}`}
                    alt={movie.title || "Movie backdrop"}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
              </div>
              
              {/* Overlay with Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  {/* Image Info */}
                  <div className="text-white">
                    <p className="text-sm font-semibold line-clamp-1">
                      Backdrop {index + 1}
                    </p>
                    {movie.width && movie.height && (
                      <p className="text-xs text-gray-300">
                        {movie.width} × {movie.height}
                      </p>
                    )}
                    {movie.vote_average && (
                      <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadImage(movie)}
                      className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => openLightbox(movie)}
                      className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
                      title="Expand"
                    >
                      <Expand className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading Skeleton */}
              {!movie.file_path && (
                <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails Carousel */}
      {movies.length > 1 && (
        <Swiper
          modules={[FreeMode, Navigation, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          breakpoints={{
            480: { slidesPerView: 5 },
            640: { slidesPerView: 6 },
            768: { slidesPerView: 7 },
            1024: { slidesPerView: 8 },
          }}
          className="thumbnails-swiper"
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={`thumb-${movie.id}-${index}`}>
              <div className="group relative rounded-xl overflow-hidden bg-gray-800/30 border-2 border-transparent hover:border-yellow-400/50 transition-all duration-300 cursor-pointer">
                {movie.file_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.file_path}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                <div className="absolute bottom-1 left-1">
                  <span className="text-xs text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                    {index + 1}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={`https://image.tmdb.org/t/p/original${selectedImage.file_path}`}
              alt="Expanded backdrop"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {/* Close and Action Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => downloadImage(selectedImage)}
                className="p-3 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black/80 transition-all duration-300 hover:scale-110 text-white"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={closeLightbox}
                className="p-3 bg-black/60 backdrop-blur-sm rounded-xl hover:bg-black/80 transition-all duration-300 hover:scale-110 text-white"
              >
                <Expand className="w-5 h-5" />
              </button>
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Original Backdrop</p>
                  {selectedImage.width && selectedImage.height && (
                    <p className="text-sm text-gray-300">
                      Resolution: {selectedImage.width} × {selectedImage.height}
                    </p>
                  )}
                  {selectedImage.vote_average && (
                    <p className="text-sm text-yellow-400">
                      Rating: {selectedImage.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeLightbox}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backdrops;