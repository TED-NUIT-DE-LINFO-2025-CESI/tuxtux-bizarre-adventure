import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores';
import './GameContainer.css';

interface GameContainerProps {
  children: React.ReactNode;
}

export const GameContainer = ({ children }: GameContainerProps) => {
  const { advanceDialogue, isShowingChoices, isPaused, pauseGame, resumeGame } = useGameStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isPaused) {
        if (event.key === 'Escape') {
          resumeGame();
        }
        return;
      }

      switch (event.key) {
        case ' ':
        case 'Enter':
          if (!isShowingChoices) {
            event.preventDefault();
            advanceDialogue();
          }
          break;
        case 'Escape':
          pauseGame();
          break;
      }
    },
    [advanceDialogue, isShowingChoices, isPaused, pauseGame, resumeGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="game-container">
      {children}
      {isPaused && (
        <div className="game-container__pause-overlay">
          <div className="game-container__pause-text">PAUSE</div>
          <div className="game-container__pause-hint">Appuyez sur Echap pour continuer</div>
        </div>
      )}
    </div>
  );
};
