// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Popcorn, 
  Film, 
  Heart, 
  Github, 
  Twitter, 
  Facebook, 
  Instagram,
  Mail,
  ExternalLink,
  Star
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Trending", path: "/trending" },
    { name: "Upcoming", path: "/upcoming" },
  ];

  const supportLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-4">
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
              
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
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

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Film className="w-5 h-5 text-yellow-400" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-yellow-400 transition-all duration-300 flex items-center gap-2 group text-sm"
                    >
                      <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-yellow-400 transition-all duration-300 flex items-center gap-2 group text-sm"
                    >
                      <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to get notified about new features and movie updates.
              </p>
              
              {/* Newsletter Form */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 text-sm">
                    Join
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  No spam, unsubscribe at any time.
                </p>
              </div>

              {/* TMDB Attribution */}
              <div className="pt-4 border-t border-gray-800/50">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  Powered by{" "}
                  <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-1"
                  >
                    TMDB
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
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
              <span>Data provided by TMDB</span>
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