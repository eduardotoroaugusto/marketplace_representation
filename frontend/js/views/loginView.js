// js/views/loginView.js

class LoginView {
  constructor(viewModel) {
    this.viewModel = viewModel;
    this.tabLogin = document.getElementById('tab-login');
    this.tabRegister = document.getElementById('tab-register');
    this.loginForm = document.getElementById('login-form');
    this.registerForm = document.getElementById('register-form');
    this.btnLogin = document.getElementById('btn-login-submit');
    this.btnRegister = document.getElementById('btn-register-submit');
    this.feedbackEl = document.getElementById('auth-feedback');
  }

  init() {
    // A View apenas escuta o estado e redesenha; nunca contém regra de negócio
    this.viewModel.state.subscribe(state => this.render(state));
  }

  render(state) {
    // 1. Abas ativas + formulário visível
    this.tabLogin.classList.toggle('active', state.isLoginMode);
    this.tabRegister.classList.toggle('active', !state.isLoginMode);
    this.loginForm.classList.toggle('hidden', !state.isLoginMode);
    this.registerForm.classList.toggle('hidden', state.isLoginMode);

    // 2. Estado de carregamento do botão do formulário ativo
    if (state.isLoading) {
      const btn = state.isLoginMode ? this.btnLogin : this.btnRegister;
      btn.disabled = true;
      btn.textContent = 'Aguarde...';
    } else {
      this.btnLogin.disabled = false;
      this.btnLogin.textContent = 'Entrar';
      this.btnRegister.disabled = false;
      this.btnRegister.textContent = 'Criar Conta';
    }

    // 3. Feedback geral (erro de API / sucesso / info)
    if (state.feedback) {
      this.feedbackEl.textContent = state.feedback.text;
      this.feedbackEl.className = `feedback-message ${state.feedback.type}`;
    } else {
      this.feedbackEl.className = 'feedback-message hidden';
    }

    // 4. Erros inline por campo
    this.renderFieldErrors(state);
  }

  renderFieldErrors(state) {
    const form = state.isLoginMode ? this.loginForm : this.registerForm;

    form.querySelectorAll('[data-error-for]').forEach(errorEl => {
      const key = errorEl.getAttribute('data-error-for');
      const msg = state.fieldErrors[key];
      const input = form.querySelector(`[data-field="${key}"]`);
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
