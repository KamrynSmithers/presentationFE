import { useState, useEffect } from 'react';
import { getArtistDetails, getArtistAlbums } from '../../api/spotify';
import type { Track } from './TrackRow';
import type { Album } from './Homepage';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
}

interface ArtistPageProps {
  artistId: string;
  onTrackPlay: (track: Track) => void;
  onAlbumClick: (album: Album) => void;
  currentTrack: Track | null;
}

function ArtistPage({ onAlbumClick, artistId }: ArtistPageProps) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getArtistDetails(artistId),
      getArtistAlbums(artistId),
    ])
      .then(([artistData, albumsData]) => {
        setArtist(artistData);
        setAlbums(albumsData);
      })
      .catch((err) => console.error('ArtistPage error:', err))
      .finally(() => setLoading(false));
  }, [artistId]);

  if (loading) return <div className="loading-spinner">Loading artist...</div>;
  if (!artist) return null;

  const formatFollowers = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `${(n / 1_000).toFixed(0)}K`
      : n.toString();

  return (
    <div className="artist-page fade-in">
      <div className="artist-hero">
        <img
          className="artist-bg"
          src={artist.images[0]?.url || 'https://via.placeholder.com/800x320/333/fff?text=Artist'}
          alt={artist.name}
        />
        <div className="artist-hero-overlay">
          <div>
            <h1 className="artist-name-large">{artist.name}</h1>
            <p className="artist-followers">
              {formatFollowers(artist.followers?.total || 0)} followers
            </p>
          </div>
        </div>
      </div>

      <div className="artist-content">
        <div className="artist-actions">
          <button className="btn-play-large" onClick={() => albums[0] && onAlbumClick(albums[0])}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </button>
          <button className="btn-follow">Follow</button>
        </div>

        {albums.length > 0 && (
          <div className="section">
            <h2 className="section-title" style={{ marginBottom: 16 }}>Discography</h2>
            <div className="cards-row">
              {albums.map((album) => (
                <div key={album.id} className="card" onClick={() => onAlbumClick(album)}>
                  <img
                    className="card-image"
                    src={album.images[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=Album'}
                    alt={album.name}
                  />
                  <div className="card-title">{album.name}</div>
                  <div className="card-subtitle">{album.release_date?.split('-')[0]}</div>
                  <button className="play-btn" onClick={(e) => { e.stopPropagation(); onAlbumClick(album); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {artist.genres?.length > 0 && (
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {artist.genres.map((g) => (
              <span
                key={g}
                style={{
                  padding: '6px 14px',
                  borderRadius: '500px',
                  border: '1px solid #555',
                  fontSize: '0.75rem',
                  color: 'var(--text-subdued)',
                  textTransform: 'capitalize',
                }}
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistPage;