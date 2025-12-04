import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameSettings } from '../schemas';

interface SettingsState extends GameSettings {
  setTextSpeed: (speed: number) => void;
  setAutoPlaySpeed: (speed: number) => void;
  setMasterVolume: (volume: number) => void;
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setVoiceVolume: (volume: number) => void;
  toggleFullscreen: () => void;
  toggleSkipUnread: () => void;
  toggleQuickMenu: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: GameSettings = {
  textSpeed: 5,
  autoPlaySpeed: 5,
  masterVolume: 80,
  bgmVolume: 70,
  sfxVolume: 80,
  voiceVolume: 100,
  fullscreen: false,
  skipUnread: false,
  showQuickMenu: true,
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
      setVoiceVolume: (volume) => set({ voiceVolume: volume }),
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      toggleSkipUnread: () => set((state) => ({ skipUnread: !state.skipUnread })),
      toggleQuickMenu: () =>
        set((state) => ({ showQuickMenu: !state.showQuickMenu })),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'tux-adventure-settings',
    }
  )
);
