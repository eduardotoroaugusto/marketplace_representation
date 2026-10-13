// js/models/cosmoGame.js

// Simulação do Cosmo Invaders: só posições, colisões e placar (sem DOM).
// As coordenadas seguem o espaço interno do monitor de cada design do Figma:
// desktop (1192 x 412) e mobile (334 x 212). Velocidades são definidas no
// espaço desktop e convertidas por speedX/speedY para o layout menor.
const GAME_LAYOUTS = {
  desktop: {
    width: 1192,
    height: 412,
    alien: { w: 59.913, h: 49.927, gapX: 34.949, gapY: 19.971 },
    formation: { x: 415, y: 78, rowOffsets: [0, 29.956] }, // canto superior esquerdo no Figma
    player: { w: 57.431, h: 42.45, y: 336 },
    shot: { w: 3, h: 12 },
    bomb: { w: 3, h: 10 },
    hitInset: { x: 8, y: 6 },  // caixa de colisão um pouco menor que o desenho do raio
    edge: 12,                  // margem lateral dos aliens
    stepDown: 24,              // descida ao bater na borda
    speedX: 1,
    speedY: 1,
    bombSpeed: 1
  },
  mobile: {
    width: 334,
    height: 212,
    alien: { w: 24, h: 20, gapX: 14, gapY: 8 },
    formation: { x: 98, y: 87, rowOffsets: [0, 25] },
    player: { w: 28, h: 18, y: 178 },
    shot: { w: 2, h: 7 },
    bomb: { w: 2, h: 6 },
    hitInset: { x: 4, y: 3 },
    edge: 6,
    stepDown: 7.5,             // mantém ~o mesmo número de descidas até a nave
    speedX: 0.5,
    speedY: 0.515,
    bombSpeed: 0.32            // bombas mais lentas: o espaço até a nave é bem menor
  }
};

const FORMATION_ROWS = [
  { color: 'red',    count: 4, points: 20 },
  { color: 'yellow', count: 3, points: 10 }
];

const PLAYER_SPEED = 380;    // px/s (espaço desktop)
const SHOT_SPEED = 560;
const SHOT_COOLDOWN = 0.35;  // s entre tiros
const MAX_SHOTS = 2;
const START_LIVES = 3;
const HIT_INVULNERABLE = 1.2; // s piscando após ser atingido

class CosmoGame {
  constructor(random = Math.random, layout = GAME_LAYOUTS.desktop) {
    this.random = random;
    this.layout = layout;
    this.score = 0;
    this.lives = START_LIVES;
    this.wave = 1;
    this.over = false;
    this.player = CosmoGame.startPlayer(layout);
    this.shots = [];
    this.bombs = [];
    this.cooldown = 0;
    this.invulnerable = 0;
    this._spawnWave();
  }

  // Nave centralizada na posição do design
  static startPlayer(layout = GAME_LAYOUTS.desktop) {
    const { w, h, y } = layout.player;
    return { x: (layout.width - w) / 2, y, w, h };
  }

  // Formação inicial idêntica ao design (usada também na tela parada)
  static formation(layout = GAME_LAYOUTS.desktop) {
    const { alien, formation } = layout;
    const aliens = [];
    FORMATION_ROWS.forEach((row, r) => {
      for (let i = 0; i < row.count; i++) {
        aliens.push({
          x: formation.x + formation.rowOffsets[r] + i * (alien.w + alien.gapX),
          y: formation.y + r * (alien.h + alien.gapY),
          w: alien.w,
          h: alien.h,
          color: row.color,
          points: row.points,
          alive: true
        });
      }
    });
    return aliens;
  }

  _spawnWave() {
    this.aliens = CosmoGame.formation(this.layout);
    this.direction = 1;
    this.baseSpeed = (70 + (this.wave - 1) * 20) * this.layout.speedX;
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
    const { width, edge, speedX } = this.layout;
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const maxX = width - edge - this.player.w;
    this.player.x = Math.min(maxX, Math.max(edge, this.player.x + dir * PLAYER_SPEED * speedX * dt));
    if (this.invulnerable > 0) this.invulnerable = Math.max(0, this.invulnerable - dt);
  }

  _fire(dt, input) {
    const { shot } = this.layout;
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (input.fire && this.cooldown === 0 && this.shots.length < MAX_SHOTS) {
      this.shots.push({
        x: this.player.x + this.player.w / 2 - shot.w / 2,
        y: this.player.y - shot.h,
        w: shot.w,
        h: shot.h
      });
      this.cooldown = SHOT_COOLDOWN;
    }
  }

  _moveShots(dt) {
    const speed = SHOT_SPEED * this.layout.speedY;
    this.shots.forEach(s => { s.y -= speed * dt; });
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

    const { width, edge, stepDown } = this.layout;
    if (minX < edge || maxX > width - edge) {
      this.direction *= -1;
      this.aliens.forEach(a => { a.y += stepDown; });
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

    const { bomb, bombSpeed } = this.layout;
    const shooter = shooters[Math.floor(this.random() * shooters.length)];
    this.bombs.push({
      x: shooter.x + shooter.w / 2 - bomb.w / 2,
      y: shooter.y + shooter.h,
      w: bomb.w,
      h: bomb.h,
      color: shooter.color,
      speed: (200 + this.wave * 20) * bombSpeed
    });
  }

  _moveBombs(dt) {
    this.bombs.forEach(b => { b.y += b.speed * dt; });
    this.bombs = this.bombs.filter(b => b.y < this.layout.height);
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
    const p = this.player;
    const { x: ix, y: iy } = this.layout.hitInset;
    const hitbox = { x: p.x + ix, y: p.y + iy, w: p.w - 2 * ix, h: p.h - 2 * iy };
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
