# Carrinho de Compras Interativo — Marketplace

Projeto da disciplina **Programação em Ambiente Visual** (Opção D): aplicação web orientada a eventos com catálogo, carrinho, cupons, perfil, notificações e o minijogo **Cosmo Arcade**, cujos pontos viram desconto na compra.

| Parte | Tecnologia | Documentação |
|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript puro, MVVM | [`docs/FRONTEND.md`](docs/FRONTEND.md) |
| Backend | Dart + Shelf, MVVM | [`backend/README.md`](backend/README.md) e Swagger em `http://localhost:8081/docs` |
| Planejamento | Arquitetura, contrato da API, requisitos | [`plano_de_projeto.md`](plano_de_projeto.md) |

## Rodando o projeto

```bash
# Terminal 1 — API
cd backend
dart pub get
dart run bin/server.dart        # http://localhost:8081  (Swagger: /docs)

# Terminal 2 — Frontend
cd frontend
python -m http.server 5500      # ou Live Server do VS Code na porta 5500
```

Abra **http://localhost:5500/index.html**, crie uma conta e entre.

## Testes

```bash
cd backend && dart test         # unitários + integração + consistência do Swagger
```

O frontend tem um checklist manual em [`docs/FRONTEND.md`](docs/FRONTEND.md#16-como-testar).
