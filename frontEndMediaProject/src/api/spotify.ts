import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken = '';
let tokenExpiry = 0;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;
  try {
    const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (err: any) {
    console.error('Token error:', err.response?.data);
    throw new Error('Failed to get Spotify token');
  }
};

const spotifyGet = async (endpoint: string, params: Record<string, string>) => {
  const token = await getAccessToken();
  const qs = new URLSearchParams(params).toString();
  console.log('Spotify request:', `https://api.spotify.com/v1${endpoint}?${qs}`);
  const response = await axios.get(`https://api.spotify.com/v1${endpoint}?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const searchMusic = async (
  query: string,
  type: 'track' | 'album' | 'artist' | 'playlist' = 'track'
) => {
  try {
    const data = await spotifyGet('/search', {
      q: query,
      type,
      limit: '5',
      market: 'US',
    });
    if (type === 'track') return data.tracks.items;
    if (type === 'album') return data.albums.items;
    if (type === 'artist') return data.artists.items;
    if (type === 'playlist') return data.playlists.items;
  } catch (err: any) {
    console.error('Search error:', JSON.stringify(err.response?.data));
    throw err;
  }
};

export const getNewReleases = async () => {
  try {
    const data = await spotifyGet('/search', {
      q: 'beyonce',
      type: 'album',
      limit: '5',
      market: 'US',
    });
    return data.albums.items;
  } catch (err: any) {
    console.error('getNewReleases error:', JSON.stringify(err.response?.data));
    return [];
  }
};

export const getFeaturedPlaylists = async () => {
  try {
    const data = await spotifyGet('/search', {
      q: 'drake',
      type: 'album',
      limit: '5',
      market: 'US',
    });
    return data.albums.items;
  } catch (err: any) {
    console.error('getFeaturedPlaylists error:', JSON.stringify(err.response?.data));
    return [];
  }
};

export const getAlbumDetails = async (albumId: string) => {
  return spotifyGet(`/albums/${albumId}`, { market: 'US' });
};

export const getArtistDetails = async (artistId: string) => {
  return spotifyGet(`/artists/${artistId}`, {});
};

export const getArtistTopTracks = async (artistId: string) => {
  const data = await spotifyGet(`/artists/${artistId}/top-tracks`, { market: 'US' });
  return data.tracks;
};

export const getArtistAlbums = async (artistId: string) => {
  const data = await spotifyGet(`/artists/${artistId}/albums`, {
    market: 'US',
    limit: '5',
    include_groups: 'album,single',
  });
  return data.items;
};

export const getAlbumTracks = async (albumId: string) => {
  const data = await spotifyGet(`/albums/${albumId}/tracks`, { limit: '5' });
  return data.items;
};

export const getTracksByYear = async (year: string) => {
  const data = await spotifyGet('/search', {
    q: `year:${year}`,
    type: 'track',
    limit: '5',
    market: 'US',
  });
  return data.tracks.items;
};