import { memo, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useCurrentScene, useDialogueIndex } from '../../stores';
import { Typewriter } from './Typewriter';

interface DialogueBoxProps {
  onNext: () => void;
}

const speakerColors: Record<string, string> = {
  narrator: 'text-gray-400',
  player: 'text-cyan-400',
  tux: 'text-yellow-400',
  clippy: 'text-blue-400',
  gates: 'text-red-500',
  linus: 'text-green-400',
  student: 'text-purple-400',
  systemd: 'text-orange-500',
};

const speakerNames: Record<string, string> = {
  narrator: '',
  player: 'Vous',
  tux: '🐧 Tux',
  clippy: '📎 Clippy',
  gates: '💀 Microsoft Omega',
  linus: '🧔 Linus Torvalds',
  student: '👤 Etudiant',
  systemd: '⚙️ SystemD',
};

export const DialogueBox = memo(({ onNext }: DialogueBoxProps) => {
  const scene = useCurrentScene();
  const dialogueIndex = useDialogueIndex();
  const dialogue = scene?.dialogues[dialogueIndex] || null;
  const isLast = dialogueIndex === (scene?.dialogues.length ?? 0) - 1;

  const handleClick = useCallback(() => {
    onNext();
  }, [onNext]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      onNext();
    }
  }, [onNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!dialogue) return null;

  const isNarrator = dialogue.speaker === 'narrator';
  const speakerName = speakerNames[dialogue.speaker] || dialogue.speaker;
  const speakerColor = speakerColors[dialogue.speaker] || 'text-white';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={`
        relative p-6 rounded-xl cursor-pointer select-none
        ${isNarrator
          ? 'bg-black/60 border border-gray-700 italic'
          : 'bg-gray-900/80 border-2 border-gray-600'
        }
        hover:border-yellow-500/50 transition-colors
      `}
    >
      {/* Speaker name */}
      {!isNarrator && speakerName && (
        <div className={`text-sm font-bold mb-2 ${speakerColor}`}>
          {speakerName}
        </div>
      )}

      {/* Dialogue text */}
      <div className={`text-lg leading-relaxed ${isNarrator ? 'text-gray-300' : 'text-white'}`}>
        <Typewriter text={dialogue.text} speed={30} />
      </div>

      {/* Continue indicator */}
      <motion.div
        className="absolute bottom-3 right-4 text-gray-500"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {isLast ? '[ Fin du dialogue ]' : '▼'}
      </motion.div>
    </motion.div>
  );
});

DialogueBox.displayName = 'DialogueBox';
