import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  currentBGM: string | null;
  isMuted: boolean;
  isPlaying: boolean;

  setCurrentBGM: (bgm: string | null) => void;
  setMuted: (muted: boolean) => void;
  setPlaying: (playing: boolean) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set) => ({
      currentBGM: null,
      isMuted: false,
      isPlaying: false,

      setCurrentBGM: (bgm) => set({ currentBGM: bgm }),
      setMuted: (muted) => set({ isMuted: muted }),
      setPlaying: (playing) => set({ isPlaying: playing }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    { name: 'tux-audio-store' }
  )
);

// Selectors
export const useIsMuted = () => useAudioStore((s) => s.isMuted);
export const useIsPlaying = () => useAudioStore((s) => s.isPlaying);
export const useCurrentBGM = () => useAudioStore((s) => s.currentBGM);
