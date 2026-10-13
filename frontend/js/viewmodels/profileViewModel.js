// js/viewmodels/profileViewModel.js

class ProfileViewModel {
  constructor() {
    this.state = new Observable({
      isLoading: false,
      isSaving: false,
      profile: null,       // instância de UserProfile
      feedback: null,      // { type: 'success' | 'error', text }
      fieldErrors: {}      // { name, phone, cpf, cep, address }
    });
  }

  async loadProfile() {
    this.state.value = { ...this.state.value, isLoading: true, feedback: null };
    try {
      const res = await ApiService.getProfile();
      if (res.ok) {
        this.state.value = { ...this.state.value, isLoading: false, profile: new UserProfile(res.data) };
      } else {
        this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: 'Erro ao carregar o perfil.' } };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isLoading: false, feedback: { type: 'error', text: 'Falha de comunicação.' } };
    }
  }

  // Mantém o campo editado no estado (fonte da verdade do formulário)
  updateField(field, value) {
    const profile = { ...this.state.value.profile, [field]: value };
    this.state.value = { ...this.state.value, profile };
  }

  // ---------- Validadores ----------
  _validate(field, value) {
    const v = (value || '').trim();
    switch (field) {
      case 'name':
        if (!v) return 'Informe o nome completo.';
        if (!/^[A-Za-zÀ-ÿ]+(\s+[A-Za-zÀ-ÿ]+)+$/.test(v)) return 'Nome e sobrenome, apenas letras.';
        return null;
      case 'phone':
        if (!/^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(v)) return 'Telefone no formato (11) 98765-4321.';
        return null;
      case 'cpf':
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v)) return 'CPF no formato 123.456.789-00.';
        return null;
      case 'cep':
        if (!/^\d{5}-?\d{3}$/.test(v)) return 'CEP no formato 01311-200.';
        return null;
      case 'address':
        if (!v) return 'Informe o logradouro.';
        return null;
      default:
        return null;
    }
  }

  // Valida um único campo (usado no blur)
  validateField(field, value) {
    const msg = this._validate(field, value);
    const fieldErrors = { ...this.state.value.fieldErrors };
    if (msg) fieldErrors[field] = msg;
    else delete fieldErrors[field];
    this.state.value = { ...this.state.value, fieldErrors };
  }

  clearFieldError(field) {
    if (!this.state.value.fieldErrors[field]) return;
    const fieldErrors = { ...this.state.value.fieldErrors };
    delete fieldErrors[field];
    this.state.value = { ...this.state.value, fieldErrors };
  }

  async save() {
    const p = this.state.value.profile || {};
    const campos = ['name', 'phone', 'cpf', 'cep', 'address'];
    const fieldErrors = {};
    campos.forEach(f => {
      const msg = this._validate(f, p[f]);
      if (msg) fieldErrors[f] = msg;
    });

    if (Object.keys(fieldErrors).length > 0) {
      this.state.value = { ...this.state.value, fieldErrors, feedback: { type: 'error', text: 'Corrija os campos destacados.' } };
      return;
    }

    this.state.value = { ...this.state.value, isSaving: true, fieldErrors: {}, feedback: null };
    try {
      const res = await ApiService.updateProfile(p);
      if (res.ok) {
        this.state.value = { ...this.state.value, isSaving: false, feedback: { type: 'success', text: 'Alterações salvas com sucesso!' } };
      } else {
        this.state.value = { ...this.state.value, isSaving: false, feedback: { type: 'error', text: 'Não foi possível salvar.' } };
      }
    } catch (err) {
      this.state.value = { ...this.state.value, isSaving: false, feedback: { type: 'error', text: 'Falha de comunicação.' } };
    }
  }
}

const profileViewModel = new ProfileViewModel();
