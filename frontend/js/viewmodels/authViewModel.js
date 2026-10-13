// js/viewmodels/authViewModel.js

class AuthViewModel {
  constructor() {
    this.state = new Observable({
      isLoading: false,
      isLoginMode: true,      // true = aba "Entrar"; false = aba "Criar conta"
      feedback: null,         // { type: 'error' | 'success' | 'info', text }
      fieldErrors: {}         // { name, email, password, confirmPassword }
    });
  }

  // Comando das abas
  setMode(isLoginMode) {
    this.state.value = {
      ...this.state.value,
      isLoginMode,
      feedback: null,
      fieldErrors: {}
    };
  }

  // ---------- Validadores puros (regra de negócio fica no ViewModel) ----------
  _validateName(name) {
    const v = (name || '').trim();
    if (!v) return 'Informe seu nome completo.';
    // Nome e sobrenome, apenas letras (inclui acentos) e espaços
    if (!/^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/.test(v)) return 'formato de nome inválido';
    return null;
  }

  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test((email || '').trim())) return 'E-mail incompleto ou formato inválido';
    return null;
  }

  _validatePassword(password) {
    if ((password || '').length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
    return null;
  }

  _validateConfirm(password, confirm) {
    if (password !== confirm) return 'As senhas não coincidem.';
    return null;
  }

  // Valida um único campo — usado no blur (requisito de formulário do edital)
  validateField(field, value, extra = {}) {
    let msg = null;
    if (field === 'name') msg = this._validateName(value);
    else if (field === 'email') msg = this._validateEmail(value);
    else if (field === 'password') msg = this._validatePassword(value);
    else if (field === 'confirmPassword') msg = this._validateConfirm(extra.password, value);

    const fieldErrors = { ...this.state.value.fieldErrors };
    if (msg) fieldErrors[field] = msg;
    else delete fieldErrors[field];

    this.state.value = { ...this.state.value, fieldErrors };
  }

  // Limpa o erro de um campo assim que o usuário começa a corrigi-lo
  clearFieldError(field) {
    if (!this.state.value.fieldErrors[field]) return;
    const fieldErrors = { ...this.state.value.fieldErrors };
    delete fieldErrors[field];
    this.state.value = { ...this.state.value, fieldErrors };
  }

  // ---------- Comandos ----------
  async login(email, password) {
    const fieldErrors = {};
    const eErr = this._validateEmail(email);
    if (eErr) fieldErrors.email = eErr;
    const pErr = this._validatePassword(password);
    if (pErr) fieldErrors.password = pErr;

    if (Object.keys(fieldErrors).length > 0) {
      this.state.value = { ...this.state.value, fieldErrors, feedback: null };
      return;
    }

    this.state.value = { ...this.state.value, isLoading: true, fieldErrors: {}, feedback: null };

    try {
      const res = await ApiService.login(email, password);
      if (res.ok) {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('authUser', res.name || '');
        localStorage.setItem('authEmail', email);
        this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'success', text: 'Login realizado!' } };
        window.location.href = 'catalogo.html';
      } else {
        this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: res.error } };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: 'Erro de conexão.' } };
    }
  }

  async register(name, email, password, confirmPassword) {
    const fieldErrors = {};
    const nErr = this._validateName(name);
    if (nErr) fieldErrors.name = nErr;
    const eErr = this._validateEmail(email);
    if (eErr) fieldErrors.email = eErr;
    const pErr = this._validatePassword(password);
    if (pErr) fieldErrors.password = pErr;
    const cErr = this._validateConfirm(password, confirmPassword);
    if (cErr) fieldErrors.confirmPassword = cErr;

    if (Object.keys(fieldErrors).length > 0) {
      this.state.value = { ...this.state.value, fieldErrors, feedback: null };
      return;
    }

    this.state.value = { ...this.state.value, isLoading: true, fieldErrors: {}, feedback: null };

    try {
      const res = await ApiService.register(name, email, password);
      if (res.ok) {
        // Volta para a aba de login já com a mensagem de sucesso
        this.state.value = {
          isLoading: false,
          isLoginMode: true,
          feedback: { type: 'success', text: 'Conta criada com sucesso! Faça seu login.' },
          fieldErrors: {}
        };
      } else {
        this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: res.error } };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: 'Erro de conexão.' } };
    }
  }

  // Botão "Entrar com Google" — sem backend, apenas informa que é um protótipo
  googleAuth() {
    this.state.value = {
      ...this.state.value,
      feedback: { type: 'info', text: 'Login com Google ainda não está disponível neste protótipo.' }
    };
  }
}

const authViewModel = new AuthViewModel();
