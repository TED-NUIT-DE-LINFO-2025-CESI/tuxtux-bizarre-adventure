import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GamePath,
  GameFlags,
  ChoiceHistoryEntry,
  DialogueHistoryEntry,
  GameScreen,
  Scene,
  DialogueLine,
  Choice,
  CharacterSprite,
  EmotionType,
} from '../schemas';

interface GameState {
  // Navigation
  currentScreen: GameScreen;

  // Story Progress
  currentPath: GamePath;
  currentSceneId: string;
  currentDialogueIndex: number;
  currentScene: Scene | null;

  // Character Display
  visibleCharacters: CharacterSprite[];

  // Dialogue State
  currentDialogue: DialogueLine | null;
  isTextComplete: boolean;
  isAutoPlay: boolean;
  isSkipping: boolean;

  // Choices
  availableChoices: Choice[] | null;
  isShowingChoices: boolean;

  // Flags & Variables
  flags: GameFlags;

  // History
  choiceHistory: ChoiceHistoryEntry[];
  dialogueHistory: DialogueHistoryEntry[];

  // Session
  playtime: number;
  isPaused: boolean;

  // Actions
  setScreen: (screen: GameScreen) => void;

  // Scene Management
  setCurrentScene: (scene: Scene) => void;

  // Dialogue Progression
  advanceDialogue: () => void;
  setTextComplete: (complete: boolean) => void;
  skipToEnd: () => void;

  // Character Management
  showCharacter: (sprite: CharacterSprite) => void;
  hideCharacter: (characterId: string) => void;
  updateCharacterEmotion: (characterId: string, emotion: EmotionType) => void;
  clearCharacters: () => void;

  // Choice System
  showChoices: (choices: Choice[]) => void;
  selectChoice: (choice: Choice) => void;
  hideChoices: () => void;

  // Flag Management
  setFlag: (key: string, value: boolean | number | string) => void;
  getFlag: (key: string) => boolean | number | string | undefined;

  // Path Selection
  selectPath: (path: GamePath) => void;

  // History
  addToDialogueHistory: (entry: DialogueHistoryEntry) => void;
  addToChoiceHistory: (entry: ChoiceHistoryEntry) => void;

  // Auto/Skip
  toggleAutoPlay: () => void;
  toggleSkip: () => void;

  // Game Control
  startNewGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;

  // Playtime
  incrementPlaytime: () => void;
}

const initialState = {
  currentScreen: 'main-menu' as GameScreen,
  currentPath: null as GamePath,
  currentSceneId: 'intro',
  currentDialogueIndex: 0,
  currentScene: null as Scene | null,
  visibleCharacters: [] as CharacterSprite[],
  currentDialogue: null as DialogueLine | null,
  isTextComplete: false,
  isAutoPlay: false,
  isSkipping: false,
  availableChoices: null as Choice[] | null,
  isShowingChoices: false,
  flags: {} as GameFlags,
  choiceHistory: [] as ChoiceHistoryEntry[],
  dialogueHistory: [] as DialogueHistoryEntry[],
  playtime: 0,
  isPaused: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: (screen) => set({ currentScreen: screen }),

      setCurrentScene: (scene) =>
        set({
          currentScene: scene,
          currentSceneId: scene.id,
          currentDialogueIndex: 0,
          currentDialogue: scene.dialogue[0] || null,
          isTextComplete: false,
          isShowingChoices: false,
          availableChoices: null,
          visibleCharacters: scene.characters
            .filter((c) => c.visible)
            .map((c) => ({
              characterId: c.characterId,
              emotion: c.emotion,
              position: c.position,
              isActive: false,
            })),
        }),

      advanceDialogue: () => {
        const { currentScene, currentDialogueIndex, isTextComplete } = get();

        if (!isTextComplete) {
          set({ isTextComplete: true });
          return;
        }

        if (!currentScene) return;

        const nextIndex = currentDialogueIndex + 1;

        if (nextIndex >= currentScene.dialogue.length) {
          if (currentScene.choices && currentScene.choices.length > 0) {
            set({
              isShowingChoices: true,
              availableChoices: currentScene.choices,
            });
          }
        } else {
          const nextDialogue = currentScene.dialogue[nextIndex];
          set({
            currentDialogueIndex: nextIndex,
            currentDialogue: nextDialogue,
            isTextComplete: false,
          });

          // Update active character
          if (nextDialogue.characterId) {
            const characters = get().visibleCharacters.map((c) => ({
              ...c,
              isActive: c.characterId === nextDialogue.characterId,
            }));
            set({ visibleCharacters: characters });

            // Update emotion if specified
            if (nextDialogue.emotion) {
              get().updateCharacterEmotion(
                nextDialogue.characterId,
                nextDialogue.emotion
              );
            }
          }
        }
      },

      setTextComplete: (complete) => set({ isTextComplete: complete }),

      skipToEnd: () => set({ isTextComplete: true }),

      showCharacter: (sprite) =>
        set((state) => ({
          visibleCharacters: [
            ...state.visibleCharacters.filter(
              (c) => c.characterId !== sprite.characterId
            ),
            sprite,
          ],
        })),

      hideCharacter: (characterId) =>
        set((state) => ({
          visibleCharacters: state.visibleCharacters.filter(
            (c) => c.characterId !== characterId
          ),
        })),

      updateCharacterEmotion: (characterId, emotion) =>
        set((state) => ({
          visibleCharacters: state.visibleCharacters.map((c) =>
            c.characterId === characterId ? { ...c, emotion } : c
          ),
        })),

      clearCharacters: () => set({ visibleCharacters: [] }),

      showChoices: (choices) =>
        set({
          availableChoices: choices,
          isShowingChoices: true,
        }),

      selectChoice: (choice) => {
        const { currentSceneId } = get();

        get().addToChoiceHistory({
          sceneId: currentSceneId,
          choiceId: choice.id,
          timestamp: Date.now(),
        });

        if (choice.setFlags) {
          Object.entries(choice.setFlags).forEach(([key, value]) => {
            get().setFlag(key, value);
          });
        }

        set({ isShowingChoices: false, availableChoices: null });
      },

      hideChoices: () =>
        set({ isShowingChoices: false, availableChoices: null }),

      setFlag: (key, value) =>
        set((state) => ({
          flags: { ...state.flags, [key]: value },
        })),

      getFlag: (key) => get().flags[key],

      selectPath: (path) =>
        set({
          currentPath: path,
          flags: { ...get().flags, selectedPath: path || '' },
        }),

      addToDialogueHistory: (entry) =>
        set((state) => ({
          dialogueHistory: [...state.dialogueHistory, entry].slice(-100),
        })),

      addToChoiceHistory: (entry) =>
        set((state) => ({
          choiceHistory: [...state.choiceHistory, entry],
        })),

      toggleAutoPlay: () =>
        set((state) => ({
          isAutoPlay: !state.isAutoPlay,
          isSkipping: false,
        })),

      toggleSkip: () =>
        set((state) => ({
          isSkipping: !state.isSkipping,
          isAutoPlay: false,
        })),

      startNewGame: () =>
        set({
          ...initialState,
          currentScreen: 'game',
        }),

      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),

      resetGame: () => set(initialState),

      incrementPlaytime: () =>
        set((state) => ({
          playtime: state.playtime + 1,
        })),
    }),
    {
      name: 'tux-adventure-game',
      partialize: (state) => ({
        currentPath: state.currentPath,
        currentSceneId: state.currentSceneId,
        flags: state.flags,
        choiceHistory: state.choiceHistory,
        playtime: state.playtime,
      }),
    }
  )
);
