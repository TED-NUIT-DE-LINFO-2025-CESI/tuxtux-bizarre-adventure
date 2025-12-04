import { z } from 'zod';

export const EmotionTypeSchema = z.enum([
  'neutral',
  'happy',
  'sad',
  'angry',
  'surprised',
  'determined',
  'smirk',
  'worried',
]);

export const CharacterPositionSchema = z.enum([
  'left',
  'center',
  'right',
  'far-left',
  'far-right',
]);

export const CharacterSpriteSchema = z.object({
  characterId: z.string(),
  emotion: EmotionTypeSchema,
  position: CharacterPositionSchema,
  isActive: z.boolean().optional(),
  enterAnimation: z.enum(['fade', 'slide-left', 'slide-right', 'bounce']).optional(),
  exitAnimation: z.enum(['fade', 'slide-left', 'slide-right']).optional(),
});

export const CharacterDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  color: z.string(),
  sprites: z.record(z.string(), z.string()),
});

// Inferred types
export type EmotionType = z.infer<typeof EmotionTypeSchema>;
export type CharacterPosition = z.infer<typeof CharacterPositionSchema>;
export type CharacterSprite = z.infer<typeof CharacterSpriteSchema>;
export type CharacterDefinition = z.infer<typeof CharacterDefinitionSchema>;
