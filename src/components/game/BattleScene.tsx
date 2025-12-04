import { memo, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BATTLE_ATTACKS, type BattleAttack } from '../../data/scenes';
import { HealthBar } from './HealthBar';

interface Health {
  tux: number;
  omega: number;
}

interface BattleSceneProps {
  health: Health;
  onProcessPhase: () => { isComplete: boolean; attack?: BattleAttack; newHealth?: Health };
  onVictory: () => void;
}

const AttackDisplay = memo(({ attack }: { attack: BattleAttack }) => {
  const isTux = attack.type === 'tux';

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`
        text-2xl md:text-3xl font-bold p-6 rounded-xl text-center
        ${isTux
          ? 'bg-green-900/50 text-green-400 border border-green-500'
          : 'bg-red-900/50 text-red-400 border border-red-500'
        }
      `}
    >
      <div className="text-4xl mb-2">{isTux ? '🐧' : '💀'}</div>
      <div>{attack.name}</div>
      <div className="flex justify-center gap-4 mt-3 text-xl">
        {attack.damage > 0 && (
          <span className={isTux ? 'text-green-300' : 'text-red-300'}>
            -{attack.damage} HP
          </span>
        )}
        {attack.heal && (
          <span className="text-emerald-300">+{attack.heal} Heal</span>
        )}
      </div>
    </motion.div>
  );
});

AttackDisplay.displayName = 'AttackDisplay';

const VictoryBanner = memo(() => (
  <motion.div
    initial={{ scale: 0, rotate: -10 }}
    animate={{ scale: 1, rotate: 0 }}
    className="text-center"
  >
    <div className="text-6xl mb-4">🎉🐧🎉</div>
    <div className="text-4xl font-bold text-green-400">VICTOIRE !</div>
    <div className="text-xl text-gray-400 mt-2">Le monde est libre</div>
  </motion.div>
));

VictoryBanner.displayName = 'VictoryBanner';

export const BattleScene = memo(({ health, onProcessPhase, onVictory }: BattleSceneProps) => {
  const [phase, setPhase] = useState(0);
  const [currentAttack, setCurrentAttack] = useState<BattleAttack | null>(null);
  const [isVictory, setIsVictory] = useState(false);

  const processNextPhase = useCallback(() => {
    if (phase >= BATTLE_ATTACKS.length) {
      setIsVictory(true);
      setTimeout(onVictory, 2000);
      return;
    }

    const result = onProcessPhase();
    if (result.attack) {
      setCurrentAttack(result.attack);
    }
    setPhase((p) => p + 1);
  }, [phase, onProcessPhase, onVictory]);

  useEffect(() => {
    const timer = setTimeout(processNextPhase, 1500);
    return () => clearTimeout(timer);
  }, [phase, processNextPhase]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-8 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Title */}
      <motion.h2
        className="text-3xl font-bold text-red-500"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        ⚔️ COMBAT FINAL ⚔️
      </motion.h2>

      {/* Health Bars */}
      <div className="w-full max-w-xl space-y-4">
        <HealthBar
          value={health.tux}
          maxValue={100}
          avatar="🐧"
          label="Tux"
          variant="green"
        />
        <HealthBar
          value={health.omega}
          maxValue={100}
          avatar="💀"
          label="Microsoft Omega"
          variant="red"
        />
      </div>

      {/* Attack Display */}
      <div className="h-40 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentAttack && !isVictory && (
            <AttackDisplay key={phase} attack={currentAttack} />
          )}
          {isVictory && <VictoryBanner key="victory" />}
        </AnimatePresence>
      </div>

      {/* Progress */}
      <div className="text-gray-500 text-sm">
        Phase {Math.min(phase, BATTLE_ATTACKS.length)} / {BATTLE_ATTACKS.length}
      </div>
    </motion.div>
  );
});

BattleScene.displayName = 'BattleScene';
