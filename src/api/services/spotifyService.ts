import { apiClient } from '../config';
import { ApiResponse, SpotifySearchResponse, SpotifyTrack } from '../types';

export const spotifyService = {
  async searchTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await apiClient.get<SpotifySearchResponse>('/spotify/search', {
        params: { 
          q: query,
          type: 'track',
          limit 
        }
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
      return [];
    }
  },

  async getTrackById(id: string): Promise<SpotifyTrack | null> {
    try {
      const response = await apiClient.get<SpotifyTrack>(`/spotify/tracks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Spotify track:', error);
      return null;
    }
  },

  async getRecommendations(seedTracks: string[], limit = 20): Promise<SpotifyTrack[]> {
    try {
      const response = await apiClient.get<SpotifySearchResponse>('/spotify/recommendations', {
        params: { 
          seed_tracks: seedTracks.join(','),
          limit 
        }
      });
      return response.data.tracks.items;
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
