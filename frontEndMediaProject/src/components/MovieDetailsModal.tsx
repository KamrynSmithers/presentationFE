import { useState, useEffect } from 'react';
import { getMovieDetails, getWatchProviders } from '../api/vidsrc';
import '../movieModal.css';
import CommentsSection from './CommentSection';

interface MovieDetailsModalProps {
  movieId: number;
  onClose: () => void;
  onAddToFavorites: (movie: any) => void;
  isFavorite: boolean;
}

function MovieDetailsModal({ movieId, onClose, onAddToFavorites, isFavorite }: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMovieDetails(movieId),
      getWatchProviders(movieId)
    ]).then(([movieData, providersData]) => {
      setMovie(movieData);
      setProviders(providersData);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading movie details:', err);
      setLoading(false);
    });
  }, [movieId]);

  if (loading) return <div className="modal-overlay"><div className="modal-loading">Loading...</div></div>;
  if (!movie) return null;

  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="modal-poster"
          />
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <div className="modal-meta">
              <span className="rating">⭐ {movie.vote_average.toFixed(1)}/10</span>
              <span className="release-date">{movie.release_date}</span>
              <span className="runtime">{movie.runtime} min</span>
            </div>
            <p className="overview">{movie.overview}</p>
            
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onAddToFavorites(movie)}
            >
              {isFavorite ? ' Remove from Favorites' : ' Add to Favorites'}
            </button>
          </div>
        </div>

        {trailer && (
          <div className="trailer-section">
            <h3>Trailer</h3>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        {providers && (
          <div className="providers-section">
            <h3>Watch Now (US)</h3>
            <div className="providers-grid">
              {providers.flatrate?.map((provider: any) => (
                <div key={provider.provider_id} className="provider">
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                  />
                  <span>{provider.provider_name}</span>
                </div>
              ))}
            </div>
            {!providers.flatrate && <p>Not available for streaming</p>}
          </div>
        )}
            <CommentsSection contentTitle={movie.title} contentType="movie" />

      </div>
    </div>
  );
}

export default MovieDetailsModal;