// js/services/api.js

// Hash SIMPLES (algoritmo djb2) só para o mock não guardar a senha em texto puro.
// NÃO é seguro de verdade: um hash de senha real precisa ser lento e com salt (ex.: bcrypt),
// o que ficará por conta do backend. Aqui é apenas simulação de frontend.
function simpleHash(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  // >>> 0 converte para inteiro sem sinal; toString(16) deixa em hexadecimal
  return (hash >>> 0).toString(16);
}

// Chave do localStorage separada por usuário logado (ex.: 'arcade:joao@email.com'),
// para que carrinho, pontos, perfil e notificações não passem de uma conta para outra
function userKey(base) {
  return `${base}:${localStorage.getItem('authEmail') || ''}`;
}

const ApiService = {

  // Função para simular o CADASTRO de um novo usuário
  register: async (name, email, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_cadastrados')) || [];

        const usuarioExiste = usuariosSalvos.find(u => u.email === email);
        if (usuarioExiste) {
          resolve({ ok: false, error: 'Este e-mail já está em uso.' });
          return;
        }

        // Salva o novo usuário guardando apenas o hash da senha, nunca o texto puro
        const novoUsuario = { name, email, passwordHash: simpleHash(password) };
        usuariosSalvos.push(novoUsuario);
        localStorage.setItem('usuarios_cadastrados', JSON.stringify(usuariosSalvos));

        resolve({ ok: true });
      }, 800);
    });
  },
  // Função atualizada para simular o LOGIN buscando no localStorage
  login: async (email, password) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 1. Busca a lista de usuários salvos
        const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios_cadastrados')) || [];
        
        // 2. Procura um usuário com e-mail e hash de senha correspondentes
        const senhaHash = simpleHash(password);
        const usuarioValido = usuariosSalvos.find(u => u.email === email && u.passwordHash === senhaHash);

        if (usuarioValido) {
          // Retorna sucesso, um token simulado e o nome (para o cabeçalho da home)
          resolve({ ok: true, token: 'mock_token_opaco_' + new Date().getTime(), name: usuarioValido.name });
        } else {
          // Retorna erro se não encontrar
          resolve({ ok: false, error: 'Credenciais inválidas ou usuário não encontrado!' });
        }
      }, 1000); // Simulando o tempo de internet
    });
  },

  // Função para simular o GET /products (produtos da home do Figma)
  getProducts: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Lista simulada baseada no contrato da API (id, nome, preço, estoque) + categoria e avaliação
        resolve({
          ok: true,
          data: [
            { id: 1, name: 'Smart TV 4K 55"',           price: 2499.00, stock: 8,  category: 'Eletrônicos', rating: 4.0 },
            { id: 2, name: 'Smartphone 128GB Pro',       price: 4199.00, stock: 5,  category: 'Eletrônicos', rating: 4.0 },
            { id: 3, name: 'Camiseta Algodão Básica',    price: 59.90,   stock: 20, category: 'Roupas',      rating: 4.0 },
            { id: 4, name: 'Tênis Corrida Performance',  price: 349.90,  stock: 12, category: 'Esportes',    rating: 4.0 },
            { id: 5, name: 'Caneca Cerâmica Térmica',    price: 89.00,   stock: 15, category: 'Casa',        rating: 4.0 },
            { id: 6, name: 'Livro: Design de Interfaces UX', price: 120.00, stock: 7, category: 'Livros',    rating: 4.0 }
          ]
        });
      }, 500);
    });
  },

  // Função para simular o GET do perfil do usuário
  getProfile: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const salvo = JSON.parse(localStorage.getItem(userKey('userProfile')));
        const padrao = {
          name: localStorage.getItem('authUser') || 'João da Silva',
          email: localStorage.getItem('authEmail') || 'joao.usuario@gmail.com',
          phone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          cep: '01311-200',
          address: 'Av. Paulista, 1000'
        };
        resolve({ ok: true, data: salvo || padrao });
      }, 300);
    });
  },

  // Função para simular o PUT/PATCH do perfil
  updateProfile: async (data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        localStorage.setItem(userKey('userProfile'), JSON.stringify(data));
        if (data.name) {
          // Mantém o nome exibido no cabeçalho em sincronia
          localStorage.setItem('authUser', data.name);
          // ...e no cadastro, para o próximo login não trazer o nome antigo de volta
          const usuarios = JSON.parse(localStorage.getItem('usuarios_cadastrados')) || [];
          const usuario = usuarios.find(u => u.email === localStorage.getItem('authEmail'));
          if (usuario) {
            usuario.name = data.name;
            localStorage.setItem('usuarios_cadastrados', JSON.stringify(usuarios));
          }
        }
        resolve({ ok: true });
      }, 600);
    });
  },

  // Função para simular o GET das notificações
  getNotifications: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const salvo = JSON.parse(localStorage.getItem(userKey('notifications')));
        const padrao = [
          { id: 1, icon: 'package',        title: 'Seu pedido #8475 de TV 4K foi entregue com sucesso no seu endereço cadastrado.', time: 'há 2 min',   read: false },
          { id: 2, icon: 'alert-triangle', title: 'Detectamos um novo login de dispositivo desconhecido na sua conta em São Paulo, SP.', time: 'há 20 min',  read: false },
          { id: 3, icon: 'tag',            title: 'Cupom imperdível: Ganhe 15% de desconto usando o código WIRE15 na sua próxima compra.', time: 'há 2 horas', read: true },
          { id: 4, icon: 'package',        title: 'Seu pagamento foi confirmado para o pedido #8475 e o envio está sendo preparado.',       time: 'há 1 dia',   read: true },
          { id: 5, icon: 'package',        title: 'Seu carrinho atual tem itens esperando! Finalize sua compra hoje para garantir frete grátis.', time: 'há 3 dias', read: true }
        ];
        resolve({ ok: true, data: salvo || padrao });
      }, 300);
    });
  },

  // Função para persistir o estado das notificações (lidas/removidas)
  saveNotifications: async (list) => {
    return new Promise(resolve => {
      localStorage.setItem(userKey('notifications'), JSON.stringify(list));
      resolve({ ok: true });
    });
  },

  // Função para simular o GET do saldo/recorde do Cosmo Arcade
  getArcadeStats: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ ok: true, data: readArcadeStats() });
      }, 300);
    });
  },

  // Função para persistir saldo, recorde e partidas do dia
  saveArcadeStats: async (data) => {
    return new Promise(resolve => {
      localStorage.setItem(userKey('arcade'), JSON.stringify(data));
      resolve({ ok: true });
    });
  },

  // Função para simular o resgate de pontos no checkout
  spendPoints: async (amount) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const stats = readArcadeStats();
        if (stats.points < amount) {
          resolve({ ok: false, error: 'Saldo de pontos insuficiente.' });
          return;
        }
        stats.points -= amount;
        localStorage.setItem(userKey('arcade'), JSON.stringify(stats));
        resolve({ ok: true, points: stats.points });
      }, 300);
    });
  }
};

// Lê o estado do arcade salvo, zerando as partidas quando o dia muda
function readArcadeStats() {
  const d = new Date(); // data local (toISOString usaria UTC e viraria o dia às 21h)
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const salvo = JSON.parse(localStorage.getItem(userKey('arcade')) || 'null');
  const stats = salvo || { points: 250, hiScore: 0, playsDate: today, playsToday: 0 };
  if (stats.playsDate !== today) {
    stats.playsDate = today;
    stats.playsToday = 0;
  }
  return stats;
}