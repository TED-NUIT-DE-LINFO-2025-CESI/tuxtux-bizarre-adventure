import { useState, useEffect, useCallback } from 'react';
import { useSettingsStore } from '../stores';
import { textSpeedToDelay } from '../animations/variants';

interface UseTypewriterOptions {
  text: string;
  onComplete?: () => void;
}

export const useTypewriter = ({ text, onComplete }: UseTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const textSpeed = useSettingsStore((state) => state.textSpeed);

  const skip = useCallback(() => {
    setDisplayedText(text);
    setIsComplete(true);
    onComplete?.();
  }, [text, onComplete]);

  const reset = useCallback(() => {
    setDisplayedText('');
    setIsComplete(false);
  }, []);

  useEffect(() => {
    reset();

    if (!text) {
      setIsComplete(true);
      return;
    }

    const delay = textSpeedToDelay(textSpeed);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        const char = text[currentIndex];
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;

        // Pause on punctuation
        if (['.', '!', '?', ','].includes(char)) {
          clearInterval(interval);
          setTimeout(() => {
            const newInterval = setInterval(() => {
              if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
              } else {
                clearInterval(newInterval);
                setIsComplete(true);
                onComplete?.();
              }
            }, delay);
          }, char === ',' ? delay * 2 : delay * 4);
        }
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, textSpeed, onComplete, reset]);

  return { displayedText, isComplete, skip, reset };
};
