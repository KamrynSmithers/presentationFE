import { useState, useEffect } from 'react';
import { getNewReleases, getFeaturedPlaylists } from '../../api/spotify';
import type { Track } from './TrackRow';

interface Album {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  images: { url: string }[];
  release_date: string;
  total_tracks: number;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
}

interface HomePageProps {
  onAlbumClick: (album: Album) => void;
  onTrackPlay: (track: Track) => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function HomePage({ onAlbumClick }: HomePageProps) {
  const [newReleases, setNewReleases] = useState<Album[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNewReleases(), getFeaturedPlaylists()])
  .then(([releases, popular]) => {
    setNewReleases(releases);
    setPlaylists(popular); // still works since both return Album[]
  })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="home-page fade-in">
      <h1 className="greeting">{getGreeting()}</h1>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">New Releases</h2>
        </div>
        <div className="cards-row">
          {newReleases.slice(0, 6).map((album) => (
            <div key={album.id} className="card" onClick={() => onAlbumClick(album)}>
              <img
                className="card-image"
                src={album.images[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=No+Art'}
                alt={album.name}
              />
              <div className="card-title">{album.name}</div>
              <div className="card-subtitle">{album.artists[0]?.name}</div>
              <button className="play-btn" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Playlists</h2>
        </div>
        <div className="cards-row">
          {playlists.slice(0, 6).map((playlist) => (
            <div key={playlist.id} className="card">
              <img
                className="card-image"
                src={playlist.images[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=Playlist'}
                alt={playlist.name}
              />
              <div className="card-title">{playlist.name}</div>
              <div className="card-subtitle">{playlist.description || 'Spotify playlist'}</div>
              <button className="play-btn" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
export type { Album };