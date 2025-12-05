import { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import './fight-game.css';

interface BattleSceneProps {
  onVictory: () => void;
  onDefeat?: () => void;
}

type GameState = {
  isGameOver: boolean;
  modelsLoaded: boolean;
  lastTime: number;
};

type InputState = {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  pose: boolean;
};

type AIState = {
  lastDecision: number;
  currentAction: 'idle' | 'approach' | 'retreat' | 'attack';
};

type Winner = 'linux' | 'windows' | null;

const PHYSICS = {
  GRAVITY: 0.08,
  GROUND_Y: -5,
  MOVE_SPEED: 0.4,
  JUMP_FORCE: 0.7,
  ATTACK_RANGE: 8,
  KNOCKBACK_FORCE: 0.3,
  STUN_DURATION: 400,
  ATTACK_COOLDOWN: 600,
  FRICTION: 0.85
};

const AI_CONFIG = {
  AGGRESSION: 0.35,
  ATTACK_RANGE: 8,
  DECISION_INTERVAL: 500
};

const HIT_SOUNDS = ['ドォーン!', 'ゴッ!', 'バキッ!', 'ドゴォ!', 'ガシッ!', 'ズドン!'];

const backgroundConfig = {
  backgroundURL: '/fond.png',
  fallbackColor: 0x1a1a2e
};

const modelPaths = {
  linux: '/white_mesh.obj',
  windows: '/win_mesh.obj'
};

export const BattleScene = memo(({ onVictory, onDefeat }: BattleSceneProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const p1FillRef = useRef<HTMLDivElement | null>(null);
  const p2FillRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const fxLayerRef = useRef<HTMLDivElement | null>(null);
  const speedOverlayRef = useRef<HTMLDivElement | null>(null);
  const gameOverRef = useRef<HTMLDivElement | null>(null);
  const winnerTextRef = useRef<HTMLDivElement | null>(null);
  const tbcArrowRef = useRef<HTMLDivElement | null>(null);
  const restartHandlerRef = useRef<(() => void) | null>(null);
  const [winner, setWinner] = useState<Winner>(null);

  useEffect(() => {
    const container = containerRef.current;
    const consoleEl = consoleRef.current;
    const p1Fill = p1FillRef.current;
    const p2Fill = p2FillRef.current;
    const loadingIndicator = loadingRef.current;
    const fxLayer = fxLayerRef.current;
    const speedOverlay = speedOverlayRef.current;
    const gameOverScreen = gameOverRef.current;
    const winnerText = winnerTextRef.current;
    const tbcArrow = tbcArrowRef.current;

    if (
      !container ||
      !consoleEl ||
      !p1Fill ||
      !p2Fill ||
      !loadingIndicator ||
      !fxLayer ||
      !speedOverlay ||
      !gameOverScreen ||
      !winnerText ||
      !tbcArrow
    ) {
      return;
    }

    const containerEl = container;
    const consoleElement = consoleEl;
    const p1FillEl = p1Fill;
    const p2FillEl = p2Fill;
    const loadingEl = loadingIndicator;
    const speedOverlayEl = speedOverlay;
    const gameOverEl = gameOverScreen;
    const winnerTextEl = winnerText;
    const tbcArrowEl = tbcArrow;

    const gameState: GameState = {
      isGameOver: false,
      modelsLoaded: false,
      lastTime: 0
    };

    const inputState: InputState = {
      left: false,
      right: false,
      jump: false,
      attack: false,
      pose: false
    };

    const aiState: AIState = {
      lastDecision: 0,
      currentAction: 'idle'
    };

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    let player1: Fighter;
    let player2: Fighter;

    let animationId: number | undefined;

    const menacingElements: HTMLDivElement[] = [];
    const menacingIntervals: ReturnType<typeof setInterval>[] = [];

    class Fighter {
      name: string;
      health: number;
      maxHealth: number;
      attackPower: number;
      mesh: THREE.Object3D | null;
      originalPosition: THREE.Vector3;
      modelPath: string;
      isPlayer: boolean;
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      grounded: boolean;
      isAttacking: boolean;
      isStunned: boolean;
      isPosing: boolean;
      facingRight: boolean;
      attackCooldown: number;
      stunTimer: number;

      constructor(config: {
        name: string;
        maxHealth: number;
        attackPower: number;
        originalPosition: THREE.Vector3;
        modelPath: string;
        isPlayer?: boolean;
        facingRight: boolean;
      }) {
        this.name = config.name;
        this.health = config.maxHealth;
        this.maxHealth = config.maxHealth;
        this.attackPower = config.attackPower;
        this.mesh = null;
        this.originalPosition = config.originalPosition.clone();
        this.modelPath = config.modelPath;
        this.isPlayer = config.isPlayer || false;

        this.position = config.originalPosition.clone();
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.grounded = true;

        this.isAttacking = false;
        this.isStunned = false;
        this.isPosing = false;
        this.facingRight = config.facingRight;

        this.attackCooldown = 0;
        this.stunTimer = 0;
      }

      update(deltaTime: number) {
        if (!this.grounded) {
          this.velocity.y -= PHYSICS.GRAVITY;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y <= PHYSICS.GROUND_Y) {
          this.position.y = PHYSICS.GROUND_Y;
          this.velocity.y = 0;
          this.grounded = true;
        } else {
          this.grounded = false;
        }

        if (this.grounded) {
          this.velocity.x *= PHYSICS.FRICTION;
        }

        this.position.x = Math.max(-55, Math.min(55, this.position.x));

        if (this.mesh) {
          this.mesh.position.copy(this.position);
          this.mesh.rotation.y = this.facingRight ? 0 : Math.PI;
        }

        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;
        if (this.stunTimer > 0) {
          this.stunTimer -= deltaTime;
          if (this.stunTimer <= 0) {
            this.isStunned = false;
          }
        }
      }

      move(direction: number) {
        if (this.isStunned || this.isAttacking || this.isPosing) return;
        this.velocity.x = direction * PHYSICS.MOVE_SPEED;
        this.facingRight = direction > 0;
      }

      jump() {
        if (this.grounded && !this.isStunned && !this.isAttacking && !this.isPosing) {
          this.velocity.y = PHYSICS.JUMP_FORCE;
          this.grounded = false;
        }
      }

      attack(opponent: Fighter) {
        if (this.attackCooldown > 0 || this.isStunned || this.isPosing) return;

        this.isAttacking = true;
        this.attackCooldown = PHYSICS.ATTACK_COOLDOWN;

        if (this.mesh) {
          const originalY = this.mesh.position.y;
          this.mesh.position.y += 0.5;
          setTimeout(() => {
            if (this.mesh) this.mesh.position.y = originalY;
          }, 100);
        }

        spawnText(this.position.clone().add(new THREE.Vector3(0, 8, 0)), this.isPlayer ? 'ORA!' : 'MUDA!');

        const distance = Math.abs(this.position.x - opponent.position.x);
        const facing = (opponent.position.x - this.position.x) * (this.facingRight ? 1 : -1) > 0;

        if (distance < PHYSICS.ATTACK_RANGE && facing) {
          const damage = Math.round(this.attackPower * (0.9 + Math.random() * 0.2));
          const knockbackDir = opponent.position.x > this.position.x ? 1 : -1;
          opponent.takeDamage(damage, knockbackDir);
        }

        setTimeout(() => {
          this.isAttacking = false;
        }, 150);
      }

      takeDamage(amount: number, knockbackDir: number) {
        let finalAmount = amount;
        if (this.isPosing) {
          finalAmount = Math.floor(amount * 0.5);
        }

        this.health = Math.max(0, this.health - finalAmount);
        this.isStunned = true;
        this.stunTimer = PHYSICS.STUN_DURATION;

        this.velocity.x = knockbackDir * PHYSICS.KNOCKBACK_FORCE * 6;
        this.velocity.y = PHYSICS.KNOCKBACK_FORCE * 2;
        this.grounded = false;

        showHitEffect(this.position);
        showDamageEffect(this.position.x, this.position.y + 10, finalAmount);
        triggerCameraShake();
        activateSpeedLines();
        updateHealthBars();

        if (this.health <= 0) {
          endGame(this === player2 ? player1 : player2);
        }
      }

      pose() {
        if (!this.grounded || this.isStunned || this.isAttacking || this.isPosing) return;

        this.isPosing = true;
        this.velocity.x = 0;

        if (this.mesh) {
          this.mesh.rotation.z = -0.2 * (this.facingRight ? 1 : -1);
        }

        spawnMenacingBurst(this.position);

        setTimeout(() => {
          this.isPosing = false;
          if (this.mesh) this.mesh.rotation.z = 0;

          this.health = Math.min(this.health + 3, this.maxHealth);
          updateHealthBars();
        }, 800);
      }

      reset() {
        this.health = this.maxHealth;
        this.position.copy(this.originalPosition);
        this.velocity.set(0, 0, 0);
        this.grounded = true;
        this.isAttacking = false;
        this.isStunned = false;
        this.isPosing = false;
        this.attackCooldown = 0;
        this.stunTimer = 0;

        if (this.mesh) {
          this.mesh.position.copy(this.originalPosition);
          this.mesh.rotation.set(0, this.facingRight ? 0 : Math.PI, 0);
        }
      }
    }

    const loader = new OBJLoader();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          inputState.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputState.right = true;
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          inputState.jump = true;
          e.preventDefault();
          break;
        case 'KeyJ':
        case 'KeyZ':
          inputState.attack = true;
          break;
        case 'KeyL':
          inputState.pose = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          inputState.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          inputState.right = false;
          break;
        case 'KeyW':
        case 'ArrowUp':
        case 'Space':
          inputState.jump = false;
          break;
        case 'KeyJ':
        case 'KeyZ':
          inputState.attack = false;
          break;
        case 'KeyL':
          inputState.pose = false;
          break;
        default:
          break;
      }
    };

    function initInputHandlers() {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);
    }

    function processPlayerInput() {
      if (!player1 || player1.isStunned) return;

      if (inputState.left) {
        player1.move(-1);
      } else if (inputState.right) {
        player1.move(1);
      }

      if (inputState.jump) {
        player1.jump();
      }

      if (inputState.attack) {
        player1.attack(player2);
      }

      if (inputState.pose) {
        player1.pose();
        inputState.pose = false;
      }
    }

    function updateAI(enemy: Fighter, player: Fighter, currentTime: number) {
      if (enemy.isStunned || enemy.isPosing || gameState.isGameOver) return;

      if (currentTime - aiState.lastDecision < AI_CONFIG.DECISION_INTERVAL) {
        executeAIAction(enemy, player);
        return;
      }
      aiState.lastDecision = currentTime;

      const distance = Math.abs(enemy.position.x - player.position.x);
      const healthPercent = enemy.health / enemy.maxHealth;

      if (healthPercent < 0.3 && Math.random() > AI_CONFIG.AGGRESSION) {
        aiState.currentAction = distance < AI_CONFIG.ATTACK_RANGE ? 'retreat' : 'idle';
      } else if (distance < AI_CONFIG.ATTACK_RANGE) {
        aiState.currentAction = Math.random() < AI_CONFIG.AGGRESSION ? 'attack' : 'idle';
      } else {
        aiState.currentAction = 'approach';
      }

      if (Math.random() < 0.002) {
        enemy.pose();
      }

      if (Math.random() < 0.01 && enemy.grounded) {
        enemy.jump();
      }
    }

    function executeAIAction(enemy: Fighter, player: Fighter) {
      enemy.facingRight = player.position.x > enemy.position.x;

      switch (aiState.currentAction) {
        case 'approach':
          enemy.move(player.position.x > enemy.position.x ? 1 : -1);
          break;
        case 'retreat':
          enemy.move(player.position.x > enemy.position.x ? -1 : 1);
          break;
        case 'attack':
          if (!enemy.isAttacking && enemy.attackCooldown <= 0) {
            enemy.attack(player);
          }
          break;
        case 'idle':
        default:
          enemy.velocity.x *= 0.9;
          break;
      }
    }

    function initScene() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(backgroundConfig.fallbackColor);

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        backgroundConfig.backgroundURL,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          const imgAspect = texture.image.width / texture.image.height;
          const planeHeight = 140;
          const planeWidth = planeHeight * imgAspect;

          const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            depthWrite: false,
            toneMapped: false
          });
          const bgMesh = new THREE.Mesh(geometry, material);
          bgMesh.position.set(0, 20, -30);
          scene.add(bgMesh);

          scene.background = new THREE.Color(backgroundConfig.fallbackColor);
        },
        undefined,
        (err) => {
          console.error("Erreur lors du chargement de l'image de fond.", err);
          scene.background = new THREE.Color(backgroundConfig.fallbackColor);
        }
      );

      const aspect = window.innerWidth / window.innerHeight;
      camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
      camera.position.set(0, 15, 70);
      camera.lookAt(0, 3, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerEl.insertBefore(renderer.domElement, loadingEl);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      createFighters();
      loadModels();
    }

    function createFighters() {
      player1 = new Fighter({
        name: 'Linux',
        maxHealth: 100,
        attackPower: 10,
        originalPosition: new THREE.Vector3(-15, PHYSICS.GROUND_Y, 0),
        modelPath: modelPaths.linux,
        isPlayer: true,
        facingRight: true
      });

      player2 = new Fighter({
        name: 'Windows',
        maxHealth: 100,
        attackPower: 10,
        originalPosition: new THREE.Vector3(15, PHYSICS.GROUND_Y, 0),
        modelPath: modelPaths.windows,
        isPlayer: false,
        facingRight: false
      });
    }

    function loadModels() {
      let modelsToLoad = 2;
      const defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

      const onModelLoaded = (object: THREE.Group, fighter: Fighter) => {
        const mesh = object;

        mesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const meshChild = child as THREE.Mesh;
            if (!meshChild.material || (Array.isArray(meshChild.material) && meshChild.material.length === 0)) {
              meshChild.material = defaultMaterial;
            }

            if (fighter.modelPath === modelPaths.windows) {
              meshChild.geometry.rotateZ(Math.PI);
              meshChild.geometry.rotateY(Math.PI);
            }
          }
        });

        mesh.scale.set(4, 4, 4);
        mesh.position.copy(fighter.originalPosition);
        mesh.rotation.y = fighter.facingRight ? 0 : Math.PI;

        scene.add(mesh);
        fighter.mesh = mesh;

        modelsToLoad--;
        if (modelsToLoad === 0) {
          onAllModelsLoaded();
        }
      };

      const onError = (error: ErrorEvent | unknown, fighter: Fighter) => {
        console.error(`Erreur de chargement du modele ${fighter.name}:`, error);
        createFallbackMesh(fighter);
        modelsToLoad--;
        if (modelsToLoad === 0) {
          onAllModelsLoaded();
        }
      };

      loader.load(
        player1.modelPath,
        (object) => onModelLoaded(object, player1),
        undefined,
        (error) => onError(error, player1)
      );

      loader.load(
        player2.modelPath,
        (object) => onModelLoaded(object, player2),
        undefined,
        (error) => onError(error, player2)
      );
    }

    function createFallbackMesh(fighter: Fighter) {
      const boxGeometry = new THREE.BoxGeometry(4, 10, 4);
      const materialColor = fighter.isPlayer ? 0x6a0dad : 0xffd700;
      const material = new THREE.MeshLambertMaterial({ color: materialColor });
      const mesh = new THREE.Mesh(boxGeometry, material);
      mesh.position.copy(fighter.originalPosition);
      mesh.rotation.y = fighter.facingRight ? 0 : Math.PI;
      scene.add(mesh);
      fighter.mesh = mesh;
    }

    function onAllModelsLoaded() {
      gameState.modelsLoaded = true;
      loadingEl.style.display = 'none';
      updateConsole('Le combat commence ! Linux vs Windows !');
      createMenacingText();
    }

    function createMenacingText() {
      for (let i = 0; i < 6; i++) {
        spawnMenacingSymbol();
      }
    }

    function spawnMenacingSymbol() {
      if (!fxLayer) return;
      const el = document.createElement('div');
      el.className = 'menacing-text';
      el.textContent = 'ゴ';
      el.style.left = Math.random() * 80 + 10 + '%';
      el.style.top = Math.random() * 50 + 20 + '%';
      el.style.fontSize = 2.5 + Math.random() * 2 + 'rem';
      el.style.animationDelay = Math.random() * 2 + 's';
      fxLayer.appendChild(el);
      menacingElements.push(el);

      const intervalId = setInterval(() => {
        if (!gameState.isGameOver) {
          el.style.left = Math.random() * 80 + 10 + '%';
          el.style.top = Math.random() * 50 + 20 + '%';
        }
      }, 3000 + Math.random() * 2000);
      menacingIntervals.push(intervalId);
    }

    function spawnMenacingBurst(position: THREE.Vector3) {
      if (!fxLayer) return;
      for (let i = 0; i < 4; i++) {
        const el = document.createElement('div');
        el.className = 'menacing-text';
        el.textContent = 'ゴ';
        el.style.fontSize = 3 + Math.random() * 2 + 'rem';

        const screenPos = projectToScreen(position);
        el.style.left = screenPos.x + (Math.random() - 0.5) * 200 + 'px';
        el.style.top = screenPos.y - Math.random() * 150 + 'px';

        fxLayer.appendChild(el);
        setTimeout(() => el.remove(), 1500);
      }
    }

    function spawnText(pos: THREE.Vector3, str: string) {
      if (!fxLayer) return;
      const el = document.createElement('div');
      el.className = 'hit-text';
      el.textContent = str;

      const screenPos = projectToScreen(pos);
      el.style.left = screenPos.x + 'px';
      el.style.top = screenPos.y + 'px';

      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 500);
    }

    function showHitEffect(position: THREE.Vector3) {
      if (!fxLayer) return;
      const text = HIT_SOUNDS[Math.floor(Math.random() * HIT_SOUNDS.length)];
      const el = document.createElement('div');
      el.className = 'hit-text';
      el.textContent = text;

      const screenPos = projectToScreen(position);
      el.style.left = screenPos.x + (Math.random() - 0.5) * 100 + 'px';
      el.style.top = screenPos.y - 50 + 'px';

      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 600);
    }

    function showDamageEffect(x3d: number, y3d: number, damage: number) {
      if (!containerEl) return;
      const el = document.createElement('div');
      el.className = 'damage-effect';
      el.textContent = `-${damage}`;

      const screenPos = projectToScreen(new THREE.Vector3(x3d, y3d, 0));
      el.style.left = screenPos.x + 'px';
      el.style.top = screenPos.y + 'px';

      containerEl.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }

    function projectToScreen(position3D: THREE.Vector3) {
      if (!camera || !renderer) {
        return { x: 0, y: 0 };
      }

      const vector = new THREE.Vector3(position3D.x, position3D.y, position3D.z);
      vector.project(camera);

      return {
        x: (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth,
        y: (-vector.y * 0.5 + 0.5) * renderer.domElement.clientHeight
      };
    }

    function triggerCameraShake() {
      containerEl.classList.add('camera-shake');
      setTimeout(() => containerEl.classList.remove('camera-shake'), 300);
    }

    function activateSpeedLines() {
      speedOverlayEl.classList.add('active');
      setTimeout(() => speedOverlayEl.classList.remove('active'), 200);
    }

    function updateConsole(message: string) {
      consoleElement.textContent = message;
    }

    function updateHealthBars() {
      if (!player1 || !player2) return;

      const p1Percent = (player1.health / player1.maxHealth) * 100;
      const p2Percent = (player2.health / player2.maxHealth) * 100;

      p1FillEl.style.width = Math.max(0, p1Percent) + '%';
      p2FillEl.style.width = Math.max(0, p2Percent) + '%';
    }

    function endGame(winnerFighter: Fighter) {
      if (gameState.isGameOver) return;

      gameState.isGameOver = true;
      const didPlayerWin = winnerFighter === player1;
      setWinner(didPlayerWin ? 'linux' : 'windows');

      winnerTextEl.textContent = didPlayerWin
        ? 'Linux remporte la victoire !'
        : 'Windows a pris le dessus...';
      gameOverEl.classList.add('active');

      if (didPlayerWin) {
        gameOverEl.classList.remove('overlay-mode');
        tbcArrowEl.classList.remove('active');
      } else {
        document.body.style.filter = 'sepia(0.8) contrast(1.1)';
        tbcArrowEl.classList.add('active');
        gameOverEl.classList.add('overlay-mode');
        onDefeat?.();
      }
    }

    function restartGame() {
      setWinner(null);
      gameState.isGameOver = false;

      gameOverEl.classList.remove('active');
      gameOverEl.classList.remove('overlay-mode');
      tbcArrowEl.classList.remove('active');
      document.body.style.filter = '';
      winnerTextEl.textContent = '';

      player1.reset();
      player2.reset();

      updateHealthBars();
      updateConsole('Nouveau combat ! Linux vs Windows !');

      aiState.lastDecision = 0;
      aiState.currentAction = 'idle';
      gameState.lastTime = 0;
    }

    restartHandlerRef.current = restartGame;

    function animate(currentTime: number) {
      animationId = requestAnimationFrame(animate);

      if (!renderer || !scene || !camera) return;

      if (!gameState.modelsLoaded) {
        renderer.render(scene, camera);
        return;
      }

      const deltaTime = currentTime - gameState.lastTime;
      gameState.lastTime = currentTime;

      const cappedDelta = Math.min(deltaTime, 50);

      if (!gameState.isGameOver) {
        processPlayerInput();
        updateAI(player2, player1, currentTime);

        player1.update(cappedDelta);
        player2.update(cappedDelta);

        player1.facingRight = player2.position.x > player1.position.x;
        player2.facingRight = player1.position.x > player2.position.x;

        const minDistance = 4;
        const distance = player1.position.x - player2.position.x;
        if (Math.abs(distance) < minDistance) {
          const pushForce = (minDistance - Math.abs(distance)) / 2;
          if (distance > 0) {
            player1.position.x += pushForce;
            player2.position.x -= pushForce;
          } else {
            player1.position.x -= pushForce;
            player2.position.x += pushForce;
          }
        }
      }

      const midX = (player1.position.x + player2.position.x) / 2;
      const targetX = THREE.MathUtils.clamp(midX, -30, 30);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
      camera.lookAt(targetX, 3, 0);

      renderer.render(scene, camera);
    }

    function onWindowResize() {
      if (!renderer || !camera) return;
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    function init() {
      initScene();
      initInputHandlers();
      window.addEventListener('resize', onWindowResize);
      animate(0);
    }

    init();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      menacingIntervals.forEach((intervalId) => clearInterval(intervalId));
      menacingElements.forEach((el) => el.remove());
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss?.();
        renderer.domElement.remove();
      }
      scene?.clear();
      document.body.style.filter = '';
    };
  }, [onVictory, onDefeat]);

  const handlePrimaryAction = () => {
    if (winner === 'linux') {
      onVictory();
    } else {
      restartHandlerRef.current?.();
    }
  };

  return (
    <div className="fight-game">
      <div id="game-container" ref={containerRef}>
        <div className="health-bar-container">
          <div className="character-portrait p1-portrait">
            <img src="/linux-2048-2401704126.png" alt="Linux" />
          </div>
          <div id="player1-health" className="health-bar">
            <div id="player1-fill" className="health-bar-fill" ref={p1FillRef} style={{ width: '100%' }} />
          </div>

          <div className="vs-badge">VS</div>

          <div id="player2-health" className="health-bar">
            <div id="player2-fill" className="health-bar-fill" ref={p2FillRef} style={{ width: '100%' }} />
          </div>
          <div className="character-portrait p2-portrait">
            <img src="/Windows-Logo-2342610881.png" alt="Windows" />
          </div>
        </div>

        <div id="console" ref={consoleRef} />

        <div id="loading-indicator" ref={loadingRef}>
          Chargement des modeles 3D...
        </div>

        <div className="speed-lines" id="speed-overlay" ref={speedOverlayRef} />

        <div id="fx-layer" ref={fxLayerRef} />

        <div id="game-over" className="ko-screen" ref={gameOverRef}>
          <h1>{winner === 'linux' ? 'VICTOIRE' : 'K.O.'}</h1>
          <div className="winner-text" id="winner-text" ref={winnerTextRef} />
          <button className="retry-button" onClick={handlePrimaryAction}>
            {winner === 'linux' ? 'Continuer' : 'Retry'}
          </button>
        </div>

        <div className="to-be-continued" id="tbc-arrow" ref={tbcArrowRef}>
          <div className="arrow" />
          <div className="text">To Be Continued...</div>
        </div>

        <div className="controls-hint">
          <span>[A/D]</span> Deplacement <span>[ESPACE]</span> Sauter <span>[J]</span> Attaque (ORA!) <span>[L]</span>{' '}
          Pose
        </div>
      </div>
    </div>
  );
});

BattleScene.displayName = 'BattleScene';
