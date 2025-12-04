import { useTypewriter } from '../../hooks';
import { useGameStore } from '../../stores';
import { useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
}

export const TypewriterText = ({ text, className = '' }: TypewriterTextProps) => {
  const setTextComplete = useGameStore((state) => state.setTextComplete);
  const { displayedText, isComplete, skip } = useTypewriter({
    text,
    onComplete: () => setTextComplete(true),
  });

  useEffect(() => {
    setTextComplete(isComplete);
  }, [isComplete, setTextComplete]);

  const handleClick = () => {
    if (!isComplete) {
      skip();
    }
  };

  return (
    <span className={className} onClick={handleClick}>
      {displayedText}
      {!isComplete && <span className="cursor">|</span>}
    </span>
  );
};
