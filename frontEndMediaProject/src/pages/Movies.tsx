import { useState, useEffect } from 'react';
import { getTrendingMovies, searchMovies, getMovieDetails } from '../api/vidsrc';
import MovieDetailsModal from '../components/MovieDetailsModal';
import MoviePlayer from '../components/MoviePlayer';
import '../movies.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [playingMovie, setPlayingMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!showFavorites) {
      setLoading(true);
      getTrendingMovies()
        .then((data) => {
          setMovies(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching movies:', err);
          setLoading(false);
        });
    }
  }, [showFavorites]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setShowFavorites(false);
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowFavorites(false);
    setLoading(true);
    getTrendingMovies().then(setMovies).finally(() => setLoading(false));
  };

  const addToFavorites = (movie: any) => {
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
      newFavorites = [...favorites, movie];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const handlePlayMovie = async (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    const details = await getMovieDetails(movieId);
    setPlayingMovie(details);
  };

  const displayedMovies = showFavorites ? favorites : movies;

  if (playingMovie) {
    return (
      <MoviePlayer
        tmdbId={playingMovie.id.toString()}
        type="movie"
        onClose={() => setPlayingMovie(null)}
      />
    );
  }

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movies-container">
      <h1>Movie Explorer</h1>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
        {searchQuery && (
          <button type="button" onClick={clearSearch}>Clear</button>
        )}
      </form>

      <div className="view-toggle">
        <button 
          className={!showFavorites ? 'active' : ''}
          onClick={() => setShowFavorites(false)}
        >
          Trending This Week
        </button>
        <button 
          className={showFavorites ? 'active' : ''}
          onClick={() => setShowFavorites(true)}
        >
          My Favorites ({favorites.length})
        </button>
      </div>

      <div className="movies-grid">
        {displayedMovies.length === 0 ? (
          <p className="no-movies">
            {showFavorites ? 'No favorites yet!' : 'No movies found'}
          </p>
        ) : (
          displayedMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => setSelectedMovieId(movie.id)}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
              />
              <button 
                className="play-button"
                onClick={(e) => handlePlayMovie(e, movie.id)}
              >
                ▶ Play
              </button>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className="movie-year">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </span>
                <span className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          onAddToFavorites={addToFavorites}
          isFavorite={favorites.some(fav => fav.id === selectedMovieId)}
        />
      )}
    </div>
  );
}

export default Movies;