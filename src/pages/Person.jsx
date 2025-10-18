import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import CarouselCard from "../components/CarouselCard";
import {
  Calendar,
  MapPin,
  Star,
  Users,
  Film,
  Award,
  Heart,
  Play,
  ExternalLink,
} from "lucide-react";
import Loader from "../components/Loader";

const Person = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movieCredits, setMovieCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const [creditsLoading, setCreditsLoading] = useState(false);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch person details
        const personResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`
        );

        if (!personResponse.ok) {
          throw new Error(`Failed to fetch person: ${personResponse.status}`);
        }

        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch movie credits
        setCreditsLoading(true);
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`
        );

        if (!creditsResponse.ok) {
          throw new Error(
            `Failed to fetch movie credits: ${creditsResponse.status}`
          );
        }

        const creditsData = await creditsResponse.json();
        setMovieCredits(creditsData);
      } catch (error) {
        console.error("Error fetching person data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
        setCreditsLoading(false);
      }
    };

    if (id) {
      fetchPersonData();
    }
  }, [id, apiKey]);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age
  const calculateAge = (birthday, deathday) => {
    if (!birthday) return "Unknown";

    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Sort movies by release date (newest first)
  const sortMoviesByDate = (movies) => {
    return (
      movies?.sort((a, b) => {
        const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
        const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
        return dateB - dateA;
      }) || []
    );
  };

  // Get unique movies (remove duplicates by ID)
  const getUniqueMovies = (movies) => {
    const seen = new Set();
    return (
      movies?.filter((movie) => {
        if (seen.has(movie.id)) return false;
        seen.add(movie.id);
        return true;
      }) || []
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
          <p className="text-xl text-gray-300">No person data found.</p>
        </div>
      </div>
    );
  }

  const sortedCast = sortMoviesByDate(movieCredits?.cast);
  const sortedCrew = sortMoviesByDate(movieCredits?.crew);
  const uniqueCrew = getUniqueMovies(sortedCrew);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Person Header */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 mb-8">
          <div className="md:flex">
            {/* Profile Image */}
            <div className="md:flex-shrink-0 relative group">
              {person.profile_path ? (
                <div className="relative">
                  <img
                    className="h-96 w-full md:w-80 object-cover"
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-person.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="h-96 w-full md:w-80 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {/* Popularity Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-400/30">
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-semibold">
                    {person.popularity?.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Person Details */}
            <div className="p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-4xl lg:text-5xl font-black text-white">
                  {person.name}
                </h1>
                <button className="p-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Known For</p>
                      <p className="text-white font-semibold">
                        {person.known_for_department}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Gender</p>
                      <p className="text-white font-semibold">
                        {person.gender === 1
                          ? "Female"
                          : person.gender === 2
                          ? "Male"
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Birthday</p>
                      <p className="text-white font-semibold">
                        {formatDate(person.birthday)}
                      </p>
                      {person.birthday && (
                        <p className="text-xs text-gray-400 mt-1">
                          {calculateAge(person.birthday, person.deathday)} years
                          old
                          {person.deathday && " • Deceased"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {person.deathday && (
                  <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-400/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Date of Death</p>
                        <p className="text-white font-semibold">
                          {formatDate(person.deathday)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Place of Birth</p>
                      <p className="text-white font-semibold">
                        {person.place_of_birth || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography */}
              {person.biography && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Film className="w-6 h-6 text-yellow-400" />
                    Biography
                  </h2>
                  <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50">
                    <p className="text-gray-200 leading-relaxed text-lg">
                      {showFullBio
                        ? person.biography
                        : person.biography.length > 400
                        ? `${person.biography.substring(0, 400)}...`
                        : person.biography}
                    </p>
                    {person.biography.length > 400 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="mt-4 px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 font-semibold"
                      >
                        {showFullBio ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Also Known As */}
              {person.also_known_as && person.also_known_as.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-400 mb-3">
                    Also Known As
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {person.also_known_as.map((name, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-700/50 text-gray-200 rounded-xl text-sm border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movie Credits */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <Film className="w-8 h-8 text-yellow-400" />
              Filmography
            </h2>
            {creditsLoading && (
              <div className="flex items-center text-gray-400">
                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading credits...
              </div>
            )}
          </div>

          {/* Acting Roles */}
          {sortedCast && sortedCast.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-200">
                  Acting Roles{" "}
                  <span className="text-yellow-400">({sortedCast.length})</span>
                </h3>
              </div>

              <CarouselCard movies={sortedCast} />

              {sortedCast.length > 8 && (
                <div className="text-center mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
                    View All {sortedCast.length} Acting Roles
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Crew Roles */}
          {uniqueCrew && uniqueCrew.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-200">
                  Crew Roles{" "}
                  <span className="text-yellow-400">({uniqueCrew.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {uniqueCrew.slice(0, 8).map((movie) => (
                  <div
                    key={`${movie.id}-${movie.job}`}
                    className="group bg-gray-700/30 backdrop-blur-sm border border-gray-600/50 rounded-2xl p-4 hover:bg-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "/placeholder-movie.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center rounded-xl">
                          <Film className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                          <ExternalLink className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                      {movie.title}
                    </h4>
                    <p className="text-yellow-400 text-sm font-semibold mb-2 line-clamp-1">
                      {movie.job}
                    </p>
                    <div className="flex justify-between items-center text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : "TBA"}
                      </span>
                      {movie.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {uniqueCrew.length > 8 && (
                <div className="text-center mt-6">
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
                    View All {uniqueCrew.length} Crew Roles
                  </button>
                </div>
              )}
            </div>
          )}

          {!movieCredits?.cast?.length &&
            !movieCredits?.crew?.length &&
            !creditsLoading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No movie credits found.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Person;
