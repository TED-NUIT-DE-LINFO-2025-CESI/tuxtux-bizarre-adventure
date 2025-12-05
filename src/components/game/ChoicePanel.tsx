import { memo } from 'react';
import { motion } from 'motion/react';
import type { Choice } from '../../data/scenes';

interface ChoicePanelProps {
  choices: Choice[];
  onChoice: (choice: Choice) => void;
}

export const ChoicePanel = memo(({ choices, onChoice }: ChoicePanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-4"
    >
        <img src=""/>
      <h3 className="text-center text-gray-400 text-lg mb-6">
        Faites votre choix...
      </h3>

      {choices.map((choice, index) => (
        <motion.button
          key={choice.nextScene}
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, x: 10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChoice(choice)}
          className={`
            w-full p-5 text-left rounded-xl cursor-pointer
            bg-gray-900/80 border-2 border-gray-600
            hover:border-yellow-500 hover:bg-gray-800/90
            transition-colors group
          `}
        >
          <div className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">
            {choice.text}
          </div>
          {choice.consequence && (
            <div className="text-sm text-gray-400 mt-2 italic">
              {choice.consequence}
            </div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
});

ChoicePanel.displayName = 'ChoicePanel';
