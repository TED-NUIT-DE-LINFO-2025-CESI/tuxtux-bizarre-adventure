import { Howl, Howler } from 'howler';
import { useSettingsStore } from '../stores/settingsStore';
import { useAudioStore } from '../stores/audioStore';

// BGM Tracks mapping
export const BGM_TRACKS: Record<string, string> = {
  intro: '/audio/bgm/intro.mp3',
  windows: '/audio/bgm/windows.mp3',
  linux: '/audio/bgm/linux.mp3',
  chaos: '/audio/bgm/chaos.mp3',
  battle: '/audio/bgm/battle.mp3',
  victory: '/audio/bgm/victory.mp3',
};

// SFX mapping
export const SFX: Record<string, string> = {
  textBlip: '/audio/sfx/blip.mp3',
  choiceHover: '/audio/sfx/hover.mp3',
  choiceSelect: '/audio/sfx/select.mp3',
  attackTux: '/audio/sfx/attack-tux.mp3',
  attackOmega: '/audio/sfx/attack-omega.mp3',
  hit: '/audio/sfx/hit.mp3',
  victory: '/audio/sfx/victory-fanfare.mp3',
};

class AudioService {
  private bgm: Howl | null = null;
  private currentBGMId: string | null = null;
  private sfxCache: Map<string, Howl> = new Map();

  constructor() {
    // Listen to volume changes from settings store
    useSettingsStore.subscribe((state) => {
      this.updateVolumes(state.masterVolume, state.bgmVolume, state.sfxVolume);
    });

    // Listen to mute state
    useAudioStore.subscribe((state) => {
      Howler.mute(state.isMuted);
    });
  }

  private updateVolumes(master: number, bgm: number, sfx: number) {
    const bgmVolume = (master / 100) * (bgm / 100);
    const sfxVolume = (master / 100) * (sfx / 100);

    if (this.bgm) {
      this.bgm.volume(bgmVolume);
    }

    this.sfxCache.forEach((sound) => {
      sound.volume(sfxVolume);
    });
  }

  private getVolume(type: 'bgm' | 'sfx'): number {
    const settings = useSettingsStore.getState();
    const master = settings.masterVolume / 100;

    if (type === 'bgm') {
      return master * (settings.bgmVolume / 100);
    }
    return master * (settings.sfxVolume / 100);
  }

  playBGM(trackId: string, fade = true): void {
    const src = BGM_TRACKS[trackId];
    if (!src) {
      console.warn(`BGM track not found: ${trackId}`);
      return;
    }

    // Don't restart if same track
    if (this.currentBGMId === trackId && this.bgm?.playing()) {
      return;
    }

    // Stop current BGM
    if (this.bgm) {
      if (fade) {
        this.bgm.fade(this.bgm.volume(), 0, 500);
        setTimeout(() => {
          this.bgm?.stop();
          this.bgm?.unload();
          this.startNewBGM(trackId, src, fade);
        }, 500);
      } else {
        this.bgm.stop();
        this.bgm.unload();
        this.startNewBGM(trackId, src, fade);
      }
    } else {
      this.startNewBGM(trackId, src, fade);
    }
  }

  private startNewBGM(trackId: string, src: string, fade: boolean): void {
    const volume = this.getVolume('bgm');

    this.bgm = new Howl({
      src: [src],
      loop: true,
      volume: fade ? 0 : volume,
      onplay: () => {
        useAudioStore.getState().setPlaying(true);
        useAudioStore.getState().setCurrentBGM(trackId);
      },
      onend: () => {
        useAudioStore.getState().setPlaying(false);
      },
      onloaderror: (_id, error) => {
        console.warn(`Failed to load BGM ${trackId}:`, error);
      },
    });

    this.currentBGMId = trackId;
    this.bgm.play();

    if (fade) {
      this.bgm.fade(0, volume, 1000);
    }
  }

  stopBGM(fade = true): void {
    if (!this.bgm) return;

    if (fade) {
      this.bgm.fade(this.bgm.volume(), 0, 500);
      setTimeout(() => {
        this.bgm?.stop();
        this.bgm?.unload();
        this.bgm = null;
        this.currentBGMId = null;
        useAudioStore.getState().setPlaying(false);
        useAudioStore.getState().setCurrentBGM(null);
      }, 500);
    } else {
      this.bgm.stop();
      this.bgm.unload();
      this.bgm = null;
      this.currentBGMId = null;
      useAudioStore.getState().setPlaying(false);
      useAudioStore.getState().setCurrentBGM(null);
    }
  }

  playSFX(sfxId: string): void {
    const src = SFX[sfxId];
    if (!src) {
      console.warn(`SFX not found: ${sfxId}`);
      return;
    }

    // Check cache
    let sound = this.sfxCache.get(sfxId);

    if (!sound) {
      sound = new Howl({
        src: [src],
        volume: this.getVolume('sfx'),
        onloaderror: (_id, error) => {
          console.warn(`Failed to load SFX ${sfxId}:`, error);
        },
      });
      this.sfxCache.set(sfxId, sound);
    }

    sound.volume(this.getVolume('sfx'));
    sound.play();
  }

  // Preload SFX for better performance
  preloadSFX(sfxIds: string[]): void {
    sfxIds.forEach((id) => {
      const src = SFX[id];
      if (src && !this.sfxCache.has(id)) {
        const sound = new Howl({
          src: [src],
          preload: true,
          volume: this.getVolume('sfx'),
        });
        this.sfxCache.set(id, sound);
      }
    });
  }

  // Cleanup
  dispose(): void {
    this.stopBGM(false);
    this.sfxCache.forEach((sound) => {
      sound.unload();
    });
    this.sfxCache.clear();
  }
}

// Singleton instance
export const audioService = new AudioService();
