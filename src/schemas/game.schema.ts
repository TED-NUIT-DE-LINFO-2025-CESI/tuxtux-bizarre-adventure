import { z } from 'zod';

export const GamePathSchema = z.enum(['windows', 'linux']).nullable();

export const GameScreenSchema = z.enum([
  'main-menu',
  'game',
  'save',
  'load',
  'settings',
  'history',
  'battle',
]);

export const GameFlagsSchema = z.record(
  z.string(),
  z.union([z.boolean(), z.number(), z.string()])
);

export const ChoiceHistoryEntrySchema = z.object({
  sceneId: z.string(),
  choiceId: z.string(),
  timestamp: z.number(),
});

export const DialogueHistoryEntrySchema = z.object({
  characterId: z.string().nullable(),
  characterName: z.string(),
  text: z.string(),
  sceneId: z.string(),
});

export const GameProgressSchema = z.object({
  currentPath: GamePathSchema,
  currentSceneId: z.string(),
  currentDialogueIndex: z.number(),
  flags: GameFlagsSchema,
  choiceHistory: z.array(ChoiceHistoryEntrySchema),
  dialogueHistory: z.array(DialogueHistoryEntrySchema),
  playtime: z.number(),
});

export const SaveDataSchema = z.object({
  id: z.string(),
  slotNumber: z.number(),
  timestamp: z.number(),
  progress: GameProgressSchema,
  thumbnailUrl: z.string().optional(),
  sceneName: z.string(),
  playTime: z.number(),
  path: GamePathSchema,
});

export const SaveSlotInfoSchema = z.object({
  slotNumber: z.number(),
  isEmpty: z.boolean(),
  saveData: SaveDataSchema.optional(),
});

export const GameSettingsSchema = z.object({
  textSpeed: z.number().min(1).max(10),
  autoPlaySpeed: z.number().min(1).max(10),
  masterVolume: z.number().min(0).max(100),
  bgmVolume: z.number().min(0).max(100),
  sfxVolume: z.number().min(0).max(100),
  voiceVolume: z.number().min(0).max(100),
  fullscreen: z.boolean(),
  skipUnread: z.boolean(),
  showQuickMenu: z.boolean(),
});

// Inferred types
export type GamePath = z.infer<typeof GamePathSchema>;
export type GameScreen = z.infer<typeof GameScreenSchema>;
export type GameFlags = z.infer<typeof GameFlagsSchema>;
export type ChoiceHistoryEntry = z.infer<typeof ChoiceHistoryEntrySchema>;
export type DialogueHistoryEntry = z.infer<typeof DialogueHistoryEntrySchema>;
export type GameProgress = z.infer<typeof GameProgressSchema>;
export type SaveData = z.infer<typeof SaveDataSchema>;
export type SaveSlotInfo = z.infer<typeof SaveSlotInfoSchema>;
export type GameSettings = z.infer<typeof GameSettingsSchema>;
