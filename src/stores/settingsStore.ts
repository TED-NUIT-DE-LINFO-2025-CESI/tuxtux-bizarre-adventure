import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameSettings {
  textSpeed: number;
  autoPlaySpeed: number;
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
}

interface SettingsState extends GameSettings {
  setTextSpeed: (speed: number) => void;
  setAutoPlaySpeed: (speed: number) => void;
  setMasterVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: GameSettings = {
  textSpeed: 5,
  autoPlaySpeed: 5,
  masterVolume: 80,
  bgmVolume: 70,
  sfxVolume: 80,
  fullscreen: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTextSpeed: (speed) => set({ textSpeed: speed }),
      setAutoPlaySpeed: (speed) => set({ autoPlaySpeed: speed }),
      setMasterVolume: (volume) => set({ masterVolume: volume }),
      setBgmVolume: (volume) => set({ bgmVolume: volume }),
      setSfxVolume: (volume) => set({ sfxVolume: volume }),
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      resetToDefaults: () => set(defaultSettings),
    }),
    { name: 'tux-adventure-settings' }
  )
);
