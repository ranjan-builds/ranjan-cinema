// src/components/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Rocket, 
  Film, 
  Globe, 
  Sparkles,
  Play,
  Star,
  Users,
  Calendar,
  Award,
  Theater,
  RefreshCw
} from "lucide-react";
import CarouselCard from "../components/CarouselCard";
import { useMovieContext } from "../contexts/MovieContext";

const Home = () => {
  const navigate = useNavigate();
  const { moviesData, loading, hasFetched, isInitialized, refreshMovies } = useMovieContext();

  // Debug: Log the context data
  useEffect(() => {
    console.log('=== HOME COMPONENT DEBUG ===');
    console.log('isInitialized:', isInitialized);
    console.log('hasFetched:', hasFetched);
    console.log('loading states:', loading);
    console.log('movies counts:', Object.keys(moviesData).map(key => ({
      key,
      count: moviesData[key]?.length || 0
    })));
  }, [moviesData, loading, hasFetched, isInitialized]);

  const categoryConfigs = [
    {
      key: "nowPlaying",
      name: "Now Playing in Theaters",
      icon: <Theater className="w-6 h-6" />,
      description: "Currently running in theaters near you",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      exploreParams: { type: 'now_playing' }
    },
    {
      key: "trending",
      name: "Trending Now",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "What everyone is watching this week in India",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      exploreParams: { type: 'trending' }
    },
    {
      key: "upcoming",
      name: "Coming Soon",
      icon: <Calendar className="w-6 h-6" />,
      description: "Highly anticipated upcoming releases",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      exploreParams: { type: 'upcoming' }
    },
    {
      key: "topRated",
      name: "Top Rated Movies",
      icon: <Award className="w-6 h-6" />,
      description: "Highest rated movies of all time",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-500/10 to-indigo-500/10",
      exploreParams: { type: 'top_rated' }
    },
    {
      key: "sciFi",
      name: "Top Sci-Fi Movies",
      icon: <Rocket className="w-6 h-6" />,
      description: "Explore the universe with epic science fiction adventures",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      exploreParams: { genre: 878, sortBy: 'revenue.desc' }
    },
    {
      key: "action",
      name: "Action & Adventure",
      icon: <Sparkles className="w-6 h-6" />,
      description: "Heart-pounding action and thrilling adventures",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/10 to-red-500/10",
      exploreParams: { genre: 28, sortBy: 'popularity.desc' }
    },
    {
      key: "comedy",
      name: "Laugh Out Loud",
      icon: <Users className="w-6 h-6" />,
      description: "Hilarious comedies to brighten your day",
      gradient: "from-yellow-400 to-amber-500",
      bgGradient: "from-yellow-400/10 to-amber-500/10",
      exploreParams: { genre: 35, sortBy: 'popularity.desc' }
    },
    {
      key: "hindi",
      name: "Top Hindi Movies",
      icon: <Film className="w-6 h-6" />,
      description: "Bollywood's most popular and acclaimed films",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10",
      exploreParams: { language: 'hi', sortBy: 'popularity.desc' }
    },
    {
      key: "telugu",
      name: "South Indian Cinema",
      icon: <Globe className="w-6 h-6" />,
      description: "Finest films from Telugu and South Indian cinema",
      gradient: "from-teal-500 to-blue-500",
      bgGradient: "from-teal-500/10 to-blue-500/10",
      exploreParams: { language: 'te', sortBy: 'revenue.desc' }
    }
  ];

  // Handle explore navigation
  const handleExploreCategory = (category) => {
    const params = new URLSearchParams(category.exploreParams).toString();
    navigate(`/explore?${params}`);
  };

  // Handle general explore navigation
  const handleExploreAll = () => {
    navigate('/explore');
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refreshMovies();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex space-x-4 overflow-hidden py-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-48 bg-gray-800/50 rounded-2xl animate-pulse border border-gray-700/50"
        >
          <div className="w-full h-72 bg-gray-700 rounded-2xl"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Check if all categories are loaded
  const allLoaded = Object.values(loading).every(status => !status);
  
  // Check if any movies are available
  const hasMovies = categoryConfigs.some(category => moviesData[category.key]?.length > 0);

  console.log('Home Render - allLoaded:', allLoaded, 'hasMovies:', hasMovies, 'isInitialized:', isInitialized);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
    

      {/* Movie Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Debug Info */}
      

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg mb-6">
              <Sparkles className="w-6 h-6" />
              Welcome to CineVerse
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your Ultimate <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Movie Destination</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover, explore, and save your favorite movies across all genres and languages
            </p>
          </div>

          {/* Show loading overlay only when NOT initialized */}
          {!isInitialized && (
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 text-lg">Loading cinematic experience...</p>
              </div>
            </div>
          )}

          {/* Show content only when initialized */}
          {isInitialized && (
            <>
              {/* Quick Stats */}
              {hasMovies && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/50">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {categoryConfigs.reduce((total, cat) => total + (moviesData[cat.key]?.length || 0), 0)}+
                    </div>
                    <div className="text-gray-400 text-sm">Movies Loaded</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/50">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {categoryConfigs.length}
                    </div>
                    <div className="text-gray-400 text-sm">Categories</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/50">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {categoryConfigs.filter(cat => moviesData[cat.key]?.length > 0).length}
                    </div>
                    <div className="text-gray-400 text-sm">Active Sections</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-4 text-center border border-gray-700/50">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {hasFetched ? "Cached" : "Live"}
                    </div>
                    <div className="text-gray-400 text-sm">Data Status</div>
                  </div>
                </div>
              )}

              {/* Movie Sections */}
              {categoryConfigs.map((category, index) => {
                const categoryMovies = moviesData[category.key] || [];
                const categoryLoading = loading[category.key];
                
                return (
                  <div key={category.key} className="mb-16">
                    {/* Only show section if it has movies or we're still loading */}
                    {(categoryMovies.length > 0 || categoryLoading) && (
                      <>
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                              {category.icon}
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-white">
                                {category.name}
                              </h2>
                              <p className="text-gray-400 mt-1">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          {!categoryLoading && categoryMovies.length > 0 && (
                            <div className="hidden md:flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20">
                              <Star className="w-5 h-5 fill-current" />
                              <span className="font-semibold">
                                {categoryMovies.length} movies
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Movies Content */}
                        <div className={`bg-gradient-to-br ${category.bgGradient} rounded-3xl p-6 border border-gray-700/50 backdrop-blur-sm`}>
                          {categoryLoading ? (
                            <LoadingSkeleton />
                          ) : categoryMovies.length > 0 ? (
                            <>
                              <CarouselCard movies={categoryMovies} />
                              
                              {/* View All Button */}
                              <div className="text-center mt-8">
                                <button 
                                  onClick={() => handleExploreCategory(category)}
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-yellow-400/30 rounded-xl transition-all duration-300 transform hover:scale-105 group"
                                >
                                  <span>Explore {category.name}</span>
                                  <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-12 text-gray-400">
                              No movies found in this category
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* No Movies State */}
              {!hasMovies && allLoaded && (
                <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-700/50">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-600/50">
                    <Film className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    No Movies Available
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    We couldn't load any movies. This might be a temporary issue.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-2xl hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <RefreshCw className="w-6 h-6" />
                    Try Again
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;