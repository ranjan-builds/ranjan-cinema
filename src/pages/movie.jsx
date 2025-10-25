import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  ExternalLink,
  Film,
  Ticket,
  ShoppingBag,
  MonitorPlay,
} from "lucide-react";
import ColorThief from "colorthief";
import {
  rgbToHex,
  getContrastColor,
  formatRuntime,
  getLighterShade,
  getDarkerShade,
} from "../lib/Helpers";

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
import Loader from "../components/Loader";

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
  const navigate = useNavigate();
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
  const [collection, setCollection] = useState(null);
  const [watchProviders, setWatchProviders] = useState({});
  const [activeProviderTab, setActiveProviderTab] = useState("flatrate");

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
          `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`,
        ];

        const [
          movieRes,
          similarRes,
          creditsRes,
          videosRes,
          imagesRes,
          providersRes,
        ] = await Promise.all(endpoints.map((url) => fetch(url)));

        const [
          movieData,
          similarData,
          creditsData,
          videosData,
          imagesData,
          providersData,
        ] = await Promise.all([
          movieRes.json(),
          similarRes.json(),
          creditsRes.json(),
          videosRes.json(),
          imagesRes.json(),
          providersRes.json(),
        ]);

        setMovie(movieData);
        setSimilarMovies(similarData.results?.slice(0, 12) || []);
        setCredits(creditsData.cast?.slice(0, 12) || []);
        setVideos(videosData.results || []);
        setBackdrops(imagesData.backdrops?.slice(0, 10) || []);
        setCollection(movieData.belongs_to_collection || null);
        setWatchProviders(providersData.results?.US || {});

        // Fetch collection data if exists
        if (movieData.belongs_to_collection) {
          const collectionRes = await fetch(
            `https://api.themoviedb.org/3/collection/${movieData.belongs_to_collection.id}?api_key=${apiKey}`
          );
          const collectionData = await collectionRes.json();
          setCollection(collectionData);
        }
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
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get provider type display name
  const getProviderTypeName = (type) => {
    const types = {
      flatrate: "Stream",
      rent: "Rent",
      buy: "Buy",
      free: "Free",
    };
    return types[type] || type;
  };

  // Get provider type icon
  const getProviderTypeIcon = (type) => {
    const icons = {
      flatrate: MonitorPlay,
      rent: DollarSign,
      buy: ShoppingBag,
      free: Award,
    };
    return icons[type] || Ticket;
  };

  // Handle provider click
  const handleProviderClick = (provider, type) => {
    // In a real app, you would have actual deep links or URLs for each provider
    // For now, we'll simulate with a search query
    const searchQuery = encodeURIComponent(`${movie.title} ${type}`);

    // You can replace this with actual provider URLs when available
    const providerUrls = {
      netflix: `https://netflix.com/search?q=${searchQuery}`,
      amazon: `https://primevideo.com/search?q=${searchQuery}`,
      hbo: `https://hbomax.com/search?q=${searchQuery}`,
      hulu: `https://hulu.com/search?q=${searchQuery}`,
      disney: `https://disneyplus.com/search?q=${searchQuery}`,
      apple: `https://tv.apple.com/search?q=${searchQuery}`,
    };

    const providerName = provider.provider_name.toLowerCase();
    const url =
      providerUrls[providerName] ||
      `https://google.com/search?q=${searchQuery}+streaming`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center bg-black">
        <Loader />
      </div>
    );
  }

  const lighterBg = getLighterShade(bgColor, 15);
  const darkerBg = getDarkerShade(bgColor, 20);
  const accentColor = getLighterShade(bgColor, 30);

  return (
    <>
      <main
        className="min-h-screen bg-gray-950"
        style={{ "--accent-color": accentColor }}
      >
        {/* Enhanced Hero Section with Dynamic Colors */}
        <div
          ref={heroRef}
          className="relative w-full min-h-screen overflow-hidden"
        >
          {/* Dynamic Background with Gradient Overlay */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                filter: "brightness(0.4) blur(3px)",
              }}
            />
            {/* Dynamic gradient overlay based on dominant color */}
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background: `linear-gradient(135deg, ${bgColor}20, ${darkerBg}80)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex items-center py-20">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">
                {/* Poster Section */}
                <div className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-start">
                  <div className="relative group">
                    <div
                      className="relative w-72 h-[432px] md:w-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500 border-1"
                      style={{ borderColor: lighterBg }}
                    >
                      <img
                        src={`${imageBaseUrl}${movie.poster_path}`}
                        className="object-cover w-full h-full"
                        alt={movie.title}
                        sizes="(max-width: 768px) 288px, 320px"
                      />
                    </div>
                    {/* Hover Effects */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to top, ${bgColor}DD, transparent)`,
                      }}
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={toggleLike}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 border transform hover:scale-110 ${
                          isLiked
                            ? "bg-red-500 border-red-500 text-white"
                            : "bg-black/50 border-white/30 text-white hover:bg-red-500"
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
                  <div
                    className="rounded-3xl p-6 md:p-8 lg:p-10 border shadow-2xl backdrop-blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${bgColor}15, ${darkerBg}30)`,
                      borderColor: lighterBg,
                    }}
                  >
                    {/* Header with Enhanced Badges */}
                    <div className="mb-6 md:mb-8">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div
                          className="flex items-center gap-2 backdrop-blur-sm border px-3 py-1.5 rounded-full"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            borderColor: accentColor,
                            color: getContrastColor(accentColor),
                          }}
                        >
                          <Star
                            size={16}
                            style={{ color: accentColor }}
                            fill="currentColor"
                          />
                          <span className="font-bold text-sm text-white">
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

                      <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-3 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
                        style={{ textShadow: `0 4px 20px ${bgColor}80` }}
                      >
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

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8">
                      {[
                        {
                          icon: Users,
                          label: "Votes",
                          value: movie.vote_count?.toLocaleString(),
                          color: "blue-400",
                        },
                        {
                          icon: Award,
                          label: "Rating",
                          value: `${movie.vote_average?.toFixed(1)}/10`,
                          color: "green-400",
                        },
                        {
                          icon: Clock,
                          label: "Runtime",
                          value: formatRuntime(movie.runtime),
                          color: "purple-400",
                        },
                        {
                          icon: DollarSign,
                          label: "Budget",
                          value: formatCurrency(movie.budget),
                          color: "orange-400",
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="rounded-2xl p-4 border backdrop-blur-sm hover:scale-105 transition-all duration-300 group"
                          style={{
                            background: `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                            borderColor: lighterBg,
                          }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <stat.icon
                              size={16}
                              style={{ color: accentColor }}
                            />
                            <span className="text-white text-sm font-medium">
                              {stat.label}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-white w-full truncate">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
                      {/* Watch Trailer Button */}
                      <div className="w-full sm:w-auto">
                        <button
                          onClick={openTrailer}
                          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto group"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor}, ${getDarkerShade(
                              accentColor,
                              20
                            )})`,
                            color: textColor,
                          }}
                        >
                          <Play
                            size={20}
                            className="flex-shrink-0 group-hover:scale-110 transition-transform"
                          />
                          <span>Watch Trailer</span>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                        <button
                          onClick={toggleBookmark}
                          className={`flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-2xl transition-all duration-300 border transform hover:scale-110 flex-1 sm:flex-none ${
                            isBookmarked
                              ? "text-yellow-400 border-yellow-400"
                              : "text-white border-white/20 hover:border-yellow-400 hover:text-yellow-400"
                          }`}
                          style={{
                            background: isBookmarked
                              ? `${accentColor}20`
                              : `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                          }}
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
                          className="flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-2xl transition-all duration-300 border transform hover:scale-110 flex-1 sm:flex-none"
                          style={{
                            background: `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                            borderColor: lighterBg,
                            color: "white",
                          }}
                        >
                          <Download size={20} />
                        </button>

                        <DropdownMenu
                          open={showShareDropdown}
                          onOpenChange={setShowShareDropdown}
                        >
                          <DropdownMenuTrigger asChild>
                            <button
                              className="flex items-center justify-center w-12 h-12 backdrop-blur-sm rounded-2xl transition-all duration-300 border transform hover:scale-110 flex-1 sm:flex-none"
                              style={{
                                background: `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                                borderColor: lighterBg,
                                color: "white",
                              }}
                            >
                              {copySuccess ? (
                                <Check size={20} />
                              ) : (
                                <Share2 size={20} />
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="rounded-xl backdrop-blur-sm border"
                            style={{
                              background: `linear-gradient(135deg, ${darkerBg}, ${bgColor}30)`,
                              borderColor: lighterBg,
                            }}
                          >
                            <DropdownMenuItem
                              onClick={() => shareMovie("copy")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer rounded-lg"
                            >
                              <Link size={16} />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("twitter")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer rounded-lg"
                            >
                              <Twitter size={16} />
                              Share on Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("facebook")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer rounded-lg"
                            >
                              <Facebook size={16} />
                              Share on Facebook
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => shareMovie("whatsapp")}
                              className="flex items-center gap-3 text-white hover:bg-gray-700 cursor-pointer rounded-lg"
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
                        <p
                          className="text-xl md:text-2xl italic text-center md:text-left font-light"
                          style={{ color: accentColor }}
                        >
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
          {/* Enhanced Watch Providers Section */}
          {Object.keys(watchProviders).length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Ticket size={32} className="text-blue-400" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      Where to Watch
                    </h2>
                  </div>
                  <div className="text-sm text-gray-400">
                    Click on any provider to watch
                  </div>
                </div>

                <div
                  className="rounded-3xl p-6 backdrop-blur-sm border"
                  style={{
                    background: `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                    borderColor: lighterBg,
                  }}
                >
                  {/* Enhanced Provider Type Tabs */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {Object.keys(watchProviders)
                      .filter(
                        (type) =>
                          watchProviders[type] &&
                          Array.isArray(watchProviders[type]) &&
                          watchProviders[type].length > 0
                      )
                      .map((type) => {
                        const ProviderIcon = getProviderTypeIcon(type);
                        return (
                          <button
                            key={type}
                            onClick={() => setActiveProviderTab(type)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                              activeProviderTab === type
                                ? "text-black shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                            style={{
                              background:
                                activeProviderTab === type
                                  ? `linear-gradient(135deg, ${accentColor}, ${getDarkerShade(
                                      accentColor,
                                      20
                                    )})`
                                  : `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                            }}
                          >
                            <ProviderIcon size={18} />
                            <span>{getProviderTypeName(type)}</span>
                            <span className="text-xs opacity-80 ml-1">
                              ({watchProviders[type].length})
                            </span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Enhanced Providers Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {watchProviders[activeProviderTab] &&
                      Array.isArray(watchProviders[activeProviderTab]) &&
                      watchProviders[activeProviderTab].map((provider) => (
                        <button
                          key={provider.provider_id}
                          onClick={() =>
                            handleProviderClick(provider, activeProviderTab)
                          }
                          className="flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 group cursor-pointer border-2 border-transparent hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                          style={{
                            background: `linear-gradient(135deg, ${bgColor}15, ${darkerBg}25)`,
                          }}
                        >
                          {provider.logo_path ? (
                            <div className="relative mb-3">
                              <img
                                src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="w-16 h-16 rounded-xl object-cover group-hover:shadow-lg transition-shadow"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div
                                className="hidden w-16 h-16 rounded-xl bg-gray-700 items-center justify-center"
                                style={{ backgroundColor: `${accentColor}20` }}
                              >
                                <MonitorPlay
                                  size={24}
                                  className="text-gray-400"
                                />
                              </div>
                            </div>
                          ) : (
                            <div
                              className="w-16 h-16 rounded-xl mb-3 flex items-center justify-center"
                              style={{ backgroundColor: `${accentColor}20` }}
                            >
                              <MonitorPlay
                                size={24}
                                className="text-gray-400"
                              />
                            </div>
                          )}

                          <span className="text-white text-sm font-medium text-center group-hover:text-accent transition-colors">
                            {provider.provider_name}
                          </span>

                          {/* Hover indicator */}
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={14} className="text-accent" />
                          </div>
                        </button>
                      ))}
                  </div>

                  {/* Enhanced Empty State */}
                  {(!watchProviders[activeProviderTab] ||
                    !Array.isArray(watchProviders[activeProviderTab]) ||
                    watchProviders[activeProviderTab].length === 0) && (
                    <div className="text-center py-12">
                      <MonitorPlay
                        size={48}
                        className="text-gray-500 mx-auto mb-4"
                      />
                      <p className="text-gray-400 text-lg mb-2">
                        No {getProviderTypeName(activeProviderTab)} options
                        available
                      </p>
                      <p className="text-gray-500 text-sm">
                        Try checking other streaming options
                      </p>
                    </div>
                  )}

                  {/* Provider Count Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-gray-400 text-sm text-center">
                      Found {Object.values(watchProviders).flat().length} total
                      streaming options across{" "}
                      {Object.keys(watchProviders).length} categories
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Collection Section */}
          {collection && (
            <section className="py-16 bg-gray-800/30">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {collection.name}
                  </h2>
                  <Film size={24} className="text-gray-400" />
                </div>
                <div
                  className="rounded-3xl overflow-hidden border backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${bgColor}10, ${darkerBg}20)`,
                    borderColor: lighterBg,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div className="md:col-span-1">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                        alt={collection.name}
                        className="w-full rounded-2xl shadow-2xl"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {collection.name}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {collection.overview ||
                          `Explore the entire ${
                            collection.name
                          } collection featuring ${
                            collection.parts?.length || 0
                          } movies.`}
                      </p>
                      <div className="flex flex-wrap gap-3 ">
                        {collection.parts?.slice(0, 4).map((part) => (
                          <div
                            key={part.id}
                            onClick={() => handleClick(part.id)}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, ${bgColor}20, ${darkerBg}30)`,
                              border: `1px solid ${lighterBg}`,
                            }}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${part.poster_path}`}
                              alt={part.title}
                              className="w-8 h-12 rounded object-cover"
                            />
                            <span className="text-white text-sm font-medium">
                              {part.title}
                            </span>
                          </div>
                        ))}
                        {collection.parts?.length > 4 && (
                          <div
                            className="px-4 py-2 rounded-xl text-white font-medium cursor-pointer hover:scale-105 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}40)`,
                              border: `1px solid ${accentColor}`,
                            }}
                          >
                            +{collection.parts.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

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
          <div
            className="flex items-center gap-2 backdrop-blur-lg rounded-2xl px-4 py-3 border shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${bgColor}30, ${darkerBg}50)`,
              borderColor: lighterBg,
            }}
          >
            <button
              onClick={openTrailer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold flex-1 text-white"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${getDarkerShade(
                  accentColor,
                  20
                )})`,
              }}
            >
              <Play size={16} />
              Trailer
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-xl transition-colors transform hover:scale-110 ${
                isBookmarked
                  ? "text-yellow-400"
                  : "text-white hover:text-yellow-400"
              }`}
            >
              <Bookmark
                size={16}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => shareMovie("copy")}
              className="p-2 text-white hover:text-gray-300 rounded-xl transition-colors transform hover:scale-110"
            >
              {copySuccess ? <Check size={16} /> : <Share2 size={16} />}
            </button>
          </div>
        </div>
      </main>

      {/* Trailer Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh] bg-black">
          <DrawerHeader className="text-center ">
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
