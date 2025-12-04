import { memo } from 'react';
import { motion } from 'motion/react';
import type { Atmosphere } from '../../data/scenes';

interface SceneBackgroundProps {
  atmosphere: Atmosphere;
}

const atmosphereStyles: Record<Atmosphere, string> = {
  neutral: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  windows: 'bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950',
  linux: 'bg-gradient-to-br from-green-950 via-emerald-900 to-green-950',
  chaos: 'bg-gradient-to-br from-red-950 via-purple-900 to-red-950',
  victory: 'bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-900',
};

export const SceneBackground = memo(({ atmosphere }: SceneBackgroundProps) => {
  const isChaos = atmosphere === 'chaos';

  return (
    <motion.div
      key={atmosphere}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`absolute inset-0 ${atmosphereStyles[atmosphere]}`}
    >
      {/* Animated particles/stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isChaos ? 'bg-red-500' : 'bg-white'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Chaos glitch effect */}
      {isChaos && (
        <motion.div
          className="absolute inset-0 bg-red-500/10"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
    </motion.div>
  );
});

SceneBackground.displayName = 'SceneBackground';
