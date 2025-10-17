import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Bookmark,
  Share2,
  Clock,
  Star,
  ArrowRight,
  Heart,
  Calendar,
  Users,
  Award,
  DollarSign,
  Globe,
  Check,
  Link,
  Facebook,
  Twitter,
  MessageCircle,
  Download,
} from "lucide-react";
import ColorThief from "colorthief";
import {
  rgbToHex,
  getContrastColor,
  formatRuntime,
  getLighterShade,
} from "../lib/Helpers";
import { Spinner } from "@/components/ui/spinner";
import Card from "@/components/Card";
import Backdrops from "@/components/Backdrops";
import Cast from "@/components/Cast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function generateStaticParams() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
  );
  const data = await res.json();

  return data.results.map((movie) => ({
    id: movie.id.toString(),
  }));
}

const Movie = () => {
  const { id } = useParams();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [movie, setMovie] = useState(null);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#032541");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [similarMovies, setSimilarMovies] = useState([]);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [backdrops, setBackdrops] = useState([]);

  const heroRef = useRef(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      try {
        const endpoints = [
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`,
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}`,
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`,
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`,
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apiKey}`,
        ];

        const [movieRes, similarRes, creditsRes, videosRes, imagesRes] =
          await Promise.all(endpoints.map((url) => fetch(url)));

        const [movieData, similarData, creditsData, videosData, imagesData] =
          await Promise.all([
            movieRes.json(),
            similarRes.json(),
            creditsRes.json(),
            videosRes.json(),
            imagesRes.json(),
          ]);

        setMovie(movieData);
        setSimilarMovies(similarData.results?.slice(0, 12) || []);
        setCredits(creditsData.cast?.slice(0, 12) || []);
        setVideos(videosData.results || []);
        setBackdrops(imagesData.backdrops?.slice(0, 10) || []);
      } catch (err) {
        console.error("Error fetching movie data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id, apiKey]);

  // Check if movie is bookmarked on component mount
  useEffect(() => {
    const savedMovies = JSON.parse(localStorage.getItem("savedMovies") || "[]");
    const isMovieSaved = savedMovies.some(
      (savedMovie) => savedMovie.id === parseInt(id)
    );
    setIsBookmarked(isMovieSaved);
  }, [id]);

  useEffect(() => {
    if (!movie?.poster_path) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = `${imageBaseUrl}${movie.poster_path}?not-from-cache-please`;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 15);
        const [r, g, b] = palette[0];
        const hex = rgbToHex(r, g, b);
        setTextColor(getContrastColor(hex));
        setBgColor(hex);
        setIsReady(true);
      } catch (err) {
        console.error("Color extraction failed:", err);
        setIsReady(true);
      }
    };

    img.onerror = () => {
      console.error("Image failed to load");
      setIsReady(true);
    };
  }, [movie]);

  const openTrailer = () => {
    const trailer = videos.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );
    if (trailer) {
      setTrailerUrl(
        `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&rel=0&controls=1`
      );
      setIsDrawerOpen(true);
    } else {
      alert("Trailer not available");
    }
  };

  // Bookmark functionality
  const toggleBookmark = () => {
    const savedMovies = JSON.parse(localStorage.getItem("savedMovies") || "[]");

    if (isBookmarked) {
      // Remove from bookmarks
      const updatedMovies = savedMovies.filter(
        (savedMovie) => savedMovie.id !== movie.id
      );
      localStorage.setItem("savedMovies", JSON.stringify(updatedMovies));
      setIsBookmarked(false);
    } else {
      // Add to bookmarks
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
      };

      const updatedMovies = [...savedMovies, movieToSave];
      localStorage.setItem("savedMovies", JSON.stringify(updatedMovies));
      setIsBookmarked(true);
    }

    // Dispatch custom event to update navbar count
    window.dispatchEvent(new Event("savedMoviesUpdated"));
  };

  // Share functionality
  const shareMovie = async (platform = "copy") => {
    const movieUrl = window.location.href;
    const shareText = `Check out "${movie.title}" on CineVerse!`;

    switch (platform) {
      case "copy":
        try {
          await navigator.clipboard.writeText(movieUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = movieUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        }
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(movieUrl)}`,
          "_blank"
        );
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            movieUrl
          )}`,
          "_blank"
        );
        break;

      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            shareText + " " + movieUrl
          )}`,
          "_blank"
        );
        break;

      default:
        break;
    }

    setShowShareDropdown(false);
  };

  // Like functionality
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // You can add localStorage persistence for likes if needed
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Loading movie magic...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-900">
        {/* Enhanced Hero Section */}
        <div
          ref={heroRef}
          className="relative w-full min-h-screen overflow-hidden"
        >
          {/* Background with Multiple Layers */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                filter: "brightness(0.3) blur(2px)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex items-center py-20">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">
                {/* Poster Section */}
                <div className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-start">
                  <div className="relative group">
                    <div className="relative w-72 h-[432px] md:w-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                      <img
                        src={`${imageBaseUrl}${movie.poster_path}`}
                        className="object-cover w-full h-full"
                        alt={movie.title}
                        sizes="(max-width: 768px) 288px, 320px"
                      />
                    </div>
                    {/* Hover Effects */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={toggleLike}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          isLiked
                            ? "bg-red-500 text-white"
                            : "bg-black/50 text-white hover:bg-red-500"
                        }`}
                      >
                        <Heart
                          size={20}
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Movie Details */}
                <div className="lg:col-span-8 xl:col-span-9">
                  <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl">
                    {/* Header with Badges */}
                    <div className="mb-6 md:mb-8">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 px-3 py-1.5 rounded-full">
                          <Star
                            size={16}
                            className="text-yellow-400"
                            fill="currentColor"
                          />
                          <span className="text-yellow-100 font-bold text-sm">
                            {movie.vote_average?.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                          <Calendar size={14} className="text-white" />
                          <span className="text-white text-sm">
                            {movie.release_date?.split("-")[0]}
                          </span>
                        </div>
                        {movie.adult && (
                          <div className="bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full">
                            <span className="text-red-100 text-sm font-medium">
                              18+
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full">
                          <Globe size={14} className="text-white" />
                          <span className="text-white text-sm uppercase">
                            {movie.original_language}
                          </span>
                        </div>
                      </div>

                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-3 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                        {movie.title}
                      </h1>

                      <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-4">
                        <span>{movie.release_date}</span>
                        <span>•</span>
                        <span>
                          {movie.genres?.map((genre) => genre.name).join(" • ")}
                        </span>
                        <span>•</span>
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group">
                        <div className="flex items-center gap-2 mb-2">
                          <Users size={16} className="text-blue-400" />
                          <span className="text-white text-sm font-medium">
                            Votes
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {movie.vote_count?.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group">
                        <div className="flex items-center gap-2 mb-2">
                          <Award size={16} className="text-green-400" />
                          <span className="text-white text-sm font-medium">
                            Rating
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {movie.vote_average?.toFixed(1)}/10
                        </p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-purple-400" />
                          <span className="text-white text-sm font-medium">
                            Runtime
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {formatRuntime(movie.runtime)}
                        </p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign size={16} className="text-orange-400" />
                          <span className="text-white text-sm font-medium">
                            Budget
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-white w-full truncate">
                          {formatCurrency(movie.budget)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
                      {/* Watch Trailer Button - Full width on mobile */}
                      <div className="w-full sm:w-auto">
                        <button
                          onClick={openTrailer}
                          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                          style={{
                            background: `linear-gradient(135deg, ${getLighterShade(
                              bgColor,
                              20
                            )}, ${getLighterShade(bgColor, -10)})`,
                            color: getContrastColor(bgColor),
                          }}
                        >
                          <Play size={20} className="flex-shrink-0" />
                          <span>Watch Trailer</span>
                        </button>
                      </div>

                      {/* Action Buttons - Aligned properly on mobile */}
                      <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          onClick={toggleBookmark}
                          className={`flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-2xl transition-all duration-300 border transform hover:scale-110 flex-1 sm:flex-none ${
                            isBookmarked
                              ? "bg-yellow-500 border-yellow-500 text-gray-900"
                              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                          }`}
                        >
                          <Bookmark
                            size={20}
                            fill={isBookmarked ? "currentColor" : "none"}
                          />
                        </button>

                        <button
                          onClick={() =>
                            window.open(
                              `https://bollyflix.esq/search/${encodeURIComponent(
                                movie.title
                              )}`,
                              "_blank"
                            )
                          }
                          className="flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-2xl transition-all duration-300 border transform hover:scale-110 bg-white/10 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-none"
                        >
                          <Download size={20} />
                        </button>

                        <DropdownMenu
                          open={showShareDropdown}
                          onOpenChange={setShowShareDropdown}
                        >
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-300 border border-white/20 text-white transform hover:scale-110 flex-1 sm:flex-none">
                              {copySuccess ? (
                                <Check size={20} />
                              ) : (
                                <Share2 size={20} />
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border border-gray-700 rounded-xl backdrop-blur-sm">
                            <DropdownMenuItem
                              onClick={() => shareMovie("copy")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer"
                            >
                              <Link size={16} />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("twitter")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer"
                            >
                              <Twitter size={16} />
                              Share on Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("facebook")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer"
                            >
                              <Facebook size={16} />
                              Share on Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("whatsapp")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer"
                            >
                              <MessageCircle size={16} />
                              Share on WhatsApp
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="space-y-4">
                      {movie.tagline && (
                        <p className="text-xl md:text-2xl italic text-gray-300 font-light text-center md:text-left">
                          "{movie.tagline}"
                        </p>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          Overview
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed text-gray-200">
                          {movie.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="relative z-20 bg-gray-900">
          {/* Backdrops Section */}
          {backdrops.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Gallery
                  </h2>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                    <span>View All</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
                <Backdrops movies={backdrops} />
              </div>
            </section>
          )}

          {/* Cast Section */}
          {credits.length > 0 && (
            <section className="py-16 bg-gray-800/50">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <Cast casts={credits} />
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    You Might Also Like
                  </h2>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors group">
                    <span>View More</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {similarMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    >
                      <Card movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Mobile Action Bar */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-lg rounded-2xl px-4 py-3 border border-white/10 shadow-2xl">
            <button
              onClick={openTrailer}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold flex-1"
            >
              <Play size={16} />
              Trailer
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl transition-colors transform hover:scale-110 ${
                isBookmarked
                  ? "text-yellow-400"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Bookmark
                size={16}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => shareMovie("copy")}
              className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors transform hover:scale-110"
            >
              {copySuccess ? <Check size={16} /> : <Share2 size={16} />}
            </button>
          </div>
        </div>
      </main>

      {/* Trailer Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh] bg-black ">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl text-white">
              {movie?.title} - Trailer
            </DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-[400px] md:h-[500px] p-4">
            {trailerUrl && (
              <iframe
                width="100%"
                height="100%"
                src={trailerUrl}
                title="Trailer"
                className="rounded-lg"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Movie;
