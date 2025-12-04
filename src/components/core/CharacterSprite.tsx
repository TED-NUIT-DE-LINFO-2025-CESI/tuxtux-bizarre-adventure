import { motion } from 'motion/react';
import { characterVariants, characterEnterVariants } from '../../animations/variants';
import type { CharacterSprite as CharacterSpriteType, CharacterDefinition } from '../../types';
import './CharacterSprite.css';

interface CharacterSpriteProps {
  sprite: CharacterSpriteType;
  character: CharacterDefinition;
}

export const CharacterSprite = ({ sprite, character }: CharacterSpriteProps) => {
  const enterAnimation = sprite.enterAnimation || 'fade';
  const variants = characterEnterVariants[enterAnimation];
  const imageSrc = character.sprites[sprite.emotion] || character.sprites.neutral;

  if (!imageSrc) return null;

  return (
    <motion.div
      className={`character-sprite character-sprite--${sprite.position}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.img
        src={imageSrc}
        alt={character.name}
        className="character-sprite__image"
        variants={characterVariants}
        animate={sprite.isActive ? 'speaking' : 'idle'}
      />
    </motion.div>
  );
};
