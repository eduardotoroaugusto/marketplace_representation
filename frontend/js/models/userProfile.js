// js/models/userProfile.js
class UserProfile {
  constructor({ name, email, phone, cpf, cep, address }) {
    this.name = name;
    this.email = email;      // vinculado à conta Google (somente leitura)
    this.phone = phone;
    this.cpf = cpf;
    this.cep = cep;
    this.address = address;
  }
}
