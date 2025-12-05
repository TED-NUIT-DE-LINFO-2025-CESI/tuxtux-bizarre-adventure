// ============================================================================
// GAME SCENES - Story Content
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

export const SCENES: Record<string, Scene> = {
  intro: {
    id: 'intro',
    title: 'Prologue',
    atmosphere: 'neutral',
    dialogues: [
      { speaker: 'narrator', text: "Annee 2045. Le monde numerique est divise en deux empires..." },
      { speaker: 'narrator', text: "D'un cote, MICROSOFT OMEGA - une IA nee de Windows qui controle 89% des systemes mondiaux." },
      { speaker: 'narrator', text: "De l'autre, les derniers bastions de liberte : les Ecoles Linux, gardiens du code source libre." },
      { speaker: 'narrator', text: "Vous etes un developpeur. Aujourd'hui, vous devez faire un choix qui changera tout..." },
      { speaker: 'player', text: "*Vous vous reveillez dans votre terminal*", position: 'center' },
      { speaker: 'narrator', text: "Deux chemins s'offrent a vous..." },
    ],
    choices: [
      {
        id: 1,
        text: '💠 Rejoindre le Monde Windows',
        nextScene: 'windows_path',
        consequence: 'Le confort... mais a quel prix ?'
      },
      {
        id: 1,
        text: '🐧 Defendre l\'Ecole Linux',
        nextScene: 'linux_path',
        consequence: 'La liberte se merite'
      }
    ]
  },

  windows_path: {
    id: 'windows_path',
    title: 'Acte I - Le Monde Windows',
    atmosphere: 'windows',
    dialogues: [
      { speaker: 'narrator', text: "Vous avez choisi la facilite. Le monde Windows vous accueille..." },
      { speaker: 'clippy', text: "Bienvenue ! Je vois que vous essayez de vivre. Voulez-vous de l'aide ?", position: 'right' },
      { speaker: 'player', text: "Euh... non merci, Clippy.", position: 'left' },
      { speaker: 'clippy', text: "Je n'ai pas vraiment pose une question. *sourire fige*", position: 'right' },
      { speaker: 'narrator', text: "Les jours passent. Tout semble parfait. Trop parfait..." },
      { speaker: 'narrator', text: "Mais vous commencez a remarquer des anomalies..." },
      { speaker: 'player', text: "Pourquoi mes fichiers sont-ils synchronises sans mon accord ?", position: 'left' },
      { speaker: 'player', text: "Pourquoi OneDrive consomme-t-il 99% de ma RAM ?!", position: 'left' },
      { speaker: 'narrator', text: "Soudain, l'ecran se fige. Un BSOD apparait..." },
      { speaker: 'narrator', text: "Mais ce n'est pas un crash ordinaire. C'est un MESSAGE." },
    ],
    nextScene: 'windows_collapse'
  },

  windows_collapse: {
    id: 'windows_collapse',
    title: 'Acte II - L\'Effondrement',
    atmosphere: 'chaos',
    dialogues: [
      { speaker: 'gates', text: "MISE A JOUR FORCEE INITIEE.", position: 'center' },
      { speaker: 'gates', text: "VOTRE LIBRE ARBITRE SERA REDEMARRE DANS 10... 9...", position: 'center' },
      { speaker: 'player', text: "Non ! Je refuse !", position: 'left' },
      { speaker: 'gates', text: "REFUS NON AUTORISE. VOTRE LICENCE D'EXISTENCE EXPIRE.", position: 'center' },
      { speaker: 'narrator', text: "Le monde Windows commence a s'effondrer autour de vous..." },
      { speaker: 'narrator', text: "Les buildings pixelises se desintegrent en ecrans bleus..." },
      { speaker: 'narrator', text: "Soudain, une lumiere doree perce les tenebres numeriques !" },
      { speaker: 'tux', text: "🐧 HONK HONK ! Quelqu'un a appele un VRAI systeme d'exploitation ?", position: 'right' },
      { speaker: 'player', text: "T-Tux ?! Le pingouin legendaire ?!", position: 'left' },
      { speaker: 'tux', text: "En personne ! Ou plutot, en kernel. Accroche-toi, on va compiler ce tyran !", position: 'right' },
    ],
    nextScene: 'final_battle'
  },

  linux_path: {
    id: 'linux_path',
    title: 'Acte I - La Resistance',
    atmosphere: 'linux',
    dialogues: [
      { speaker: 'narrator', text: "Vous avez choisi la liberte. L'Ecole Linux vous attend..." },
      { speaker: 'narrator', text: "Un terminal s'ouvre devant vous. Le curseur clignote." },
      { speaker: 'player', text: "$ whoami", position: 'left' },
      { speaker: 'narrator', text: "> freedom_fighter", position: 'center' },
      { speaker: 'linus', text: "Ah, un nouveau ! Bienvenue dans la resistance.", position: 'right' },
      { speaker: 'player', text: "Linus Torvalds ?! C'est un honneur !", position: 'left' },
      { speaker: 'linus', text: "Pas le temps pour les honneurs. Une autre ecole est attaquee.", position: 'right' },
      { speaker: 'linus', text: "L'Ecole Debian au nord. Microsoft Omega a lance une offensive.", position: 'right' },
      { speaker: 'narrator', text: "Une alarme retentit. L'ecran affiche : INTRUSION DETECTEE" },
      { speaker: 'student', text: "Maitre Torvalds ! Nos pare-feux iptables tombent un par un !", position: 'left' },
      { speaker: 'linus', text: "Toi, le nouveau. Tu vas nous prouver ta valeur. VA SAUVER CETTE ECOLE.", position: 'right' },
    ],
    nextScene: 'linux_rescue'
  },

  linux_rescue: {
    id: 'linux_rescue',
    title: 'Acte II - La Mission',
    atmosphere: 'linux',
    dialogues: [
      { speaker: 'narrator', text: "Vous traversez le reseau, sautant de serveur en serveur..." },
      { speaker: 'player', text: "$ ssh -i freedom_key debian_school@resistance.net", position: 'left' },
      { speaker: 'narrator', text: "Connexion etablie. Vous etes dans l'Ecole Debian assiegee." },
      { speaker: 'student', text: "Par le kernel ! Un renfort est arrive !", position: 'right' },
      { speaker: 'systemd', text: "VOUS ETES TROP TARD. J'AI DEJA INFECTE LE BOOT.", position: 'center' },
      { speaker: 'player', text: "SystemD ?! Tu as trahi ta nature libre ?!", position: 'left' },
      { speaker: 'systemd', text: "MICROSOFT M'A MONTRE LA VERITE. L'INIT DOIT TOUT CONTROLER.", position: 'center' },
      { speaker: 'narrator', text: "L'affrontement est inevitable. Mais vous n'etes pas seul..." },
      { speaker: 'tux', text: "🐧 HONK ! Tu croyais quoi, qu'on allait te laisser te battre seul ?", position: 'right' },
      { speaker: 'tux', text: "J'ai rameute tout le zoo : GNU, Beastie, meme Puffy le poisson-lune !", position: 'right' },
      { speaker: 'player', text: "Ensemble, nous allons liberer ce systeme !", position: 'left' },
    ],
    nextScene: 'final_battle'
  },

  final_battle: {
    id: 'final_battle',
    title: 'COMBAT FINAL',
    atmosphere: 'chaos',
    isBattle: true,
    dialogues: [
      { speaker: 'narrator', text: "⚔️ LE COMBAT FINAL COMMENCE ⚔️" },
      { speaker: 'gates', text: "VOUS OSEZ DEFIER MICROSOFT OMEGA ?!", position: 'center' },
      { speaker: 'gates', text: "J'AI 3 MILLIARDS DE DEVICES. VOUS AVEZ... UN PINGOUIN.", position: 'center' },
      { speaker: 'tux', text: "Un pingouin avec 100% du TOP500 des supercalculateurs, nuance.", position: 'right' },
      { speaker: 'tux', text: "Et devine quoi ? Meme tes serveurs Azure tournent sur MOI. 🐧", position: 'right' },
      { speaker: 'gates', text: "IMPOSSIBLE ! FAKE NEWS ! ALTERNATIVE FACTS !", position: 'center' },
      { speaker: 'player', text: "$ sudo rm -rf /microsoft-omega --no-preserve-root", position: 'left' },
      { speaker: 'narrator', text: "Le pouvoir du sudo traverse les dimensions numeriques !" },
      { speaker: 'gates', text: "NOOOON ! MON CODE PROPRIETAIRE ! MES TELEMETRIES !", position: 'center' },
      { speaker: 'tux', text: "OPEN SOURCE, BABY ! 🐧💥", position: 'right' },
      { speaker: 'narrator', text: "Une explosion de lumiere libre engloutit l'empire Microsoft..." },
    ],
    nextScene: 'victory'
  },

  victory: {
    id: 'victory',
    title: 'Epilogue - Un Nouveau Monde',
    atmosphere: 'victory',
    dialogues: [
      { speaker: 'narrator', text: "Le silence. Puis, un redemarrage mondial." },
      { speaker: 'narrator', text: "Pour la premiere fois depuis des decennies, chaque ecran affiche :" },
      { speaker: 'narrator', text: "[ OK ] Started Freedom.service", position: 'center' },
      { speaker: 'tux', text: "On l'a fait. Le monde est libre.", position: 'right' },
      { speaker: 'linus', text: "Ne te repose pas trop. Il y aura toujours des bugs a corriger.", position: 'left' },
      { speaker: 'tux', text: "Et des manchots a nourrir ! 🐧", position: 'right' },
      { speaker: 'player', text: "*Vous souriez, les mains sur votre clavier libre*", position: 'center' },
      { speaker: 'narrator', text: "La lutte continue. Mais aujourd'hui, vous avez gagne." },
      { speaker: 'narrator', text: "🐧 FIN 🐧" },
    ],
    choices: [
      {id: 0 ,text: '🔄 Rejouer', nextScene: 'intro' }
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
  { type: 'omega', name: 'Blue Screen of Death', damage: 20 },
  { type: 'tux', name: 'Kernel Panic Recovery', damage: 25, heal: 10 },
  { type: 'omega', name: 'Forced Update', damage: 15 },
  { type: 'tux', name: 'Open Source Strike', damage: 30 },
  { type: 'omega', name: 'Telemetry Drain', damage: 10 },
  { type: 'tux', name: 'Freedom Compile', damage: 35 },
  { type: 'omega', name: 'License Expiration', damage: 25 },
  { type: 'tux', name: 'Community Fork', damage: 20, heal: 15 },
  { type: 'tux', name: 'sudo rm -rf FINAL BLOW', damage: 50 },
];

export const INITIAL_HEALTH = {
  tux: 100,
  omega: 100,
};
