import { useState, useEffect } from 'react';
import { getAlbumDetails } from '../../api/spotify';
import TrackRow from './TrackRow';
import type { Track } from './TrackRow';
import type { Album } from './Homepage';
import CommentsSection from '../../components/CommentSection';

type Comment = {
  id: number;
  text: string;
  author: string;
  createdAt: string;
};

interface AlbumPageProps {
  album: Album;
  onTrackPlay: (track: Track) => void;
  onArtistClick: (artistId: string) => void;
  onBack: () => void;
  currentTrack: Track | null;
}

function AlbumPage({ album, onTrackPlay, onArtistClick, currentTrack }: AlbumPageProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAlbumDetails(album.id)
      .then((data) => {
        const mapped = data.tracks.items.map((t: any) => ({
          ...t,
          album: {
            name: data.name,
            images: data.images,
            release_date: data.release_date,
          },
        }));
        setTracks(mapped);
      })
      .catch((err) => console.error('AlbumPage error:', err))
      .finally(() => setLoading(false));
  }, [album.id]);

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration_ms, 0);

  const fmt = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    return `${mins} min`;
  };

  return (
    <div className="album-page fade-in">
      {/* Hero */}
      <div className="album-hero">
        <img
          className="album-cover"
          src={album.images[0]?.url || 'https://via.placeholder.com/220x220/333/fff?text=Album'}
          alt={album.name}
        />
        <div className="album-meta">
          <div className="album-type">Album</div>
          <h1 className="album-title">{album.name}</h1>
          <div className="album-info">
            <strong
              style={{ cursor: 'pointer' }}
              onClick={() => onArtistClick(album.artists[0]?.id)}
            >
              {album.artists[0]?.name}
            </strong>
            <span>•</span>
            <span>{album.release_date?.split('-')[0]}</span>
            <span>•</span>
            <span>{album.total_tracks} songs,</span>
            <span>{fmt(totalDuration)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="album-actions">
        <button
          className="btn-play-large"
          onClick={() => tracks[0] && onTrackPlay(tracks[0])}
          title="Play"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="5,3 19,12 5,21" fill="black" />
          </svg>
        </button>
      </div>

      {/* Track list */}
      <div className="album-tracks">
        {loading ? (
          <div className="loading-spinner">Loading tracks...</div>
        ) : (
          <div className="track-list">
            <div className="track-list-header">
              <span>#</span>
              <span>Title</span>
              <span></span>
              <span style={{ textAlign: 'right' }}>Duration</span>
            </div>
            {tracks.map((track, i) => (
              <TrackRow
                key={track.id}
                track={track}
                index={i}
                isPlaying={currentTrack?.id === track.id}
                onPlay={onTrackPlay}
                onArtistClick={onArtistClick}
              />
            ))}
          </div>
        )}
      </div>
<CommentsSection
  contentTitle={album.name}
  contentType="music"
/>
    </div>
  );
}

export default AlbumPage;