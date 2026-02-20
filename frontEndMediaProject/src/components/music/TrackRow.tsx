interface Track {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; images: { url: string }[]; release_date: string };
  preview_url?: string;
  duration_ms: number;
}

interface TrackRowProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  onArtistClick?: (artistId: string) => void;
}

function formatDuration(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function TrackRow({ track, index, isPlaying, onPlay, onArtistClick }: TrackRowProps) {
  return (
    <div
      className={`track-row ${isPlaying ? 'playing' : ''}`}
      onDoubleClick={() => onPlay(track)}
    >
      <span className="track-num">
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="4" height="18" rx="1"/>
            <rect x="10" y="3" width="4" height="18" rx="1"/>
            <rect x="17" y="3" width="4" height="18" rx="1"/>
          </svg>
        ) : index + 1}
      </span>
      <div className="track-info">
        {track.album?.images?.[0]?.url && (
          <img className="track-thumb" src={track.album.images[0].url} alt={track.name} />
        )}
        <div>
          <div className="track-name">{track.name}</div>
          <div
            className="track-artist"
            onClick={(e) => {
              e.stopPropagation();
              onArtistClick?.(track.artists[0]?.id);
            }}
            style={{ cursor: onArtistClick ? 'pointer' : 'default' }}
          >
            {track.artists.map(a => a.name).join(', ')}
          </div>
        </div>
      </div>
      <span className="track-album-name">{track.album?.name}</span>
      <span className="track-duration">{formatDuration(track.duration_ms)}</span>
    </div>
  );
}

export default TrackRow;
export type { Track };