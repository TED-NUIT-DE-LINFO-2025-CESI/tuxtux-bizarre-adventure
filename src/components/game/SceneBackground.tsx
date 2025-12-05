import { memo } from 'react';
import { motion } from 'motion/react';
import type { Atmosphere } from '../../data/scenes';

const BASE = import.meta.env.BASE_URL;

interface SceneBackgroundProps {
    atmosphere: Atmosphere;
    customBg?: string;
    enableSelection?: boolean;
    onChoose?: (side: 'linux' | 'windows') => void;
}

// Couleurs de secours si l'image plante
const bgColors: Record<Atmosphere, string> = {
    neutral: 'bg-gray-900',
    windows: 'bg-blue-900',
    linux: 'bg-green-800',
    chaos: 'bg-red-900',
    victory: 'bg-yellow-700',
};

export const SceneBackground = memo(({ atmosphere, customBg, enableSelection = false, onChoose }: SceneBackgroundProps) => {

    // Affiche le Split Screen SEULEMENT si c'est l'intro et qu'on doit choisir
    const showSplitScreen = atmosphere === 'neutral' && enableSelection;

    // Si on a une image custom (et qu'on n'est pas en train de choisir dans l'intro)
    if (!showSplitScreen && customBg) {
        return (
            <motion.div
                key="custom-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat ${bgColors[atmosphere]}`}
                style={{ backgroundImage: `url('${customBg.startsWith('/') ? BASE + customBg.slice(1) : customBg}')` }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>
        );
    }

    // Si pas d'image et pas de split screen -> Couleur unie (Fallback)
    if (!showSplitScreen && !customBg) {
        return (
            <motion.div
                key="color-bg"
                className={`absolute inset-0 w-full h-full ${bgColors[atmosphere]}`}
            />
        );
    }

    // Sinon -> Split Screen (Intro Choix)
    return (
        <motion.div
            key="split-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex w-full h-full"
        >
            <div
                onClick={(e) => { e.stopPropagation(); onChoose?.('linux'); }}
                className={`relative w-1/2 h-full bg-green-900 bg-cover bg-center border-r border-black/50 ${enableSelection ? 'cursor-pointer hover:brightness-110' : ''}`}
                style={{ backgroundImage: `url('${BASE}backgrounds/linux.png')` }}
            >
                {enableSelection && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-green-400 font-bold text-2xl border-2 border-green-400 px-4 py-2 rounded">LINUX</span>
                    </div>
                )}
            </div>

            <div
                onClick={(e) => { e.stopPropagation(); onChoose?.('windows'); }}
                className={`relative w-1/2 h-full bg-blue-900 bg-cover bg-center border-l border-black/50 ${enableSelection ? 'cursor-pointer hover:brightness-110' : ''}`}
                style={{ backgroundImage: `url('${BASE}backgrounds/windows.png')` }}
            >
                {enableSelection && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-blue-400 font-bold text-2xl border-2 border-blue-400 px-4 py-2 rounded">WINDOWS</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
});

SceneBackground.displayName = 'SceneBackground';