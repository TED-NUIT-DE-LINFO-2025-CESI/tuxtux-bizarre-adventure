import { motion, AnimatePresence } from 'motion/react';
import { choiceMenuVariants, choiceButtonVariants } from '../../animations/variants';
import type { Choice } from '../../types';
import './ChoiceMenu.css';

interface ChoiceMenuProps {
  choices: Choice[];
  onSelect: (choice: Choice) => void;
}

export const ChoiceMenu = ({ choices, onSelect }: ChoiceMenuProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="choice-menu"
        variants={choiceMenuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {choices.map((choice) => (
          <motion.button
            key={choice.id}
            className={`choice-menu__button ${choice.disabled ? 'choice-menu__button--disabled' : ''}`}
            variants={choiceButtonVariants}
            whileHover={!choice.disabled ? 'hover' : undefined}
            whileTap={!choice.disabled ? 'tap' : undefined}
            onClick={() => !choice.disabled && onSelect(choice)}
            disabled={choice.disabled}
          >
            <span className="choice-menu__text">{choice.text}</span>
            {choice.disabled && choice.disabledReason && (
              <span className="choice-menu__reason">{choice.disabledReason}</span>
            )}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
