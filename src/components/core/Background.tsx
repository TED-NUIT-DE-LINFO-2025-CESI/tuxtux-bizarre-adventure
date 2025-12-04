import { motion, AnimatePresence } from 'motion/react';
import { backgroundVariants } from '../../animations/variants';
import './Background.css';

interface BackgroundProps {
  src: string;
  alt?: string;
}

export const Background = ({ src, alt = 'Background' }: BackgroundProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={src}
        className="background"
        variants={backgroundVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <img src={src} alt={alt} className="background__image" />
        <div className="background__overlay" />
      </motion.div>
    </AnimatePresence>
  );
};
