import { z } from 'zod';
import { EmotionTypeSchema, CharacterPositionSchema } from './character.schema';

export const DialogueLineSchema = z.object({
  id: z.string(),
  characterId: z.string().nullable(),
  emotion: EmotionTypeSchema.optional(),
  text: z.string(),
  voiceFile: z.string().optional(),
  autoAdvance: z.boolean().optional(),
  autoAdvanceDelay: z.number().optional(),
});

export const GameConditionSchema = z.object({
  type: z.enum(['flag', 'variable', 'path']),
  key: z.string(),
  operator: z.enum(['==', '!=', '>', '<', '>=', '<=']),
  value: z.union([z.boolean(), z.number(), z.string()]),
});

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  nextSceneId: z.string(),
  condition: GameConditionSchema.optional(),
  setFlags: z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])).optional(),
  disabled: z.boolean().optional(),
  disabledReason: z.string().optional(),
});

export const SceneCharacterStateSchema = z.object({
  characterId: z.string(),
  position: CharacterPositionSchema,
  emotion: EmotionTypeSchema,
  visible: z.boolean(),
});

export const SceneEventSchema = z.object({
  type: z.enum(['setFlag', 'playSound', 'shake', 'flash', 'fadeOut', 'fadeIn', 'wait']),
  params: z.record(z.string(), z.unknown()),
});

export const SceneSchema = z.object({
  id: z.string(),
  background: z.string(),
  bgm: z.string().optional(),
  ambientSfx: z.string().optional(),
  characters: z.array(SceneCharacterStateSchema),
  dialogue: z.array(DialogueLineSchema),
  choices: z.array(ChoiceSchema).optional(),
  nextSceneId: z.string().optional(),
  onEnter: z.array(SceneEventSchema).optional(),
  onExit: z.array(SceneEventSchema).optional(),
});

export const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  path: z.enum(['windows', 'linux', 'common']),
  scenes: z.array(SceneSchema),
});

// Inferred types
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type GameCondition = z.infer<typeof GameConditionSchema>;
export type Choice = z.infer<typeof ChoiceSchema>;
export type SceneCharacterState = z.infer<typeof SceneCharacterStateSchema>;
export type SceneEvent = z.infer<typeof SceneEventSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
