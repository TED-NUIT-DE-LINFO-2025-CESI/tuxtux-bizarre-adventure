import { memo } from 'react';
import { motion } from 'motion/react';
import type { Atmosphere } from '../../data/scenes';

interface SceneBackgroundProps {
    atmosphere: Atmosphere;
    enableSelection?: boolean;
    onChoose?: (side: 'linux' | 'windows') => void;
}

// Styles de fond pour le conteneur global (au cas où les images ne chargent pas)
const atmosphereStyles: Record<Atmosphere, string> = {
    neutral: 'bg-gray-900',
    windows: 'bg-blue-900',
    linux: 'bg-green-900',
    chaos: 'bg-red-900',
    victory: 'bg-yellow-900',
};

export const SceneBackground = memo(({ atmosphere, enableSelection = false, onChoose }: SceneBackgroundProps) => {
    const isChaos = atmosphere === 'chaos';

    // Chemins des images (Vérifie bien que ces fichiers sont dans public/backgrounds/)
    const imageGauche = "/backgrounds/linux.png";
    const imageDroite = "/backgrounds/windows.png";

    // --- LOGIQUE ROBUSTE DES LARGEURS ---
    // On utilise des pourcentages explicites pour Framer Motion
    let widthLinux = "50%";
    let widthWindows = "50%";

    if (atmosphere === 'linux') {
        widthLinux = "100%";
        widthWindows = "0%";
    } else if (atmosphere === 'windows') {
        widthLinux = "0%";
        widthWindows = "100%";
    }

    const handleClick = (side: 'linux' | 'windows', e: React.MouseEvent) => {
        if (!enableSelection) return;
        e.stopPropagation();
        if (onChoose) onChoose(side);
    };

    const interactifClass = enableSelection
        ? "cursor-pointer hover:border-yellow-400 hover:brightness-110 active:scale-[0.99] z-50"
        : "cursor-default z-0 brightness-100"; // J'ai remis brightness-100 pour éviter que ce soit trop sombre après le choix

    return (
        <motion.div
            className={`absolute inset-0 flex w-full h-full overflow-hidden ${atmosphereStyles[atmosphere]}`}
        >
            {/* --- CÔTÉ GAUCHE (Linux) --- */}
            <motion.div
                // C'EST ICI QUE CA CHANGE : On utilise 'animate' pour forcer la largeur
                initial={false}
                animate={{ width: widthLinux }}
                transition={{ duration: 0.8, ease: "easeInOut" }}

                onClick={(e) => handleClick('linux', e)}

                // J'ai ajouté bg-green-900 comme couleur de fond de secours si l'image foire
                className={`relative h-full bg-green-900 bg-center bg-no-repeat overflow-hidden border-r border-black/50 ${interactifClass}`}
                style={{
                    backgroundImage: `url('${imageGauche}')`,
                    backgroundSize: 'cover'
                }}
            >
                {enableSelection && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-green-400 font-bold text-3xl uppercase tracking-widest border-2 border-green-400 px-6 py-2 rounded pointer-events-none">
                        Choisir Linux
                    </span>
                    </div>
                )}
            </motion.div>

            {/* --- CÔTÉ DROIT (Windows) --- */}
            <motion.div
                initial={false}
                animate={{ width: widthWindows }}
                transition={{ duration: 0.8, ease: "easeInOut" }}

                onClick={(e) => handleClick('windows', e)}

                // Couleur de secours bleue
                className={`relative h-full bg-blue-900 bg-center bg-no-repeat overflow-hidden border-l border-black/50 ${interactifClass}`}
                style={{
                    backgroundImage: `url('${imageDroite}')`,
                    backgroundSize: 'cover'
                }}
            >
                {enableSelection && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                     <span className="text-blue-400 font-bold text-3xl uppercase tracking-widest border-2 border-blue-400 px-6 py-2 rounded pointer-events-none">
                        Choisir Windows
                    </span>
                    </div>
                )}
            </motion.div>

            {/* --- DÉCORATIONS --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                {/* Overlay pour assombrir légèrement et unifier */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

        </motion.div>
    );
});


SceneBackground.displayName = 'SceneBackground';