interface MoviePlayerProps {
  imdbId?: string;
  tmdbId?: string;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onClose?: () => void;
}

function MoviePlayer ({ imdbId, tmdbId, type, season, episode, onClose }: MoviePlayerProps) {
  const getEmbedUrl = () => {
    const baseUrl = `https://vidsrc-embed.ru/embed/${type}`;
    
    if (type === 'movie') {
      if (imdbId) return `${baseUrl}?imdb=${imdbId}`;
      if (tmdbId) return `${baseUrl}?tmdb=${tmdbId}`;
    } else {
      if (season && episode) {
        if (imdbId) return `${baseUrl}?imdb=${imdbId}&season=${season}&episode=${episode}`;
        if (tmdbId) return `${baseUrl}?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      } else {
        if (imdbId) return `${baseUrl}?imdb=${imdbId}`;
        if (tmdbId) return `${baseUrl}?tmdb=${tmdbId}`;
      }
    }
    return '';
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'black',
      zIndex: 1000 
    }}>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          zIndex: 1001,
          cursor: 'pointer'
        }}
      >
        Close
      </button>
      <iframe
        src={getEmbedUrl()}
        width="100%"
        height="100%"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
}

export default MoviePlayer;