// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type Speaker = 'narrator' | 'player' | 'tux' | 'clippy' | 'gates' | 'linus' | 'student' | 'systemd';
export type Position = 'left' | 'center' | 'right';
export type Atmosphere = 'neutral' | 'windows' | 'linux' | 'chaos' | 'victory';

export interface Dialogue {
    speaker: Speaker;
    text: string;
    position?: Position;
    emotion?: string;
}

export interface Choice {
    id: number;
    text: string;
    nextScene: string;
    consequence?: string;
}

export interface Scene {
    id: string;
    title: string;
    atmosphere: Atmosphere;
    dialogues: Dialogue[];
    choices?: Choice[];
    nextScene?: string;
    isBattle?: boolean;
    bgImage?: string;
}

// ============================================================================
// GAME SCENES - Story Content
// ============================================================================

export const SCENES: Record<string, Scene> = {
    // --- SCÈNE 1 : INTRO ---
    intro: {
        id: 'intro',
        title: 'Scène 1 : Le Choix',
        atmosphere: 'neutral',
        bgImage: '/backgrounds/intro.png',
        dialogues: [
            { speaker: 'narrator', text: "Ordinateur neuf. Écran brillant. Deux icônes flottent dans le noir." },
            { speaker: 'player', text: "Enfin ma machine ! 6 mois d'économies. Il faut juste choisir l'OS...", position: 'center' },
        ],
        choices: [
            {
                id: 1,
                text: '🟦 WINDOWS 11',
                nextScene: 'scene_2_updates',
                consequence: 'La route pavée de bonnes intentions...'
            },
            {
                id: 2,
                text: '🐧 LINUX MINT',
                nextScene: 'linux_install',
                consequence: 'La route de l\'aventure.'
            }
        ]
    },

    // --- BRANCHE WINDOWS ---
    scene_2_updates: { // <--- C'est ici que Windows nous emmène
        id: 'scene_2_updates',
        title: 'Scène 2 : Patience',
        atmosphere: 'windows',
        bgImage: '/backgrounds/maj.png', // Vérifie que cette image existe !
        dialogues: [
            { speaker: 'player', text: "Je reste sur du classique pour mes jeux.", position: 'center' },
            { speaker: 'narrator', text: "[ECRAN] Juste un instant... (30 min plus tard) ... Mise à jour 1 sur 48." },
            { speaker: 'player', text: "Pardon ?! Il est neuf ! *Le ventilateur décolle*", position: 'left' },
        ],
        nextScene: 'scene_3_account'
    },

    scene_3_account: {
        id: 'scene_3_account',
        title: 'Scène 3 : Connexion Forcée',
        atmosphere: 'windows',
        bgImage: '/backgrounds/start.png',
        dialogues: [
            { speaker: 'clippy', text: "Coucou ! Pour commencer, donnez-moi votre email, téléphone et groupe sanguin.", position: 'right' },
            { speaker: 'player', text: "Non, je veux un compte local 'Moi'.", position: 'left' },
            { speaker: 'clippy', text: "Impossible avec le Wi-Fi actif.", position: 'right' },
        ],
        choices: [
            {
                id: 1,
                text: 'Se soumettre',
                nextScene: 'scene_4_privacy',
                consequence: 'Adieu vie privée.'
            }
        ]
    },

    scene_4_privacy: {
        id: 'scene_4_privacy',
        title: 'Scène 4 : Vie Privée',
        atmosphere: 'windows',
        bgImage: '/backgrounds/start.png',
        dialogues: [
            { speaker: 'clippy', text: "J'ai tout coché 'OUI' par défaut car je vous aime.", position: 'right' },
            { speaker: 'player', text: "Géolocalisation ? Historique de frappe ? Hors de question !", position: 'left' },
        ],
        nextScene: 'scene_5_eula'
    },

    scene_5_eula: {
        id: 'scene_5_eula',
        title: 'Scène 5 : CGU',
        atmosphere: 'windows',
        // Pas d'image ici -> utilisera le fond bleu par défaut
        dialogues: [
            { speaker: 'clippy', text: "Lisez les 45 000 mots des CGU. Clause 14B : don d'organes numériques.", position: 'right' },
            { speaker: 'player', text: "C'est du délire... *Scrolle furieusement*", position: 'left' },
        ],
        nextScene: 'scene_6_activation'
    },

    scene_6_activation: {
        id: 'scene_6_activation',
        title: 'Scène 6 : Activation',
        atmosphere: 'windows',
        bgImage: '/backgrounds/activation.png',
        dialogues: [
            { speaker: 'clippy', text: "Entrez votre clé produit.", position: 'right' },
            { speaker: 'player', text: "Je l'ai payé ! Il n'y avait rien dans la boîte !", position: 'left' },
        ],
        choices: [
            {
                id: 1,
                text: 'Accepter le Mode Restreint',
                nextScene: 'scene_7_desktop',
                consequence: 'Bienvenue en seconde zone.'
            }
        ]
    },

    scene_7_desktop: {
        id: 'scene_7_desktop',
        title: 'Scène 7 : Le Bureau',
        atmosphere: 'chaos',
        bgImage: '/backgrounds/popup.png',
        dialogues: [
            { speaker: 'narrator', text: "[POPUP] ANTIVIRUS PÉRIMÉ ! OFFICE 365 ! CANDY CRUSH SAGA !" },
            { speaker: 'player', text: "Arrêtez ! Je veux juste Firefox...", position: 'left' },
        ],
        choices: [
            {
                id: 1,
                text: 'Forcer Firefox',
                nextScene: 'scene_8_obsolescence',
                consequence: 'Le système vous juge.'
            }
        ]
    },

    scene_8_obsolescence: {
        id: 'scene_8_obsolescence',
        title: 'Scène 8 : Trop Vieux',
        atmosphere: 'chaos',
        bgImage: '/backgrounds/dic.png',
        dialogues: [
            { speaker: 'clippy', text: "Oups. Votre processeur est obsolète pour Windows 11.", position: 'right' },
            { speaker: 'player', text: "Je l'ai acheté ce matin !!!", position: 'left' },
        ],
        nextScene: 'scene_9_keynote'
    },

    scene_9_keynote: {
        id: 'scene_9_keynote',
        title: 'Scène 9 : Transition',
        atmosphere: 'chaos',
        bgImage: '/backgrounds/gates.jpg',
        dialogues: [
            { speaker: 'gates', text: "J'annonce la Grande Transition. Effacement ce soir.", position: 'center' },
            { speaker: 'tux', text: "🐧 Besoin d'un root access ?", position: 'right' },
        ],
        nextScene: 'final_battle'
    },

    // --- BRANCHE LINUX ---
    linux_install: { // <--- C'est ici que Linux nous emmène
        id: 'linux_install',
        title: 'Branche Linux - Matrix',
        atmosphere: 'linux',
        bgImage: '/backgrounds/start-li.png',
        dialogues: [
            { speaker: 'narrator', text: "Clic sur le Pingouin. Écran noir... Texte blanc défile." },
            { speaker: 'tux', text: "Installation terminée. Bienvenue.", position: 'right' },
        ],
        nextScene: 'linux_terminal'
    },

    linux_terminal: {
        id: 'linux_terminal',
        title: 'Branche Linux - Terminal',
        atmosphere: 'linux',
        bgImage: '/backgrounds/linux-p.png',
        dialogues: [
            { speaker: 'linus', text: "Ici on utilise le TERMINAL. La puissance pure.", position: 'right' },
        ],
        choices: [
            {
                id: 1,
                text: 'Taper "sudo apt install"',
                nextScene: 'linux_power',
                consequence: 'Hacker mode.'
            },
            {
                id: 2,
                text: 'Logithèque',
                nextScene: 'linux_gui',
                consequence: 'Facile.'
            }
        ]
    },

    linux_gui: {
        id: 'linux_gui',
        title: 'Logithèque',
        atmosphere: 'linux',
        bgImage: '/backgrounds/linux-p.png',
        dialogues: [
            { speaker: 'narrator', text: "Tout est gratuit, validé, sécurisé." },
            { speaker: 'player', text: "Je vais pleurer de joie.", position: 'left' },
        ],
        nextScene: 'linux_alert'
    },

    linux_power: {
        id: 'linux_power',
        title: 'Sudo Power',
        atmosphere: 'linux',
        bgImage: '/backgrounds/linux-p.png',
        dialogues: [
            { speaker: 'player', text: "$ sudo apt install steam -y", position: 'center' },
            { speaker: 'linus', text: "Bien joué.", position: 'right' },
        ],
        nextScene: 'linux_alert'
    },

    linux_alert: {
        id: 'linux_alert',
        title: 'Appel aux armes',
        atmosphere: 'chaos',
        bgImage: '/backgrounds/alert.png',
        dialogues: [
            { speaker: 'tux', text: "ALERTE ! Bill Gates efface les vieux PC !", position: 'right' },
            { speaker: 'linus', text: "Prends cette Clé USB. Formate le Mal.", position: 'right' },
        ],
        nextScene: 'final_battle'
    },

    // --- FINALE ---
    final_battle: {
        id: 'final_battle',
        title: 'COMBAT FINAL',
        atmosphere: 'chaos',
        isBattle: true,
        bgImage: '/backgrounds/boss.jpg',
        dialogues: [
            { speaker: 'tux', text: "Recule, abomination !", position: 'right' },
            { speaker: 'gates', text: "MAUDITS PINGOUINS !", position: 'center' },
        ],
        nextScene: 'victory'
    },

    victory: {
        id: 'victory',
        title: 'Épilogue',
        atmosphere: 'victory',
        bgImage: '/backgrounds/victory.jpg',
        dialogues: [
            { speaker: 'narrator', text: "Le PC redémarre. Libre." },
            { speaker: 'tux', text: "Propre. Rapide.", position: 'right' },
        ],
        choices: [
            { id: 0, text: '🔄 Rejouer', nextScene: 'intro' }
        ]
    }
};

// ============================================================================
// BATTLE CONSTANTS
// ============================================================================

export interface BattleAttack {
    type: 'tux' | 'omega';
    name: string;
    damage: number;
    heal?: number;
}

export const BATTLE_ATTACKS: BattleAttack[] = [
    { type: 'omega', name: 'Mise à jour Forcée', damage: 20 },
    { type: 'tux', name: 'Open Source Strike', damage: 25, heal: 10 },
    { type: 'omega', name: 'Obsolescence', damage: 15 },
    { type: 'tux', name: 'Live USB Boot', damage: 30 },
    { type: 'omega', name: 'Telemetry Drain', damage: 10 },
    { type: 'tux', name: 'Sudo Command', damage: 35 },
];

export const INITIAL_HEALTH = {
    tux: 100,
    omega: 100,
};