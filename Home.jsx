import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [hollywoodMovies, setHollywoodMovies] = useState([]);
  const [bollywoodMovies, setBollywoodMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('search');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        if (query) {
          const results = await searchMovies(query);
          setSearchResults(results || []);
        } else {
          // Fetch default lists
          const hollywood = await searchMovies('Avengers');
          const bollywood = await searchMovies('Khan');
          
          setHollywoodMovies(hollywood || []);
          setBollywoodMovies(bollywood || []);
        }
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded text-center">
          {error}
        </div>
      </div>
    );
  }

  const renderMovieGrid = (movies, title) => {
    if (!movies || movies.length === 0) {
      return (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-red-500">{title}</h2>
          <p className="text-gray-400">No movies found.</p>
        </div>
      );
    }

    return (
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-red-500">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        renderMovieGrid(searchResults, `Search Results for "${query}"`)
      ) : (
        <>
          {renderMovieGrid(hollywoodMovies, "Popular Hollywood")}
          {renderMovieGrid(bollywoodMovies, "Popular Bollywood")}
        </>
      )}
    </div>
  );
};

export default Home;
