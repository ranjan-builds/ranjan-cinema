// src/contexts/MovieContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export const MovieProvider = ({ children }) => {
  const [moviesData, setMoviesData] = useState({
    sciFi: [],
    telugu: [],
    hindi: [],
    trending: [],
    nowPlaying: [],
    upcoming: [],
    topRated: [],
    action: [],
    comedy: []
  });
  
  const [loading, setLoading] = useState({
    sciFi: true,
    telugu: true,
    hindi: true,
    trending: true,
    nowPlaying: true,
    upcoming: true,
    topRated: true,
    action: true,
    comedy: true
  });
  
  const [hasFetched, setHasFetched] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const fetchMovies = async () => {
    // Don't fetch if already fetched
    if (hasFetched && isInitialized) {
      console.log('Movies already fetched, using cached data');
      return;
    }

    console.log('Fetching movies...');
    setHasFetched(true);

    try {
      const endpoints = [
        {
          key: 'nowPlaying',
          url: `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&region=IN&page=1`
        },
        {
          key: 'trending',
          url: `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&region=IN&page=1`
        },
        {
          key: 'upcoming',
          url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&region=IN&page=1`
        },
        {
          key: 'topRated',
          url: `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&page=1`
        },
        {
          key: 'sciFi',
          url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=878&sort_by=revenue.desc&page=1`
        },
        {
          key: 'action',
          url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=28&sort_by=popularity.desc&page=1`
        },
        {
          key: 'comedy',
          url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35&sort_by=popularity.desc&page=1`
        },
        {
          key: 'hindi',
          url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=hi&sort_by=popularity.desc&page=1`
        },
        {
          key: 'telugu',
          url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_original_language=te&sort_by=revenue.desc&page=1`
        }
      ];

      // Create promises for all endpoints
      const promises = endpoints.map(async ({ key, url }) => {
        try {
          console.log(`Fetching ${key} movies...`);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(`Fetched ${key}:`, data.results?.length || 0, 'movies');
          return { key, data: data.results || [], error: null };
        } catch (error) {
          console.error(`Error fetching ${key} movies:`, error);
          return { key, data: [], error: error.message };
        }
      });

      const results = await Promise.all(promises);
      
      // Update movies data
      const newMoviesData = { ...moviesData };
      const newLoading = { ...loading };
      
      results.forEach(({ key, data, error }) => {
        newMoviesData[key] = data;
        newLoading[key] = false;
      });

      setMoviesData(newMoviesData);
      setLoading(newLoading);
      setIsInitialized(true);
      
      console.log('All movies fetched successfully');
      console.log('Final loading states:', newLoading);

    } catch (error) {
      console.error('Error in fetchMovies:', error);
      // Set all loading to false on error
      const errorLoading = Object.keys(loading).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      setLoading(errorLoading);
      setIsInitialized(true);
    }
  };

  const refreshMovies = () => {
    console.log('Refreshing movies...');
    setHasFetched(false);
    setIsInitialized(false);
    // Reset loading states
    const resetLoading = Object.keys(loading).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setLoading(resetLoading);
    // Clear existing data
    setMoviesData({
      sciFi: [],
      telugu: [],
      hindi: [],
      trending: [],
      nowPlaying: [],
      upcoming: [],
      topRated: [],
      action: [],
      comedy: []
    });
    
    // Trigger new fetch
    setTimeout(() => {
      fetchMovies();
    }, 100);
  };

  useEffect(() => {
    if (!isInitialized) {
      fetchMovies();
    }
  }, [isInitialized]);

  const value = {
    moviesData,
    loading,
    hasFetched,
    isInitialized,
    refreshMovies,
    fetchMovies
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};