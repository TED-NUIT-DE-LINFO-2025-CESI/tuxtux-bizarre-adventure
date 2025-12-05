import { memo } from 'react';
import { AnimatePresence } from 'motion/react';
import { SCENES } from '../../data/scenes';
import {
    useCurrentScene,
    useShowChoices,
    useShowBattle,
    usePath,
    useGameActions
} from '../../stores/gameStore';
import { SceneBackground } from './SceneBackground';
import { GameHeader } from './GameHeader';
import { DialogueBox } from './DialogueBox';
import { BattleScene } from './BattleScene';
import { ChoicePanel } from './ChoicePanel'; // <--- AJOUT IMPORTANT

const VisualNovel = memo(() => {
    const scene = useCurrentScene();
    const showChoices = useShowChoices();
    const showBattle = useShowBattle();
    const path = usePath();
    const { nextDialogue, makeChoice, completeBattle } = useGameActions();

    // --- ZONE DE DEBUG D'ERREUR ---
    if (!scene) {
        const availableScenes = Object.keys(SCENES).join(', ');
        return (
            <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-10 text-center font-mono">
                <h1 className="text-4xl font-bold mb-4 text-red-500">⚠️ ERREUR CRITIQUE ⚠️</h1>
                <p className="text-xl mb-4">La scène demandée est introuvable.</p>
                <div className="bg-black/50 p-4 rounded mb-6 max-w-2xl overflow-auto border border-red-500/30">
                    <p className="text-sm text-gray-400 mb-2">DEBUG INFO :</p>
                    <p className="text-xs text-justify break-all">SCÈNES : {availableScenes}</p>
                </div>
                <button
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg"
                >
                    🧹 RÉINITIALISER LA SAUVEGARDE
                </button>
            </div>
        );
    }

    const isChaos = scene.atmosphere === 'chaos';

    // Gestion du clic sur le fond (Uniquement pour l'intro/Split screen)
    const handleBackgroundChoice = (side: 'linux' | 'windows') => {
        // On ne fait ça que si on est dans l'intro, pour éviter les bugs ailleurs
        if (scene.id !== 'intro' || !scene.choices) return;

        const linuxChoice = scene.choices.find(c => c.text.toLowerCase().includes('linux') || c.text.includes('Mint'));
        const windowsChoice = scene.choices.find(c => c.text.toLowerCase().includes('windows'));

        if (side === 'linux' && linuxChoice) makeChoice(linuxChoice.id);
        else if (side === 'windows' && windowsChoice) makeChoice(windowsChoice.id);
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono">

            <SceneBackground
                atmosphere={scene.atmosphere}
                customBg={scene.bgImage}
                enableSelection={showChoices}
                onChoose={handleBackgroundChoice}
            />

            <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
                <div className="pointer-events-auto">
                    <GameHeader title={scene.title} path={path} isChaos={isChaos} />
                </div>

                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-3xl pointer-events-auto">
                        <AnimatePresence mode="wait">

                            {/* 1. DIALOGUES */}
                            {!showChoices && !showBattle && (
                                <DialogueBox key={`dialogue-${scene.id}`} onNext={nextDialogue} />
                            )}

                            {/* 2. CHOIX */}
                            {showChoices && (
                                <div className="w-full">
                                    {/* Si c'est l'INTRO : On affiche juste un vide pour laisser cliquer le fond */}
                                    {scene.id === 'intro' ? (
                                        <div className="h-32 flex items-end justify-center pb-4 opacity-75">
                                            <span className="bg-black/50 px-4 py-2 rounded text-sm animate-pulse">
                                                Cliquez sur un côté de l'écran pour choisir
                                            </span>
                                        </div>
                                    ) : (
                                        /* Si c'est une AUTRE SCÈNE : On affiche les boutons normaux */
                                        <ChoicePanel
                                            choices={scene.choices || []}
                                            onChoice={(c) => makeChoice(c.id)}
                                        />
                                    )}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* 3. COMBAT */}
                        {showBattle && (
                            <BattleScene
                                onVictory={completeBattle}
                            />
                        )}
                    </div>
                </main>

                <footer className="p-4 text-center text-gray-500 text-sm pointer-events-auto">
                    Nuit de l'Info 2024 - TED CESI
                </footer>
            </div>
        </div>
    );
});

VisualNovel.displayName = 'VisualNovel';
export default VisualNovel;
