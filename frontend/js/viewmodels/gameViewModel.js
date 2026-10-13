// js/viewmodels/gameViewModel.js

// Fases: 'idle' (parado) | 'playing' | 'confirm' (pedindo para reiniciar) | 'over'
class GameViewModel {
  constructor() {
    this.game = null;                                 // CosmoGame da partida atual
    this.input = { left: false, right: false, fire: false };

    this.state = new Observable({
      isLoading: true,
      phase: 'idle',
      score: 0,
      lives: START_LIVES,
      lastEarned: 0,
      stats: new ArcadeStats({ points: 0, hiScore: 0, playsDate: '', playsToday: 0 }),
      error: null
    });
  }

  async loadStats() {
    try {
      const res = await ApiService.getArcadeStats();
      this._patch({ isLoading: false, stats: new ArcadeStats(res.data) });
    } catch (err) {
      this._patch({ isLoading: false, error: 'Falha ao carregar seus pontos.' });
    }
  }

  // ---------- Comandos ----------
  // Botão principal: inicia uma partida ou, durante o jogo, pede para reiniciar
  primaryAction() {
    const { phase } = this.state.value;
    if (phase === 'playing') this.requestRestart();
    else if (phase === 'idle' || phase === 'over') this.startGame();
  }

  startGame() {
    const { stats } = this.state.value;
    if (stats.playsLeft === 0) {
      this._patch({ error: 'Você já usou as 3 partidas de hoje. Volte amanhã!' });
      return;
    }

    // A partida conta assim que começa (recarregar a página não devolve a tentativa)
    const updated = new ArcadeStats({ ...stats, playsToday: stats.playsToday + 1 });
    ApiService.saveArcadeStats(updated);

    this.game = new CosmoGame();
    this.resetInput();
    this._patch({
      phase: 'playing',
      score: 0,
      lives: this.game.lives,
      lastEarned: 0,
      stats: updated,
      error: null
    });
  }

  requestRestart() {
    if (this.state.value.phase !== 'playing') return;
    this.resetInput();
    this._patch({ phase: 'confirm' });   // jogo fica pausado enquanto confirma
  }

  cancelRestart() {
    if (this.state.value.phase !== 'confirm') return;
    this._patch({ phase: 'playing' });
  }

  // Encerra a partida atual (os pontos feitos contam) e começa outra se houver tentativa
  confirmRestart() {
    if (this.state.value.phase !== 'confirm') return;
    this._finishGame();
    if (this.state.value.stats.playsLeft > 0) this.startGame();
  }

  setInput(action, pressed) {
    if (action in this.input) this.input[action] = pressed;
  }

  resetInput() {
    this.input = { left: false, right: false, fire: false };
  }

  isPlaying() {
    return this.state.value.phase === 'playing';
  }

  // Chamado a cada quadro pela View; só publica estado quando placar/vidas mudam
  tick(dt) {
    if (!this.isPlaying() || !this.game) return;
    this.game.update(dt, this.input);

    const { score, lives } = this.state.value;
    if (this.game.score !== score || this.game.lives !== lives) {
      this._patch({ score: this.game.score, lives: this.game.lives });
    }
    if (this.game.over) this._finishGame();
  }

  // ---------- Internos ----------
  _finishGame() {
    const { stats } = this.state.value;
    const earned = this.game ? this.game.score : 0;
    const updated = new ArcadeStats({
      ...stats,
      points: stats.points + earned,
      hiScore: Math.max(stats.hiScore, earned)
    });
    ApiService.saveArcadeStats(updated);

    this.resetInput();
    this._patch({ phase: 'over', score: earned, lastEarned: earned, stats: updated });
  }

  _patch(props) {
    this.state.value = { ...this.state.value, ...props };
  }
}

const gameViewModel = new GameViewModel();
