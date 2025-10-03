import { SpotifySearchResponse, SpotifyTrack } from '../types';

// Spotify API configuration
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Get access token from Spotify
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Make authenticated request to Spotify API
async function spotifyRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const token = await getAccessToken();
  const url = new URL(`${SPOTIFY_API_BASE}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}

export const spotifyService = {
  async searchTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await spotifyRequest('/search', {
        q: query,
        type: 'track',
        limit: limit.toString()
      });
      return response.tracks.items;
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
      return [];
    }
  },

  async getTrackById(id: string): Promise<SpotifyTrack | null> {
    try {
      const response = await spotifyRequest(`/tracks/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching Spotify track:', error);
      return null;
    }
  },

  async getRecommendations(seedTracks: string[], limit = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await spotifyRequest('/recommendations', {
        seed_tracks: seedTracks.join(','),
        limit: limit.toString()
      });
      return response.tracks;
    } catch (error) {
      console.error('Error getting Spotify recommendations:', error);
      return [];
    }
  },

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },

  convertSpotifyTrackToSong(track: SpotifyTrack): {
    name: string;
    artist: string;
    album: string;
    spotify_url: string;
    preview_url: string;
    duration: number;
    cover_path: string;
    spotify_id: string;
  } {
    return {
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      spotify_url: track.external_urls.spotify,
      preview_url: track.preview_url || '',
      duration: Math.floor(track.duration_ms / 1000),
      cover_path: track.album.images[0]?.url || '',
      spotify_id: track.id
    };
  }
};
