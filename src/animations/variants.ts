import type { Variants } from 'motion/react';

// Background Animations
export const backgroundVariants: Variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeIn' },
  },
};

// Character Animations
export const characterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
  speaking: {
    scale: 1.02,
    filter: 'brightness(1.1)',
    transition: {
      duration: 0.3,
    },
  },
  idle: {
    scale: 1,
    filter: 'brightness(0.85)',
    transition: {
      duration: 0.3,
    },
  },
};

export const characterEnterVariants: Record<string, Variants> = {
  'slide-left': {
    hidden: { x: -200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  'slide-right': {
    hidden: { x: 200, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  },
  bounce: {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

// Dialogue Box Animations
export const dialogueBoxVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    y: 50,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export const nameTagVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: 0.1 },
  },
};

// Choice Menu Animations
export const choiceMenuVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const choiceButtonVariants: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  hover: {
    scale: 1.05,
    x: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
  },
};

// Menu Animations
export const menuOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const menuPanelVariants: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Fade effect
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

// Text speed helper
export const textSpeedToDelay = (textSpeed: number): number => {
  const minDelay = 10;
  const maxDelay = 100;
  return maxDelay - ((textSpeed - 1) / 9) * (maxDelay - minDelay);
};
