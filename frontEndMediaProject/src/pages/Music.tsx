import { useState } from 'react';
import Sidebar from '../components/music/Sidebar.tsx';
import HomePage from '../components/music/Homepage';
import SearchPage from '../components/music/SearchPage.tsx';
import AlbumPage from '../components/music/AlbumPage.tsx';
import ArtistPage from '../components/music/ArtistPage.tsx';
import MusicPlayer from '../components/music/MusicPlayer.tsx';
import type { Track } from '../components/music/TrackRow.tsx';
import type { Album } from '../components/music/Homepage.tsx';
import '../spotify.css';

type Page =
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'album'; album: Album }
  | { type: 'artist'; artistId: string };

function Music() {
  const [page, setPage] = useState<Page>({ type: 'home' });
  const [history, setHistory] = useState<Page[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const navigate = (next: Page) => {
    setHistory((h) => [...h, page]);
    setPage(next);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setPage(prev);
  };

  const handleTrackPlay = (track: Track) => {
    setCurrentTrack(track);
  };

  const handleAlbumClick = (album: Album) => {
    navigate({ type: 'album', album });
  };

  const handleArtistClick = (artistId: string) => {
    navigate({ type: 'artist', artistId });
  };

  const currentPageKey =
    page.type === 'home' || page.type === 'search'
      ? page.type
      : page.type === 'album'
      ? 'album'
      : 'artist';

  return (
    <div className="spotify-app">
      <Sidebar
        currentPage={currentPageKey}
        onNavigate={(p) => {
          if (p === 'home') navigate({ type: 'home' });
          if (p === 'search') navigate({ type: 'search' });
        }}
      />

      <main className="main-content">
        <div className="content-header">
          <div className="nav-arrows">
            <button
              className="nav-arrow"
              onClick={goBack}
              disabled={history.length === 0}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="nav-arrow" disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {page.type === 'home' && (
          <HomePage
            onAlbumClick={handleAlbumClick}
            onTrackPlay={handleTrackPlay}
          />
        )}

        {page.type === 'search' && (
          <SearchPage
            onTrackPlay={handleTrackPlay}
            onAlbumClick={handleAlbumClick}
            onArtistClick={handleArtistClick}
            currentTrack={currentTrack}
          />
        )}

        {page.type === 'album' && (
          <AlbumPage
            album={page.album}
            onTrackPlay={handleTrackPlay}
            onArtistClick={handleArtistClick}
            currentTrack={currentTrack}
            onBack={goBack}
          />
        )}

        {page.type === 'artist' && (
          <ArtistPage
            artistId={page.artistId}
            onTrackPlay={handleTrackPlay}
            onAlbumClick={handleAlbumClick}
            currentTrack={currentTrack}
          />
        )}
      </main>

      <MusicPlayer track={currentTrack} />
    </div>
  );
}

export default Music;