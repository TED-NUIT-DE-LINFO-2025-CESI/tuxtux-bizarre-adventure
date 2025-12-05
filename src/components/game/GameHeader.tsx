import { memo } from 'react';
import { motion } from 'motion/react';

interface GameHeaderProps {
  title: string;
  path: 'windows' | 'linux' | null;
  isChaos: boolean;
}

export const GameHeader = memo(({ title, path, isChaos }: GameHeaderProps) => {
  const pathIcon = path === 'windows' ? '💠' : path === 'linux' ? '🐧' : '⚡';
  const pathColor = path === 'windows'
    ? 'text-blue-400'
    : path === 'linux'
    ? 'text-green-400'
    : 'text-yellow-400';

  return (
    <header className="p-6 flex items-center justify-between">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <span className="text-3xl">{pathIcon}</span>
        <div>
          <h1 className={`text-xl font-bold ${pathColor}`}>
            TUX's Bizarre Adventure
          </h1>
          <p className="text-sm text-gray-400">Linux vs Windows</p>
        </div>
      </motion.div>

      {/* Scene Title */}
      <motion.div
        key={title}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-right ${isChaos ? 'animate-pulse' : ''}`}
      >
        <h2 className={`text-lg font-semibold ${isChaos ? 'text-red-400' : 'text-white'}`}>
          {title}
        </h2>
        {path && (
          <p className={`text-sm ${pathColor}`}>
            Chemin {path === 'windows' ? 'Windows' : 'Linux'}
          </p>
        )}
      </motion.div>
    </header>
  );
});

GameHeader.displayName = 'GameHeader';
