import axios from 'axios';

const OMDB_API_KEY = 'a9118a3a';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}&type=movie`);
    if (response.data.Response === 'True') {
      return response.data.Search;
    }
    return [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}?i=${id}&apikey=${OMDB_API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};
