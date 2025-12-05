import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SCENES } from '../data/scenes';

// --- TYPES ---

interface GameState {
    currentSceneId: string;
    dialogueIndex: number;
    showChoices: boolean;
    showBattle: boolean;
    path: 'windows' | 'linux' | null;
}

interface GameActions {
    nextDialogue: () => void;
    makeChoice: (choiceId: number) => void;
    completeBattle: () => void;
    resetGame: () => void;
}

type GameStore = GameState & { actions: GameActions };

// --- STORE ---

const INITIAL_STATE: GameState = {
    currentSceneId: 'intro',
    dialogueIndex: 0,
    showChoices: false,
    showBattle: false,
    path: null
};

const useGameStore = create<GameStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...INITIAL_STATE,

                actions: {
                    nextDialogue: () => {
                        const state = get();
                        const scene = SCENES[state.currentSceneId];

                        if (!scene) return;

                        // Si c'est un combat, on ne gère pas les dialogues classiques
                        if (scene.isBattle) {
                            set({ showBattle: true, dialogueIndex: 0, showChoices: false });
                            return;
                        }

                        // S'il reste des dialogues, on avance
                        if (state.dialogueIndex < scene.dialogues.length - 1) {
                            set({ dialogueIndex: state.dialogueIndex + 1 });
                        } else {
                            // Fin des dialogues : Si choix, on les affiche. Sinon, scène suivante.
                            if (scene.choices && scene.choices.length > 0) {
                                set({ showChoices: true });
                            } else if (scene.nextScene) {
                                // Transition automatique vers la scène suivante
                                set({
                                    currentSceneId: scene.nextScene,
                                    dialogueIndex: 0,
                                    showChoices: false
                                });
                            }
                        }
                    },

                    makeChoice: (choiceId: number) => {
                        const state = get();
                        const scene = SCENES[state.currentSceneId];

                        if (!scene || !scene.choices) return;

                        // --- CORRECTION CRITIQUE ICI ---
                        // On cherche le choix qui correspond à l'ID (1 ou 2)
                        const choice = scene.choices.find((c) => c.id === choiceId);

                        if (choice) {
                            // Détection du chemin (Path) pour le Header
                            let newPath = state.path;
                            if (choice.text.toLowerCase().includes('linux')) newPath = 'linux';
                            if (choice.text.toLowerCase().includes('windows')) newPath = 'windows';

                            set({
                                currentSceneId: choice.nextScene, // On passe à la string 'scene_2_updates' etc.
                                dialogueIndex: 0,
                                showChoices: false,
                                path: newPath
                            });
                        } else {
                            console.error(`Choix ID ${choiceId} introuvable dans la scène ${state.currentSceneId}`);
                        }
                    },

                    completeBattle: () => {
                        const state = get();
                        const scene = SCENES[state.currentSceneId];
                        if (scene && scene.nextScene) {
                            set({
                                currentSceneId: scene.nextScene,
                                dialogueIndex: 0,
                                showBattle: false,
                                showChoices: false
                            });
                        } else {
                            set({ showBattle: false });
                        }
                    },

                    resetGame: () => {
                        set(INITIAL_STATE);
                    }
                },
            }),
            {
                name: 'tux-adventure-storage', // Nom pour le localStorage
            }
        )
    )
);

// --- HOOKS EXPORTÉS (Ceux utilisés dans VisualNovel.tsx) ---

export const useCurrentScene = () => useGameStore((state) => SCENES[state.currentSceneId]);
export const useDialogueIndex = () => useGameStore((state) => state.dialogueIndex);
export const useShowChoices = () => useGameStore((state) => state.showChoices);
export const useShowBattle = () => useGameStore((state) => state.showBattle);
export const usePath = () => useGameStore((state) => state.path);
export const useGameActions = () => useGameStore((state) => state.actions);
