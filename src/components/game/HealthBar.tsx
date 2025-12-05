import { memo } from 'react';
import { motion } from 'motion/react';

interface HealthBarProps {
  value: number;
  maxValue: number;
  avatar: string;
  label: string;
  variant: 'green' | 'red';
}

export const HealthBar = memo(({ value, maxValue, avatar, label, variant }: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (value / maxValue) * 100));

  const barColor = variant === 'green'
    ? 'bg-gradient-to-r from-green-600 to-emerald-400'
    : 'bg-gradient-to-r from-red-600 to-rose-400';

  const bgColor = variant === 'green'
    ? 'bg-green-950'
    : 'bg-red-950';

  return (
    <div className="flex items-center gap-4">
      {/* Avatar */}
      <div className="text-3xl">{avatar}</div>

      {/* Bar container */}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300 font-medium">{label}</span>
          <span className={variant === 'green' ? 'text-green-400' : 'text-red-400'}>
            {value} / {maxValue}
          </span>
        </div>

        <div className={`h-6 rounded-full overflow-hidden ${bgColor} border border-gray-700`}>
          <motion.div
            className={`h-full ${barColor} rounded-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
});

HealthBar.displayName = 'HealthBar';
