import { useState, useEffect } from 'react';
import { getAlbumDetails } from '../api/spotify';
import CommentsSection from './CommentSection';
import '../musicModal.css';

interface MusicDetailsModalProps {
  album: any;
  onClose: () => void;
  onAddToFavorites: (album: any) => void;
  isFavorite: boolean;
}

function MusicDetailsModal({ album, onClose, onAddToFavorites, isFavorite }: MusicDetailsModalProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  useEffect(() => {
    getAlbumDetails(album.id)
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading album details:', err);
        setLoading(false);
      });
  }, [album]);

  if (loading) return <div className="modal-overlay"><div className="modal-loading">Loading...</div></div>;
  if (!details) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <img 
            src={album.images[0]?.url} 
            alt={album.name}
            className="modal-poster"
          />
          <div className="modal-info">
            <h2>{album.name}</h2>
            <div className="modal-meta">
              <span className="artist">by {album.artists.map((a: any) => a.name).join(', ')}</span>
              <span className="year">{album.release_date}</span>
              <span className="tracks">{details.total_tracks} tracks</span>
            </div>
            
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onAddToFavorites(album)}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="tracklist-section">
          <h3>Tracks</h3>
          <div className="tracklist">
            {details.tracks.items.map((track: any, index: number) => (
              <div key={track.id} className="track-item">
                <span className="track-number">{index + 1}</span>
                <div className="track-info-inline">
                  <span className="track-name">{track.name}</span>
                  <span className="track-duration">
                    {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </span>
                </div>
                {track.preview_url && (
                  <button 
                    className="play-preview-btn"
                    onClick={() => setPlayingTrack(playingTrack === track.preview_url ? null : track.preview_url)}
                  >
                    {playingTrack === track.preview_url ? '⏸' : '▶'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audio Preview */}
        {playingTrack && (
          <audio 
            src={playingTrack} 
            autoPlay 
            controls 
            className="audio-player"
            onEnded={() => setPlayingTrack(null)}
          />
        )}

        <CommentsSection contentTitle={album.name} contentType="music" />
      </div>
    </div>
  );
}

export default MusicDetailsModal;