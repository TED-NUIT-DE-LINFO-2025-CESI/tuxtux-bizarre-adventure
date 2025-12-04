import { motion, AnimatePresence } from 'motion/react';
import { TypewriterText } from './TypewriterText';
import { dialogueBoxVariants, nameTagVariants } from '../../animations/variants';
import type { DialogueLine, CharacterDefinition } from '../../types';
import './DialogueBox.css';

interface DialogueBoxProps {
  dialogue: DialogueLine | null;
  characters: CharacterDefinition[];
  onAdvance: () => void;
}

export const DialogueBox = ({ dialogue, characters, onAdvance }: DialogueBoxProps) => {
  if (!dialogue) return null;

  const character = dialogue.characterId
    ? characters.find((c) => c.id === dialogue.characterId)
    : null;

  const isNarration = !dialogue.characterId;

  return (
    <AnimatePresence>
      <motion.div
        className={`dialogue-box ${isNarration ? 'dialogue-box--narration' : ''}`}
        variants={dialogueBoxVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onAdvance}
      >
        {character && (
          <motion.div
            className="dialogue-box__name"
            variants={nameTagVariants}
            initial="hidden"
            animate="visible"
            style={{ color: character.color }}
          >
            {character.displayName}
          </motion.div>
        )}
        <div className="dialogue-box__text">
          <TypewriterText text={dialogue.text} />
        </div>
        <div className="dialogue-box__indicator">
          <span className="dialogue-box__arrow">▼</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
