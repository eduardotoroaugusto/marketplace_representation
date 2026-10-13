// js/views/profileView.js

class ProfileView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.populated = false;
    this.formEl = document.getElementById('profile-form');
    this.feedbackEl = document.getElementById('profile-feedback');
    this.saveBtn = document.getElementById('btn-save-profile');
    // Campos editáveis mapeados por chave do modelo
    this.fields = ['name', 'phone', 'cpf', 'cep', 'address'];
  }

  init() {
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    // 1. Popula os inputs apenas uma vez (não redesenha enquanto o usuário digita)
    if (state.profile && !this.populated) {
      this.fields.forEach(f => {
        const input = this.formEl.querySelector(`[data-field="${f}"]`);
        if (input) input.value = state.profile[f] || '';
      });
      const emailInput = this.formEl.querySelector('[data-field="email"]');
      if (emailInput) emailInput.value = state.profile.email || '';
      this.populated = true;
    }

    // 2. Estado do botão salvar
    if (this.saveBtn) {
      this.saveBtn.disabled = state.isSaving;
      this.saveBtn.textContent = state.isSaving ? 'Salvando...' : 'Salvar alterações';
    }

    // 3. Feedback geral
    if (state.feedback) {
      this.feedbackEl.textContent = state.feedback.text;
      this.feedbackEl.className = `feedback-message ${state.feedback.type}`;
    } else {
      this.feedbackEl.className = 'feedback-message hidden';
    }

    // 4. Erros por campo
    this.renderFieldErrors(state);
  }

  renderFieldErrors(state) {
    this.formEl.querySelectorAll('[data-error-for]').forEach(errorEl => {
      const key = errorEl.getAttribute('data-error-for');
      const msg = state.fieldErrors[key];
      const input = this.formEl.querySelector(`[data-field="${key}"]`);
      const wrap = input ? input.closest('.input-wrap') : null;

      if (msg) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        if (wrap) wrap.classList.add('has-error');
      } else {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
        if (wrap) wrap.classList.remove('has-error');
      }
    });
  }
}
