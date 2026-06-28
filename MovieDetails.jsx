import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import { getMovieDetails } from '../api';
import { ArrowLeft, Play, X } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        if (data) {
          setMovie(data);
          // Try to get trailer
          movieTrailer(data.Title, { year: data.Year, id: true })
            .then((response) => {
              if (response) {
                setTrailerUrl(response);
              } else {
                setTrailerError(true);
              }
            })
            .catch(() => setTrailerError(true));
        } else {
          setError('Movie details not found.');
        }
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
          {error || 'Movie not found'}
        </div>
        <Link to="/" className="text-red-500 hover:text-red-400 font-medium">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handlePlayTrailer = () => {
    if (trailerUrl) {
      setShowTrailer(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span>Back</span>
      </Link>

      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img 
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster'} 
            alt={movie.Title} 
            className="w-full h-auto object-cover md:h-full"
          />
        </div>
        
        <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {movie.Title} <span className="text-gray-400 text-2xl md:text-3xl font-normal">({movie.Year})</span>
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-500 text-black font-bold px-2 py-1 rounded text-sm">
                  IMDb {movie.imdbRating}
                </span>
                <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm uppercase">
                  {movie.Rated}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.Genre.split(', ').map(genre => (
                <span key={genre} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
              <span className="text-gray-400 text-sm py-1 ml-2">{movie.Runtime}</span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
              "{movie.Plot !== 'N/A' ? movie.Plot : 'No plot available.'}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-gray-400 font-medium mb-1">Director</h3>
                <p className="text-white">{movie.Director}</p>
              </div>
              <div>
                <h3 className="text-gray-400 font-medium mb-1">Writer</h3>
                <p className="text-white">{movie.Writer}</p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-gray-400 font-medium mb-1">Actors</h3>
                <p className="text-white">{movie.Actors}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={handlePlayTrailer}
              disabled={!trailerUrl && trailerError}
              className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3 rounded-lg font-bold transition-all ${
                trailerUrl 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Play size={20} fill="currentColor" />
              <span>{trailerUrl ? 'Watch Trailer' : 'Trailer Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="w-full max-w-5xl aspect-video bg-black relative rounded-lg overflow-hidden shadow-2xl">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-red-500 z-50 mb-2 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="w-full h-full pt-10">
              <YouTube videoId={trailerUrl} opts={opts} className="w-full h-full" iframeClassName="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
