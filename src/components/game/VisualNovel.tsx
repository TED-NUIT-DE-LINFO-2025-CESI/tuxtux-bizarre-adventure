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

    if (!scene) return null;

    const isChaos = scene.atmosphere === 'chaos';

    // --- NOUVEAU : Fonction pour gérer le clic sur le fond ---
    const handleBackgroundChoice = (side: 'linux' | 'windows') => {
        if (!scene.choices || scene.choices.length < 2) return;

        if (side === 'linux') {
            makeChoice(scene.choices[0].id);
        } else if (side === 'windows') {
            makeChoice(scene.choices[1].id);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono">

            {/* --- MODIFICATION ICI --- */}
            <SceneBackground
                atmosphere={scene.atmosphere}
                enableSelection={showChoices}
                onChoose={handleBackgroundChoice}
            />

            {/* Contenu principal */}
            <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">

                <div className="pointer-events-auto">
                    <GameHeader title={scene.title} path={path} isChaos={isChaos} />
                </div>

                {/* Zone de jeu principale */}
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-3xl pointer-events-auto">
                        <AnimatePresence mode="wait">

                            {!showChoices && !showBattle && (
                                <DialogueBox
                                    key={`dialogue-${scene.id}`}
                                    onNext={nextDialogue}
                                />
                            )}

                            {showChoices && scene.choices && (
                                <div className="opacity-0">

                                </div>
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
                <footer className="p-4 text-center text-gray-500 text-sm pointer-events-auto">
                    Nuit de l'Info 2024 - TED CESI
                </footer>
            </div>
        </div>
    );
});

VisualNovel.displayName = 'VisualNovel';

export default VisualNovel;
