import { useCallback, useEffect } from 'react';
import { audioService } from '../services/audioService';
import { useIsMuted, useAudioStore } from '../stores/audioStore';

export function useAudio() {
  const isMuted = useIsMuted();
  const toggleMute = useAudioStore((s) => s.toggleMute);

  const playBGM = useCallback((trackId: string, fade = true) => {
    audioService.playBGM(trackId, fade);
  }, []);

  const stopBGM = useCallback((fade = true) => {
    audioService.stopBGM(fade);
  }, []);

  const playSFX = useCallback((sfxId: string) => {
    audioService.playSFX(sfxId);
  }, []);

  const preloadSFX = useCallback((sfxIds: string[]) => {
    audioService.preloadSFX(sfxIds);
  }, []);

  return {
    playBGM,
    stopBGM,
    playSFX,
    preloadSFX,
    isMuted,
    toggleMute,
  };
}

// Hook for scene-based BGM switching
export function useSceneBGM(bgmId: string | undefined) {
  useEffect(() => {
    if (bgmId) {
      audioService.playBGM(bgmId);
    }
  }, [bgmId]);
}
