import { useState, useEffect, useRef } from 'react';
import type { Track } from './TrackRow';

interface MusicPlayerProps {
  track: Track | null;
}

function MusicPlayer({ track }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!track) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (track.preview_url) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.volume = volume;
      audioRef.current.play();
      setIsPlaying(true);

      audioRef.current.ontimeupdate = () => {
        const audio = audioRef.current!;
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration || 30);
        setProgress((audio.currentTime / (audio.duration || 30)) * 100);
      };

      audioRef.current.onended = () => setIsPlaying(false);
    } else {
      setIsPlaying(false);
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * (audioRef.current.duration || 30);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.volume = ratio;
    setVolume(ratio);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <footer className="player">
      {/* Left: track info */}
      <div className="player-track">
        {track ? (
          <>
            {track.album?.images?.[0]?.url && (
              <img className="player-thumb" src={track.album.images[0].url} alt={track.name} />
            )}
            <div className="player-track-info">
              <div className="player-track-name">{track.name}</div>
              <div className="player-track-artist">{track.artists[0]?.name}</div>
            </div>
          </>
        ) : (
          <div className="player-track-info" style={{ color: 'var(--text-subdued)', fontSize: '0.8rem' }}>
            {track === null ? 'Select a track to play' : ''}
          </div>
        )}
      </div>

      {/* Center: controls */}
      <div className="player-controls">
        <div className="player-buttons">
          <button className="ctrl-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 4v3.5L3 11l4 3.5V18l5.5-4.5L19 18V4H7zm10 1.86v8.28l-5.53-4.14L17 5.86z"/>
            </svg>
          </button>
          <button className="ctrl-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20"/>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button className="ctrl-btn play-pause" onClick={togglePlay}>
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>
          <button className="ctrl-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4"/>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button className="ctrl-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </button>
        </div>

        <div className="progress-bar-wrap">
          <span className="progress-time">{fmt(currentTime)}</span>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-time">{fmt(duration)}</span>
        </div>

        {!track?.preview_url && track && (
          <span style={{ fontSize: '0.65rem', color: 'var(--text-subdued)' }}>
            No preview available
          </span>
        )}
      </div>

      {/* Right: volume */}
      <div className="player-extras">
        <button className="ctrl-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
        <div className="volume-bar" onClick={handleVolumeClick}>
          <div className="volume-fill" style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </footer>
  );
}

export default MusicPlayer;