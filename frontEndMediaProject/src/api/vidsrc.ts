import axios from 'axios';

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log('Key:', import.meta.env.VITE_TMDB_API_KEY);
console.log('TMDB_API_KEY value:', TMDB_API_KEY); 
console.log('Is it undefined?', TMDB_API_KEY === undefined); 
// TMDB API
export const getTrendingMovies = async () => {
  const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data.results;
};

export const searchMovies = async (query: string) => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query: query
    }
  });
  return response.data.results;
};

export const getMovieDetails = async (movieId: number) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
    params: {
      api_key: TMDB_API_KEY,
      append_to_response: 'videos,watch/providers'
    }
  });
  return response.data;
};

export const getWatchProviders = async (movieId: number) => {
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data.results?.US || null;
};