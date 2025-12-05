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
}

// ============================================================================
// GAME SCENES - Story Content (VERSION CONDENSÉE)
// ============================================================================

export const SCENES: Record<string, Scene> = {
    // --- PROLOGUE ---
    intro: {
        id: 'intro',
        title: 'Scène 1 : Le Choix',
        atmosphere: 'neutral',
        dialogues: [
            { speaker: 'narrator', text: "Ordinateur neuf. Écran brillant. Deux icônes flottent dans le noir." },
            { speaker: 'player', text: "Enfin ma machine ! 6 mois d'économies. Il faut juste choisir l'OS...", position: 'center' },
        ],
        choices: [
            {
                id: 1,
                text: '🟦 WINDOWS 11 (Sécurité apparente)',
                nextScene: 'scene_2_updates',
                consequence: 'La route pavée de bonnes intentions...'
            },
            {
                id: 2,
                text: '🐧 LINUX MINT (Liberté totale)',
                nextScene: 'linux_install',
                consequence: 'La route de l\'aventure.'
            }
        ]
    },

    // --- BRANCHE WINDOWS ---

    // --- BRANCHE WINDOWS (SATIRE COMPLÈTE) ---
    scene_2_updates: {
        id: 'scene_2_updates',
        title: 'Scène 2 : La Fausse Promesse',
        atmosphere: 'windows',
        dialogues: [
            { speaker: 'player', text: "Je reste sur du classique. Pour mes jeux, c'est mieux.", position: 'center' },
            { speaker: 'narrator', text: "[ECRAN] Un instant... (20 min plus tard) ... Mise à jour 1 sur 48." },
            { speaker: 'player', text: "Pardon ?! Il est neuf ! *Le ventilateur décolle*", position: 'left' },
            { speaker: 'player', text: "Ok... Va te faire un café Alex. Ça va aller vite...", position: 'left' },
        ],
        nextScene: 'scene_3_account'
    },

    scene_3_account: {
        id: 'scene_3_account',
        title: 'Scène 3 : Le Chantage',
        atmosphere: 'windows',
        dialogues: [
            { speaker: 'clippy', text: "Coucou ! Pour commencer, donnez-moi votre email, téléphone et nom de jeune fille de votre mère.", position: 'right' },
            { speaker: 'player', text: "Non, je veux un compte local. Juste 'Moi'.", position: 'left' },
            { speaker: 'clippy', text: "Ah, vous avez le Wi-Fi actif ! Du coup, le compte local est interdit. C'est pour votre bien.", position: 'right' },
            { speaker: 'player', text: "Tu me forces ? Sérieusement ?", position: 'left' },
        ],
        choices: [
            {
                id: 1,
                text: 'Se soumettre (Pas le choix)',
                nextScene: 'scene_4_privacy',
                consequence: 'Adieu vie privée.'
            }
        ]
    },

    scene_4_privacy: {
        id: 'scene_4_privacy',
        title: 'Scène 4 : Vie "Privée"',
        atmosphere: 'windows',
        dialogues: [
            { speaker: 'clippy', text: "Configurons la vie privée ! J'ai tout coché 'OUI' par défaut car je vous aime.", position: 'right' },
            { speaker: 'narrator', text: "[OPTION] Envoyer ma position précise à 400 partenaires." },
            { speaker: 'player', text: "Hors de question ! *Clic frénétique pour tout décocher*", position: 'left' },
            { speaker: 'clippy', text: "Vous n'aimez pas les pubs pertinentes ? Dommage. Cliquez sur 'Accepter' quand même.", position: 'right' },
        ],
        nextScene: 'scene_5_eula'
    },

    scene_5_eula: {
        id: 'scene_5_eula',
        title: 'Scène 5 : Le Mur de Texte',
        atmosphere: 'windows',
        dialogues: [
            { speaker: 'clippy', text: "Maintenant, lisez les 45 000 mots des CGU. Surtout la clause sur le don d'organes numériques.", position: 'right' },
            { speaker: 'narrator', text: "*BIP ERREUR* Le bouton 'Accepter' reste grisé." },
            { speaker: 'clippy', text: "Je sais que vous n'avez pas lu. Scrollez jusqu'au dernier pixel.", position: 'right' },
            { speaker: 'player', text: "C'est du délire... *Scrolle furieusement pendant 15 secondes*", position: 'left' },
        ],
        nextScene: 'scene_6_activation'
    },

    scene_6_activation: {
        id: 'scene_6_activation',
        title: 'Scène 6 : Le Péage',
        atmosphere: 'windows',
        dialogues: [
            { speaker: 'clippy', text: "Ordi configuré ! Il manque juste la clé produit de 25 caractères.", position: 'right' },
            { speaker: 'player', text: "Je l'ai payé ! Il n'y avait rien dans la boîte !", position: 'left' },
            { speaker: 'clippy', text: "Vous avez payé le matériel. Le Logiciel est un privilège. Pas de clé = Mode Pauvre.", position: 'right' },
        ],
        choices: [
            {
                id: 1,
                text: 'Accepter le Mode Restreint',
                nextScene: 'scene_7_desktop',
                consequence: 'Bienvenue en seconde zone.'
            },
            {
                id: 2,
                text: 'Payer 145€ (Aïe)',
                nextScene: 'scene_7_desktop',
                consequence: 'Votre carte bleue pleure.'
            }
        ]
    },

    scene_7_desktop: {
        id: 'scene_7_desktop',
        title: 'Scène 7 : Le Bureau de l\'Enfer',
        atmosphere: 'chaos',
        dialogues: [
            { speaker: 'narrator', text: "Le bureau s'affiche. Fond noir. Filigrane 'ACTIVER WINDOWS'. Soudain : *DING! POP! DING!*" },
            { speaker: 'narrator', text: "[POPUP] ANTIVIRUS PÉRIMÉ ! OFFICE 365 ! CANDY CRUSH SAGA !" },
            { speaker: 'player', text: "Arrêtez ! Je veux juste Firefox...", position: 'left' },
            { speaker: 'clippy', text: "ATTENDEZ ! EDGE EST 400% PLUS RAPIDE ! (Vraiment !)", position: 'right' },
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
        dialogues: [
            { speaker: 'narrator', text: "Le PC plante. La souris fige. Ventilateur au max." },
            { speaker: 'clippy', text: "Oups. Votre processeur i5 est 'philosophiquement' obsolète pour Windows 11.", position: 'right' },
            { speaker: 'player', text: "Je l'ai acheté ce matin !!!", position: 'left' },
            { speaker: 'clippy', text: "Sécurité compromise. Désactivation des fonctions vitales...", position: 'right' },
        ],
        nextScene: 'scene_9_keynote'
    },

    scene_9_keynote: {
        id: 'scene_9_keynote',
        title: 'Scène 9 : La Grande Transition',
        atmosphere: 'chaos',
        dialogues: [
            { speaker: 'gates', text: "Vos PC sont lents ? C'est de votre faute. Vous êtes dépassés.", position: 'center' },
            { speaker: 'gates', text: "J'annonce la Grande Transition. Tous les vieux systèmes seront effacés ce soir.", position: 'center' },
            { speaker: 'narrator', text: "Bill se transforme en WINDOWS BLEU GÉANT. *CRASH!* Tux déchire l'écran !" },
            { speaker: 'tux', text: "🐧 Besoin d'un root access ?", position: 'right' },
        ],
        nextScene: 'final_battle'
    },


    // --- BRANCHE LINUX ---
    linux_install: {
        id: 'linux_install',
        title: 'Branche Linux - Matrix',
        atmosphere: 'linux',
        dialogues: [
            { speaker: 'narrator', text: "Clic sur le Pingouin. Écran noir... Texte blanc défile à toute vitesse." },
            { speaker: 'tux', text: "Installation terminée. Bienvenue.", position: 'right' },
            { speaker: 'player', text: "Déjà ? En 4 minutes ? Où sont les pubs ?", position: 'left' },
            { speaker: 'tux', text: "Pas de temps à perdre. On a un système à explorer.", position: 'right' },
        ],
        nextScene: 'linux_terminal'
    },

    linux_terminal: {
        id: 'linux_terminal',
        title: 'Branche Linux - Terminal',
        atmosphere: 'linux',
        dialogues: [
            { speaker: 'player', text: "C'est calme. Bon, je vais sur Edge télécharger Steam.exe ?", position: 'left' },
            { speaker: 'linus', text: "MALHEUREUX ! Pose cette souris !", position: 'right' },
            { speaker: 'linus', text: "Ici on utilise le TERMINAL. La puissance pure.", position: 'right' },
            { speaker: 'player', text: "La boîte noire des hackers ? J'ai peur...", position: 'left' },
        ],
        choices: [
            {
                id: 1,
                text: 'Taper "sudo apt install steam"',
                nextScene: 'linux_power',
                consequence: 'Hacker mode activated.'
            },
            {
                id: 2,
                text: 'Ouvrir la Logithèque (Facile)',
                nextScene: 'linux_gui',
                consequence: 'Sécurité et simplicité.'
            }
        ]
    },

    linux_gui: {
        id: 'linux_gui',
        title: 'Branche Linux - App Store',
        atmosphere: 'linux',
        dialogues: [
            { speaker: 'narrator', text: "Logithèque ouverte. Tout est gratuit, validé, sécurisé." },
            { speaker: 'player', text: "Comme un App Store sans carte bleue ? Je vais pleurer de joie.", position: 'left' },
            { speaker: 'narrator', text: "Soudain, une alerte système retentit (une vraie, pas une pub).", position: 'center' },
        ],
        nextScene: 'linux_alert'
    },

    linux_power: {
        id: 'linux_power',
        title: 'Branche Linux - Sudo',
        atmosphere: 'linux',
        dialogues: [
            { speaker: 'player', text: "$ sudo apt install steam -y", position: 'center' },
            { speaker: 'narrator', text: "Le texte défile. Vous vous sentez comme NEO dans Matrix.", position: 'center' },
            { speaker: 'linus', text: "Bien joué. Mais évite 'rm -rf /' si tu tiens à la vie.", position: 'right' },
            { speaker: 'narrator', text: "Le terminal clignote rouge !", position: 'center' },
        ],
        nextScene: 'linux_alert'
    },

    linux_alert: {
        id: 'linux_alert',
        title: 'Branche Linux - L\'Appel',
        atmosphere: 'chaos',
        dialogues: [
            { speaker: 'tux', text: "ALERTE ! Bill Gates lance l'effacement mondial des vieux PC !", position: 'right' },
            { speaker: 'player', text: "Mes amis sont sur Windows ! Il faut les aider !", position: 'left' },
            { speaker: 'linus', text: "Prends cette Clé USB Excalibur. Va et formate le Mal.", position: 'right' },
        ],
        nextScene: 'final_battle'
    },

    // --- FINALE COMMUNE ---
    final_battle: {
        id: 'final_battle',
        title: 'COMBAT FINAL',
        atmosphere: 'chaos',
        isBattle: true,
        dialogues: [
            { speaker: 'tux', text: "Recule, abomination propriétaire ! J'ai une clé USB bootable !", position: 'right' },
            { speaker: 'gates', text: "UNE CLÉ USB ? CONTRE MON CLOUD SOUVERAIN ?", position: 'center' },
            { speaker: 'player', text: "On formate tout et on installe Mint !", position: 'left' },
        ],
        nextScene: 'victory'
    },

    victory: {
        id: 'victory',
        title: 'Épilogue',
        atmosphere: 'victory',
        dialogues: [
            { speaker: 'narrator', text: "Le Monstre s'effondre en fichiers .tmp. Le PC redémarre en 3 secondes." },
            { speaker: 'tux', text: "Propre. Libre. Rapide.", position: 'right' },
            { speaker: 'player', text: "C'est ça, la liberté. Profite, Alex.", position: 'left' },
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