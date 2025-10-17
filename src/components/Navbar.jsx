// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  Bookmark,
  Menu,
  X,
  Popcorn,
  Globe,
  Star,
} from "lucide-react";
import SearchMovies from "./SearchMovies";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedMoviesCount, setSavedMoviesCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get saved movies count from localStorage
  useEffect(() => {
    const updateSavedMoviesCount = () => {
      const saved = JSON.parse(localStorage.getItem("savedMovies") || "[]");
      setSavedMoviesCount(saved.length);
    };

    updateSavedMoviesCount();
    window.addEventListener("storage", updateSavedMoviesCount);

    // Custom event for when movies are saved/unsaved
    window.addEventListener("savedMoviesUpdated", updateSavedMoviesCount);

    return () => {
      window.removeEventListener("storage", updateSavedMoviesCount);
      window.removeEventListener("savedMoviesUpdated", updateSavedMoviesCount);
    };
  }, []);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/discover", label: "Discover", icon: Globe },
    { path: "/about", label: "About", icon: Info },
  ];

  const handleBookmarkClick = () => {
    navigate("/savedmovies");
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${
          isScrolled
            ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-gray-700/50"
            : "bg-gradient-to-b from-gray-900/90 to-transparent backdrop-blur-sm"
        }
      `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/20">
                  <Popcorn className="w-6 h-6 text-gray-900" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 fill-white text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  CineVerse
                </span>
                <span className="text-xs text-gray-400 -mt-1 hidden sm:block">
                  Your Movie Universe
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 group
                      ${
                        isActive
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1  rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Search & Bookmarks */}
            <div className="flex items-center gap-4">
              {/* Search Component */}
              <div className="hidden sm:block">
                <SearchMovies />
              </div>

              {/* Saved Movies Button */}
              <button
                onClick={handleBookmarkClick}
                className="relative p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-yellow-400/30 transition-all duration-300 group hidden lg:block"
                title="Saved Movies"
              >
                <Bookmark
                  className={`
                  w-5 h-5 transition-all duration-300
                  ${
                    isActiveLink("/savedmovies")
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-gray-400 group-hover:text-yellow-400 group-hover:scale-110"
                  }
                `}
                />

                {/* Notification Badge */}
                {savedMoviesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {savedMoviesCount > 9 ? "9+" : savedMoviesCount}
                  </span>
                )}
              </button>
              <div className="block lg:hidden">
                <SearchMovies className="bg-transparent" />
              </div>

              {/* Mobile Menu Button */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-transparent border rounded-xl border-gray-600/50 block lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-300" />
                )}
              </Button>
         
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50
          transition-all duration-500 overflow-hidden
          ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Search */}

            {/* Mobile Navigation Items */}
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-400/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Saved Movies Mobile Link */}
              <button
                onClick={() => {
                  navigate("/savedmovies");
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-left
                  ${
                    isActiveLink("/savedmovies")
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-400/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Bookmark
                  className={`
                  w-5 h-5
                  ${isActiveLink("/saved-movies") && "fill-yellow-400"}
                `}
                />
                <span>Saved Movies</span>
                {savedMoviesCount > 0 && (
                  <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {savedMoviesCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
