// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Popcorn, 
  Github, 
  Twitter, 
  Facebook, 
  Instagram,
  Star
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: "GitHub", 
      icon: Github, 
      url: "https://github.com",
      color: "hover:text-gray-300"
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      url: "https://twitter.com",
      color: "hover:text-blue-400"
    },
    { 
      name: "Facebook", 
      icon: Facebook, 
      url: "https://facebook.com",
      color: "hover:text-blue-500"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://instagram.com",
      color: "hover:text-pink-500"
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50 backdrop-blur-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/20">
                    <Popcorn className="w-6 h-6 text-gray-900" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 fill-white text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    CineVerse
                  </span>
                  <span className="text-xs text-gray-400 -mt-1">
                    Your Movie Universe
                  </span>
                </div>
              </Link>
              
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Discover, explore, and save your favorite movies. Your ultimate destination for cinematic experiences and movie magic.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-gray-700/50 ${social.color} group`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* TMDB Attribution & Info */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">
                About CineVerse
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                CineVerse is your go-to platform for discovering and exploring movies from around the world. 
                Save your favorites and never miss a great film again.
              </p>
              
              {/* TMDB Attribution */}
              <div className="pt-4">
                <p className="text-xs text-gray-500">
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm mt-2 inline-block"
                >
                  Data provided by The Movie Database (TMDB)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© {currentYear} CineVerse. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block">•</span>
                <span>Made with ❤️ by Ranjan</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>v1.0.0</span>
              <span>•</span>
              <span>100% Open Source</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900 rounded-xl shadow-2xl shadow-yellow-400/25 hover:shadow-yellow-400/40 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <div className="transform rotate-180 group-hover:-translate-y-0.5 transition-transform duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </button>
    </footer>
  );
}