import { memo } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  useCurrentScene,
  useShowChoices,
  useShowBattle,
  usePath,
  useHealth,
  useGameActions
} from '../../stores/gameStore';
import { useSceneBGM } from '../../hooks/useAudio';
import { SceneBackground } from './SceneBackground';
import { GameHeader } from './GameHeader';
import { DialogueBox } from './DialogueBox';
import { ChoicePanel } from './ChoicePanel';
import { BattleScene } from './BattleScene';

/**
 * VisualNovel - Composant principal du jeu
 * Orchestre tous les sous-composants et gere le flux du jeu
 */
const VisualNovel = memo(() => {
  const scene = useCurrentScene();
  const showChoices = useShowChoices();
  const showBattle = useShowBattle();
  const path = usePath();
  const health = useHealth();
  const { nextDialogue, makeChoice, processBattlePhase, completeBattle } = useGameActions();

  // Play BGM when scene changes
  useSceneBGM(scene?.bgm);

  if (!scene) return null;

  const isChaos = scene.atmosphere === 'chaos';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono">
      {/* Background dynamique */}
      <SceneBackground atmosphere={scene.atmosphere} />

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* En-tete */}
        <GameHeader title={scene.title} path={path} isChaos={isChaos} />

        {/* Zone de jeu principale */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              {/* Dialogues */}
              {!showChoices && !showBattle && (
                <DialogueBox
                  key={`dialogue-${scene.id}`}
                  onNext={nextDialogue}
                />
              )}

              {/* Choix */}
              {showChoices && scene.choices && (
                <ChoicePanel
                  key="choices"
                  choices={scene.choices}
                  onChoice={makeChoice}
                />
              )}
            </AnimatePresence>

            {/* Combat */}
            {showBattle && (
              <BattleScene
                health={health}
                onProcessPhase={processBattlePhase}
                onVictory={completeBattle}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-4 text-center text-gray-500 text-sm">
          Nuit de l'Info 2024 - TED CESI | Appuyez sur Espace ou cliquez pour continuer
        </footer>
      </div>
    </div>
  );
});

VisualNovel.displayName = 'VisualNovel';

export default VisualNovel;
