import { useState } from 'react';
import { searchMusic } from '../../api/spotify';
import TrackRow from './TrackRow';
import type { Track } from './TrackRow';
import type { Album } from './Homepage';

type SearchType = 'track' | 'album' | 'artist';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
}

interface SearchPageProps {
  onTrackPlay: (track: Track) => void;
  onAlbumClick: (album: Album) => void;
  onArtistClick: (artistId: string) => void;
  currentTrack: Track | null;
}

function SearchPage({ onTrackPlay, onAlbumClick, onArtistClick, currentTrack }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('track');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const results = await searchMusic(query, searchType);
      if (searchType === 'track') setTracks(results);
      else if (searchType === 'album') setAlbums(results);
      else setArtists(results);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    setTracks([]);
    setAlbums([]);
    setArtists([]);
    setSearched(false);
  };

  return (
    <div className="search-page fade-in">
      <form onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </form>

      <div className="search-filters">
        {(['track', 'album', 'artist'] as SearchType[]).map((type) => (
          <button
            key={type}
            className={`filter-chip ${searchType === type ? 'active' : ''}`}
            onClick={() => handleTypeChange(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </button>
        ))}
      </div>

      {loading && <div className="loading-spinner">Searching...</div>}

      {/* Track results */}
      {!loading && searchType === 'track' && tracks.length > 0 && (
        <div className="track-list">
          <div className="track-list-header">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
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

      {/* Album results */}
      {!loading && searchType === 'album' && albums.length > 0 && (
        <div className="cards-row">
          {albums.map((album) => (
            <div key={album.id} className="card" onClick={() => onAlbumClick(album)}>
              <img
                className="card-image"
                src={album.images[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=Album'}
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
      )}

      {/* Artist results */}
      {!loading && searchType === 'artist' && artists.length > 0 && (
        <div className="cards-row">
          {artists.map((artist) => (
            <div key={artist.id} className="card" onClick={() => onArtistClick(artist.id)}>
              <img
                className="card-image artist-img"
                src={artist.images[0]?.url || 'https://via.placeholder.com/300x300/333/fff?text=Artist'}
                alt={artist.name}
              />
              <div className="card-title">{artist.name}</div>
              <div className="card-subtitle">Artist</div>
            </div>
          ))}
        </div>
      )}

      {!loading && searched && tracks.length === 0 && albums.length === 0 && artists.length === 0 && (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try different keywords or filters</p>
        </div>
      )}

      {!searched && (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3>Search for music</h3>
          <p>Find tracks, albums, and artists</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;