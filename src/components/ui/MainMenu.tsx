import { motion } from 'motion/react';
import { useGameStore } from '../../stores';
import { menuPanelVariants } from '../../animations/variants';
import './MainMenu.css';

export const MainMenu = () => {
  const { startNewGame, setScreen } = useGameStore();

  return (
    <div className="main-menu">
      <div className="main-menu__background" />

      <motion.div
        className="main-menu__content"
        variants={menuPanelVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="main-menu__title">
          <span className="main-menu__title-tux">TUX</span>
          <span className="main-menu__title-sub">Bizarre Adventure</span>
        </h1>

        <div className="main-menu__subtitle">
          Linux vs Windows - Le Combat Final
        </div>

        <div className="main-menu__buttons">
          <motion.button
            className="main-menu__button main-menu__button--primary"
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewGame}
          >
            Nouvelle Partie
          </motion.button>

          <motion.button
            className="main-menu__button"
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('load')}
          >
            Continuer
          </motion.button>

          <motion.button
            className="main-menu__button"
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('settings')}
          >
            Options
          </motion.button>
        </div>

        <div className="main-menu__footer">
          Nuit de l'Info 2024 - TED CESI
        </div>
      </motion.div>
    </div>
  );
};
