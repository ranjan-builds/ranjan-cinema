import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Heart,
  Coffee,
  Github,
  Mail,
  ExternalLink,
  Film,
  Database,
  Palette,
  Zap,
  Users,
  Globe,
  BookOpen,
  Terminal
} from "lucide-react";

const About = () => {
  const techStack = [
    {
      name: "React",
      description: "Frontend library for building user interfaces",
      icon: "⚛️",
      color: "from-blue-400 to-cyan-400"
    },
    {
      name: "TMDB API",
      description: "The Movie Database API for movie data",
      icon: "🎬",
      color: "from-green-400 to-emerald-400"
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for styling",
      icon: "🎨",
      color: "from-teal-400 to-blue-400"
    },
    {
      name: "React Router",
      description: "Declarative routing for React",
      icon: "🧭",
      color: "from-red-400 to-pink-400"
    },
    {
      name: "Vite",
      description: "Fast build tool and development server",
      icon: "⚡",
      color: "from-purple-400 to-indigo-400"
    },
    {
      name: "Lucide React",
      description: "Beautiful & consistent icons",
      icon: "🎯",
      color: "from-orange-400 to-red-400"
    }
  ];

  const features = [
    {
      icon: <Film className="w-6 h-6" />,
      title: "Movie Discovery",
      description: "Browse through thousands of movies with detailed information, ratings, and reviews."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Real-time Data",
      description: "Powered by TMDB API for up-to-date movie information and trending content."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Modern UI/UX",
      description: "Clean, responsive design with smooth animations and intuitive navigation."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Performance",
      description: "Optimized for speed with efficient rendering and lazy loading capabilities."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personal Collection",
      description: "Save your favorite movies and build your personal watchlist."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Works perfectly on desktop, tablet, and mobile devices."
    }
  ];

  const developerInfo = [
    {
      icon: <Terminal className="w-5 h-5" />,
      label: "Built by",
      value: "ranjan",
      highlight: true
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: "Focus",
      value: "Frontend Development",
      highlight: false
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Learning",
      value: "React & Modern Web",
      highlight: false
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Passion",
      value: "Clean Code & UI/UX",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-6 py-3 rounded-2xl font-bold text-lg mb-6">
            <Code className="w-6 h-6" />
            Developer Project
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Cine<span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Verse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A modern movie discovery platform built with passion for learning React 
            and creating beautiful user experiences.
          </p>
        </div>

        {/* Developer Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Avatar & Basic Info */}
            <div className="text-center lg:text-left">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Code className="w-16 h-16 text-gray-900" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">ranjan</h2>
              <p className="text-gray-400 mb-4">Frontend Developer</p>
              <div className="flex justify-center lg:justify-start gap-3">
                <a
                  href="https://github.com/ranjan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="mailto:ranjan@example.com"
                  className="p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Developer Info */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {developerInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`bg-gray-700/30 backdrop-blur-sm rounded-2xl p-4 border ${
                      info.highlight 
                        ? 'border-yellow-400/30 bg-yellow-400/10' 
                        : 'border-gray-600/50'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        info.highlight ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-600/50 text-gray-400'
                      }`}>
                        {info.icon}
                      </div>
                      <span className="text-sm text-gray-400">{info.label}</span>
                    </div>
                    <p className={`font-semibold ${
                      info.highlight ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">
                This project represents my journey in learning modern web development. 
                Built with React and focused on creating an intuitive movie discovery experience 
                with clean code and responsive design.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Tech <span className="text-yellow-400">Stack</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {tech.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {tech.name}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Project <span className="text-yellow-400">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Purpose */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Built for <span className="text-yellow-400">Learning</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">🎯 Goals</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Master React hooks and modern patterns
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Learn API integration and data management
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Practice responsive design principles
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    Implement smooth animations and interactions
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">🛠️ Skills Practiced</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Component architecture and reusability
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    State management with React hooks
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    API consumption and error handling
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Modern CSS with Tailwind
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Credits & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-400" />
              Data Source
            </h3>
            <p className="text-gray-400 mb-4">
              This project uses The Movie Database (TMDB) API for movie data and images.
            </p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-500/50 rounded-lg transition-all duration-300"
            >
              Visit TMDB
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Github className="w-5 h-5 text-purple-400" />
              Source Code
            </h3>
            <p className="text-gray-400 mb-4">
              Interested in the code? Check out the project repository on GitHub.
            </p>
            <a
              href="https://github.com/ranjan/cineverse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all duration-300"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 text-gray-400 mb-6">
            <Coffee className="w-5 h-5" />
            <span>Made with passion for coding and movies</span>
            <Heart className="w-5 h-5 text-red-400 fill-current" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105"
            >
              <Film className="w-5 h-5" />
              Explore Movies
            </Link>
            <a
              href="mailto:ranjan@example.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-white border border-gray-600/50 hover:border-gray-500 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;