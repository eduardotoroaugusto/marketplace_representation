// js/models/cosmoGame.js

// Simulação do Cosmo Invaders: só posições, colisões e placar (sem DOM).
// Coordenadas no espaço interno do monitor do Figma (1192 x 412).
const GAME_WIDTH = 1192;
const GAME_HEIGHT = 412;

const ALIEN_W = 59.913;
const ALIEN_H = 49.927;
const ALIEN_GAP_X = 34.949;
const ALIEN_GAP_Y = 19.971;
const FORMATION_X = 415;     // canto superior esquerdo da formação no Figma
const FORMATION_Y = 78;
const FORMATION_ROWS = [
  { color: 'red',    count: 4, offset: 0,      points: 20 },
  { color: 'yellow', count: 3, offset: 29.956, points: 10 }
];

const PLAYER_W = 57.431;
const PLAYER_H = 42.45;
const PLAYER_Y = 336;
const PLAYER_SPEED = 380;    // px/s
const SHOT_SPEED = 560;
const SHOT_COOLDOWN = 0.35;  // s entre tiros
const MAX_SHOTS = 2;
const EDGE = 12;             // margem lateral dos aliens
const STEP_DOWN = 24;        // descida ao bater na borda
const START_LIVES = 3;
const HIT_INVULNERABLE = 1.2; // s piscando após ser atingido

class CosmoGame {
  constructor(random = Math.random) {
    this.random = random;
    this.score = 0;
    this.lives = START_LIVES;
    this.wave = 1;
    this.over = false;
    this.player = { x: (GAME_WIDTH - PLAYER_W) / 2, y: PLAYER_Y, w: PLAYER_W, h: PLAYER_H };
    this.shots = [];
    this.bombs = [];
    this.cooldown = 0;
    this.invulnerable = 0;
    this._spawnWave();
  }

  // Formação inicial idêntica ao design (usada também na tela parada)
  static formation() {
    const aliens = [];
    FORMATION_ROWS.forEach((row, r) => {
      for (let i = 0; i < row.count; i++) {
        aliens.push({
          x: FORMATION_X + row.offset + i * (ALIEN_W + ALIEN_GAP_X),
          y: FORMATION_Y + r * (ALIEN_H + ALIEN_GAP_Y),
          w: ALIEN_W,
          h: ALIEN_H,
          color: row.color,
          points: row.points,
          alive: true
        });
      }
    });
    return aliens;
  }

  _spawnWave() {
    this.aliens = CosmoGame.formation();
    this.direction = 1;
    this.baseSpeed = 70 + (this.wave - 1) * 20;
    this.bombTimer = 1.2;
    this.shots = [];
    this.bombs = [];
  }

  // Avança a simulação dt segundos. input = { left, right, fire }
  update(dt, input) {
    if (this.over) return;

    this._movePlayer(dt, input);
    this._fire(dt, input);
    this._moveShots(dt);
    this._moveAliens(dt);
    this._dropBombs(dt);
    this._moveBombs(dt);
    this._checkShotHits();
    this._checkBombHits();

    const alive = this.aliens.filter(a => a.alive);
    if (alive.some(a => a.y + a.h >= this.player.y)) this.over = true; // invasão
    if (this.lives <= 0) this.over = true;

    if (!this.over && alive.length === 0) {
      this.wave += 1;
      this._spawnWave();
    }
  }

  _movePlayer(dt, input) {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const maxX = GAME_WIDTH - EDGE - this.player.w;
    this.player.x = Math.min(maxX, Math.max(EDGE, this.player.x + dir * PLAYER_SPEED * dt));
    if (this.invulnerable > 0) this.invulnerable = Math.max(0, this.invulnerable - dt);
  }

  _fire(dt, input) {
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (input.fire && this.cooldown === 0 && this.shots.length < MAX_SHOTS) {
      this.shots.push({ x: this.player.x + this.player.w / 2 - 1.5, y: this.player.y - 12, w: 3, h: 12 });
      this.cooldown = SHOT_COOLDOWN;
    }
  }

  _moveShots(dt) {
    this.shots.forEach(s => { s.y -= SHOT_SPEED * dt; });
    this.shots = this.shots.filter(s => s.y + s.h > 0);
  }

  _moveAliens(dt) {
    const alive = this.aliens.filter(a => a.alive);
    if (alive.length === 0) return;

    // Fica mais rápido conforme os aliens são derrotados
    const killed = this.aliens.length - alive.length;
    const speed = this.baseSpeed * (1 + killed * 0.12);
    const dx = this.direction * speed * dt;

    const minX = Math.min(...alive.map(a => a.x)) + dx;
    const maxX = Math.max(...alive.map(a => a.x + a.w)) + dx;

    if (minX < EDGE || maxX > GAME_WIDTH - EDGE) {
      this.direction *= -1;
      this.aliens.forEach(a => { a.y += STEP_DOWN; });
    } else {
      this.aliens.forEach(a => { a.x += dx; });
    }
  }

  _dropBombs(dt) {
    this.bombTimer -= dt;
    if (this.bombTimer > 0) return;
    this.bombTimer = Math.max(0.45, 1.4 - this.wave * 0.15) * (0.6 + this.random() * 0.8);

    // Só o alien mais baixo de cada coluna pode atirar
    const alive = this.aliens.filter(a => a.alive);
    const shooters = alive.filter(a => !alive.some(b =>
      b !== a && b.y > a.y && Math.abs(b.x - a.x) < a.w
    ));
    if (shooters.length === 0) return;

    const shooter = shooters[Math.floor(this.random() * shooters.length)];
    this.bombs.push({
      x: shooter.x + shooter.w / 2 - 1.5,
      y: shooter.y + shooter.h,
      w: 3,
      h: 10,
      color: shooter.color,
      speed: 200 + this.wave * 20
    });
  }

  _moveBombs(dt) {
    this.bombs.forEach(b => { b.y += b.speed * dt; });
    this.bombs = this.bombs.filter(b => b.y < GAME_HEIGHT);
  }

  _checkShotHits() {
    this.shots = this.shots.filter(shot => {
      const target = this.aliens.find(a => a.alive && overlaps(shot, a));
      if (!target) return true;
      target.alive = false;
      this.score += target.points;
      return false;
    });
  }

  _checkBombHits() {
    // Caixa de colisão um pouco menor que o desenho do raio
    const p = this.player;
    const hitbox = { x: p.x + 8, y: p.y + 6, w: p.w - 16, h: p.h - 12 };
    this.bombs = this.bombs.filter(bomb => {
      if (!overlaps(bomb, hitbox)) return true;
      if (this.invulnerable === 0) {
        this.lives -= 1;
        this.invulnerable = HIT_INVULNERABLE;
      }
      return false;
    });
  }
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
