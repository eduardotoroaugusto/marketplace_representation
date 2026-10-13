// js/views/gameView.js

class GameView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.monitorEl = document.getElementById('arcade-monitor');

    this.pointsEl = document.getElementById('points-balance');
    this.scoreEl = document.getElementById('score-value');
    this.hiScoreEl = document.getElementById('hiscore-value');
    this.livesBoardEl = document.getElementById('lives-board');
    this.livesEl = document.getElementById('lives-value');

    this.overlayOverEl = document.getElementById('overlay-over');
    this.overlayOverTextEl = document.getElementById('overlay-over-text');
    this.overlayConfirmEl = document.getElementById('overlay-confirm');
    this.confirmTextEl = document.getElementById('confirm-text');
    this.confirmBtnEl = document.getElementById('btn-confirm-restart');
    this.cancelBtnEl = document.getElementById('btn-cancel-restart');

    this.playBtnEl = document.getElementById('btn-play');
    this.playLabelEl = document.getElementById('btn-play-label');
    this.limitEl = document.getElementById('play-limit');
    this.errorEl = document.getElementById('play-error');
    this.sessionCountEl = document.getElementById('session-count');
    this.sessionTextEl = document.getElementById('session-text');

    // Sprites exportados do Figma
    this.sprites = {
      red: this._loadSprite('assets/icons/alien-red.svg'),
      yellow: this._loadSprite('assets/icons/alien-yellow.svg'),
      player: this._loadSprite('assets/icons/player-ship.svg')
    };

    this.rafId = null;
    this.lastTime = 0;
    this.lastPhase = null;
    this.previewAliens = [];

    // Mesmo breakpoint do CSS: abaixo dele o monitor segue o design mobile
    this.mobileQuery = window.matchMedia('(max-width: 600px)');
  }

  init() {
    this.applyLayout();
    this.mobileQuery.addEventListener('change', () => this.applyLayout());
    this.viewModel.state.subscribe(state => this.render(state));
  }

  // Ajusta o canvas ao layout do ViewModel (resolução multiplicada pela densidade da tela)
  applyLayout() {
    this.viewModel.setLayout(this.mobileQuery.matches ? 'mobile' : 'desktop');
    const { width, height } = this.viewModel.layout;
    const scale = Math.max(1, Math.round(window.devicePixelRatio || 1));
    this.canvas.width = width * scale;
    this.canvas.height = height * scale;
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
    this.previewAliens = CosmoGame.formation(this.viewModel.layout);
    if (!this.rafId) this.draw();
  }

  render(state) {
    this.renderScores(state);
    this.renderOverlays(state);
    this.renderControls(state);
    this.renderSession(state);
    this.handlePhaseChange(state);
    if (!this.rafId) this.draw(); // fora do loop, redesenha o quadro estático
  }

  // ---------- HUD ----------
  renderScores(state) {
    const hiScore = Math.max(state.stats.hiScore, state.score);
    this.pointsEl.textContent = state.stats.points;
    this.scoreEl.textContent = this.pad(state.score);
    this.hiScoreEl.textContent = this.pad(hiScore);
    this.livesEl.textContent = state.lives;
    // Vidas só fazem sentido com uma partida em andamento
    this.livesBoardEl.classList.toggle('hidden', state.phase === 'idle');
  }

  renderOverlays(state) {
    this.overlayOverEl.classList.toggle('hidden', state.phase !== 'over');
    if (state.phase === 'over') {
      this.overlayOverTextEl.textContent = state.lastEarned > 0
        ? `+${state.lastEarned} pontos adicionados ao seu saldo.`
        : 'Nenhum alien derrotado desta vez. Tente de novo!';
    }

    this.overlayConfirmEl.classList.toggle('hidden', state.phase !== 'confirm');
    if (state.phase === 'confirm') {
      const left = state.stats.playsLeft;
      this.confirmTextEl.textContent = left > 0
        ? `A partida atual termina agora (os pontos feitos contam) e uma nova começa. Restam ${left} hoje.`
        : 'A partida atual termina agora (os pontos feitos contam). Não restam partidas hoje.';
      this.confirmBtnEl.textContent = left > 0 ? 'Reiniciar' : 'Encerrar partida';
    }
  }

  renderControls(state) {
    const left = state.stats.playsLeft;
    const blocked = !state.isLoading && left === 0 && state.phase !== 'playing' && state.phase !== 'confirm';

    if (state.phase === 'playing' || state.phase === 'confirm') {
      this.playLabelEl.textContent = 'Reiniciar partida';
    } else if (blocked) {
      this.playLabelEl.textContent = 'Limite diário atingido';
    } else {
      this.playLabelEl.textContent = state.phase === 'over' ? 'Jogar novamente' : 'Jogar Cosmo Invaders';
    }
    this.playBtnEl.disabled = state.isLoading || blocked || state.phase === 'confirm';

    this.limitEl.textContent = `Limite diário: ${MAX_PLAYS_PER_DAY} partidas (Restam ${left} hoje)`;

    this.errorEl.textContent = state.error || '';
    this.errorEl.classList.toggle('hidden', !state.error);
  }

  renderSession(state) {
    const left = state.stats.playsLeft;
    this.sessionCountEl.textContent = `${state.stats.playsToday} / ${MAX_PLAYS_PER_DAY}`;
    if (left === 0) {
      this.sessionTextEl.textContent = 'Você usou todas as partidas de hoje. Volte amanhã!';
    } else {
      this.sessionTextEl.textContent = `Você ainda pode jogar ${left} partida${left > 1 ? 's' : ''} hoje.`;
    }
  }

  // Loop de animação e foco previsível em cada troca de fase
  handlePhaseChange(state) {
    if (state.phase === this.lastPhase) return;
    const previous = this.lastPhase;
    this.lastPhase = state.phase;

    if (state.phase === 'playing') {
      this.startLoop();
      this.monitorEl.focus(); // tira o foco do botão para o ESPAÇO não acioná-lo
    } else {
      this.stopLoop();
      // Se a tela mudou de tamanho durante a partida, o novo layout entra agora
      if (state.phase === 'over') this.applyLayout();
    }

    if (state.phase === 'confirm') this.cancelBtnEl.focus();
    if (state.phase === 'over' && previous) this.playBtnEl.focus();
  }

  startLoop() {
    if (this.rafId) return;
    this.lastTime = performance.now();
    const frame = (now) => {
      // Limita o passo para a simulação não "pular" após a aba ficar em segundo plano
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;
      this.viewModel.tick(dt);
      this.draw();
      if (this.rafId) this.rafId = requestAnimationFrame(frame);
    };
    this.rafId = requestAnimationFrame(frame);
  }

  stopLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  // ---------- Canvas ----------
  draw() {
    const ctx = this.ctx;
    const game = this.viewModel.game;
    const layout = this.viewModel.layout;
    ctx.clearRect(0, 0, layout.width, layout.height);

    // Sem partida: mostra a formação do design com a nave centralizada
    const aliens = game ? game.aliens : this.previewAliens;
    aliens.filter(a => a.alive).forEach(a => this.drawSprite(this.sprites[a.color], a));

    if (game) {
      ctx.fillStyle = '#4AADE0';
      game.shots.forEach(s => ctx.fillRect(s.x, s.y, s.w, s.h));
      game.bombs.forEach(b => {
        ctx.fillStyle = b.color === 'red' ? '#EF4444' : '#F0B429';
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });
    }

    const player = game ? game.player : CosmoGame.startPlayer(layout);
    // Pisca enquanto está invulnerável após ser atingido
    const blinking = game && game.invulnerable > 0 && Math.floor(game.invulnerable * 10) % 2 === 0;
    if (!blinking) this.drawSprite(this.sprites.player, player);
  }

  drawSprite(img, box) {
    if (img.complete && img.naturalWidth) this.ctx.drawImage(img, box.x, box.y, box.w, box.h);
  }

  _loadSprite(src) {
    const img = new Image();
    img.onload = () => { if (!this.rafId) this.draw(); };
    img.src = src;
    return img;
  }

  pad(n) {
    return String(n).padStart(4, '0');
  }
}
