import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SCENES, INITIAL_HEALTH, BATTLE_ATTACKS, type Scene, type Choice } from '../data/scenes';

// ============================================================================
// TYPES
// ============================================================================

type GamePath = 'windows' | 'linux' | null;

interface Health {
  tux: number;
  omega: number;
}

interface GameState {
  // State
  currentSceneId: string;
  dialogueIndex: number;
  showChoices: boolean;
  showBattle: boolean;
  path: GamePath;
  health: Health;
  battlePhase: number;

  // Computed
  getCurrentScene: () => Scene;
  getCurrentDialogue: () => Scene['dialogues'][number] | null;
  isLastDialogue: () => boolean;

  // Actions
  nextDialogue: () => void;
  transitionToScene: (sceneId: string) => void;
  makeChoice: (choice: Choice) => void;
  processBattlePhase: () => { isComplete: boolean; attack?: typeof BATTLE_ATTACKS[number]; newHealth?: Health };
  completeBattle: () => void;
  resetBattle: () => void;
  resetGame: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  currentSceneId: 'intro',
  dialogueIndex: 0,
  showChoices: false,
  showBattle: false,
  path: null as GamePath,
  health: { ...INITIAL_HEALTH },
  battlePhase: 0,
};

// ============================================================================
// STORE
// ============================================================================

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Computed
        getCurrentScene: () => SCENES[get().currentSceneId],

        getCurrentDialogue: () => {
          const scene = SCENES[get().currentSceneId];
          return scene?.dialogues[get().dialogueIndex] || null;
        },

        isLastDialogue: () => {
          const scene = SCENES[get().currentSceneId];
          return get().dialogueIndex === scene?.dialogues.length - 1;
        },

        // Actions
        nextDialogue: () => {
          const state = get();
          const scene = SCENES[state.currentSceneId];

          if (state.dialogueIndex < scene.dialogues.length - 1) {
            set({ dialogueIndex: state.dialogueIndex + 1 }, false, 'nextDialogue');
          } else if (scene.isBattle) {
            set({ showBattle: true }, false, 'showBattle');
          } else if (scene.choices) {
            set({ showChoices: true }, false, 'showChoices');
          } else if (scene.nextScene) {
            get().transitionToScene(scene.nextScene);
          }
        },

        transitionToScene: (sceneId) => {
          set({
            currentSceneId: sceneId,
            dialogueIndex: 0,
            showChoices: false,
            showBattle: false,
          }, false, 'transitionToScene');
        },

        makeChoice: (choice) => {
          const updates: Partial<GameState> = {
            currentSceneId: choice.nextScene,
            dialogueIndex: 0,
            showChoices: false,
            showBattle: false,
          };

          if (choice.nextScene === 'windows_path') {
            updates.path = 'windows';
          } else if (choice.nextScene === 'linux_path') {
            updates.path = 'linux';
          }

          set(updates as GameState, false, 'makeChoice');
        },

        processBattlePhase: () => {
          const { battlePhase, health } = get();

          if (battlePhase >= BATTLE_ATTACKS.length) {
            return { isComplete: true };
          }

          const attack = BATTLE_ATTACKS[battlePhase];
          const newHealth = { ...health };

          if (attack.type === 'tux') {
            newHealth.omega = Math.max(0, health.omega - attack.damage);
            if (attack.heal) {
              newHealth.tux = Math.min(100, health.tux + attack.heal);
            }
          } else {
            newHealth.tux = Math.max(0, health.tux - attack.damage);
          }

          set({
            health: newHealth,
            battlePhase: battlePhase + 1,
          }, false, 'processBattlePhase');

          return {
            isComplete: false,
            attack,
            newHealth,
          };
        },

        completeBattle: () => {
          const scene = SCENES[get().currentSceneId];
          if (scene.nextScene) {
            get().transitionToScene(scene.nextScene);
          }
        },

        resetBattle: () => {
          set({
            health: { ...INITIAL_HEALTH },
            battlePhase: 0,
          }, false, 'resetBattle');
        },

        resetGame: () => {
          set(initialState, false, 'resetGame');
        },
      }),
      { name: 'tux-game-store' }
    ),
    { name: 'game-store' }
  )
);

// ============================================================================
// SELECTOR HOOKS - Optimized re-renders
// ============================================================================

export const useCurrentScene = () => useGameStore((state) => SCENES[state.currentSceneId]);
export const useDialogueIndex = () => useGameStore((state) => state.dialogueIndex);
export const useShowChoices = () => useGameStore((state) => state.showChoices);
export const useShowBattle = () => useGameStore((state) => state.showBattle);
export const usePath = () => useGameStore((state) => state.path);
export const useHealth = () => useGameStore((state) => state.health);
export const useBattlePhase = () => useGameStore((state) => state.battlePhase);

// Actions - accessed directly from store (stable references)
export const getGameActions = () => ({
  nextDialogue: useGameStore.getState().nextDialogue,
  makeChoice: useGameStore.getState().makeChoice,
  transitionToScene: useGameStore.getState().transitionToScene,
  processBattlePhase: useGameStore.getState().processBattlePhase,
  completeBattle: useGameStore.getState().completeBattle,
  resetGame: useGameStore.getState().resetGame,
});

// Hook version with useMemo for stable reference
export const useGameActions = () => {
  return useMemo(() => getGameActions(), []);
};
