import { create } from "zustand";
import type { Song } from "../lib/data";

interface PlayerState {
  isPlaying: boolean;
  currentSong: Song | null;
  queue: Song[];
  volume: number;
  setIsPlaying: (v: boolean) => void;
  play: (song: Song, queue?: Song[]) => void;
  setVolume: (v: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  currentSong: null,
  queue: [],
  volume: 0.9,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  play: (song, queue = []) => set({ currentSong: song, queue, isPlaying: true }),
  setVolume: (volume) => set({ volume }),
}));
