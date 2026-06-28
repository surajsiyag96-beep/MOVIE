import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';

  return (
    <Link to={`/movie/${movie.imdbID}`} className="group block h-full">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-xl h-full flex flex-col">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <img 
            src={posterUrl} 
            alt={movie.Title} 
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white leading-tight mb-1 line-clamp-2" title={movie.Title}>
              {movie.Title}
            </h3>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">{movie.Year}</span>
            <span className="text-xs font-medium px-2 py-1 bg-gray-700 text-gray-300 rounded uppercase">
              {movie.Type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
